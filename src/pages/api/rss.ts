// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import { create } from "xmlbuilder2";
import constants from "@/constants";

let redis = new Redis(constants.redisString);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.user) {
    return;
  }

  switch (req.method) {
    case "GET":
      return await get(req, res);
    case "DELETE":
      return await clear(req, res);
    case "POST":
      return await add(req, res);

    default:
      break;
  }
}

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const redisResult = await redis.lrange(`list_${req.query.user}`, 0, -1);

  const results = redisResult.map((item) => JSON.parse(item)) as {
    title: string;
    subtitle: string;
    link: string;
    content: string;
  }[];
  const root = create({ version: "1.0" })
    .ele("rss", { version: "2.0" })
    .ele("channel")
    .ele("title")
    .txt("RSS-GEN")
    .up()
    .ele("description")
    .txt("test rss feed")
    .up()
    .ele("link")
    .txt("https://rss.google.com")
    .up();

  results.forEach((item) => {
    const content = `<content type="html">&lt;table&gt; &lt;tr&gt;&lt;td&gt; &lt;a href=&quot;https://www.reddit.com/r/funny/comments/11mz9b9/while_on_marthastewartcom_an_unfortunate/&quot;&gt; &lt;img src=&quot;${item.content}&quot; alt=&quot;While on MarthaStewart.com an unfortunate advertisement appeared in the beginning of the recipe.&quot; title=&quot;While on MarthaStewart.com an unfortunate advertisement appeared in the beginning of the recipe.&quot; /&gt; &lt;/a&gt; &lt;/td&gt;&lt;td&gt; &amp;#32; submitted by &amp;#32; &lt;a href=&quot;https://www.reddit.com/user/marcusnelson&quot;&gt; /u/marcusnelson &lt;/a&gt; &lt;br/&gt; &lt;span&gt;&lt;a href=&quot;https://i.redd.it/p3kyqmvwpsma1.jpg&quot;&gt;[link]&lt;/a&gt;&lt;/span&gt; &amp;#32; &lt;span&gt;&lt;a href=&quot;https://www.reddit.com/r/funny/comments/11mz9b9/while_on_marthastewartcom_an_unfortunate/&quot;&gt;[comments]&lt;/a&gt;&lt;/span&gt; &lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;</content>`;
    {
      root
        .ele("item")
        .ele("title")
        .txt(item.title)
        .up()
        .ele("description")
        .txt(item.subtitle)
        .up()
        .ele("link")
        .txt(item.link);
    }
  });

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(root.end({ prettyPrint: true }));
};

const clear = async (req: NextApiRequest, res: NextApiResponse) => {
  redis.del(`list_${req.query.user}`);
  res.status(200).send("deleted");
};

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body) {
    return res.status(422).send("no body");
  }

  redis.lpush(`list_${req.query.user}`, JSON.stringify(req.body));
  return await get(req, res);
};
