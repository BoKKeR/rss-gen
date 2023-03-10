// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import redisString from "@/constants/redis";
import builder from "xmlbuilder";

let redis = new Redis(redisString);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  const redisResult = await redis.lrange("list", 0, -1);
  const results = redisResult.map((item) => JSON.parse(item)) as {
    title: string;
    subtitle: string;
    link: string;
    content: string;
  }[];
  const root = builder.create("rss", { version: "2.0" });
  const channel = root.ele("channel");
  channel.ele("title", undefined, "RSS-GEN");
  channel.ele("description", undefined, "test rss feed");
  channel.ele("link", undefined, "https://rss.google.com");
  const item = channel.ele("item");
  item.ele("content", { type: "html" });
  item.ele("title", undefined, "test");
  item.ele("description", undefined, "subtitle");
  item.ele("link", undefined, "https://www.google.com");

  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;

  xml += `<channel><description>RSS is a fascinating technology. The uses for RSS are expanding daily. Take a closer look at how various industries are using the benefits of RSS in their businesses.</description>
  <link>http://www.feedforall.com/industry-solutions.htm</link>
  <category domain="www.dmoz.com">Computers/Software/Internet/Site Management/Content Management</category>
  <copyright>Copyright 2004 NotePage, Inc.</copyright>
  <docs>http://blogs.law.harvard.edu/tech/rss</docs>
  <language>en-us</language>
  <lastBuildDate>Tue, 19 Oct 2004 13:39:14 -0400</lastBuildDate>
  <managingEditor>marketing@feedforall.com</managingEditor>
  <pubDate>Tue, 19 Oct 2004 13:38:55 -0400</pubDate>
  <webMaster>webmaster@feedforall.com</webMaster>
  <generator>FeedForAll Beta1 (0.0.1.8)</generator>`;

  results.forEach((item) => {
    const content = `<content type="html">&lt;table&gt; &lt;tr&gt;&lt;td&gt; &lt;a href=&quot;https://www.reddit.com/r/funny/comments/11mz9b9/while_on_marthastewartcom_an_unfortunate/&quot;&gt; &lt;img src=&quot;${item.content}&quot; alt=&quot;While on MarthaStewart.com an unfortunate advertisement appeared in the beginning of the recipe.&quot; title=&quot;While on MarthaStewart.com an unfortunate advertisement appeared in the beginning of the recipe.&quot; /&gt; &lt;/a&gt; &lt;/td&gt;&lt;td&gt; &amp;#32; submitted by &amp;#32; &lt;a href=&quot;https://www.reddit.com/user/marcusnelson&quot;&gt; /u/marcusnelson &lt;/a&gt; &lt;br/&gt; &lt;span&gt;&lt;a href=&quot;https://i.redd.it/p3kyqmvwpsma1.jpg&quot;&gt;[link]&lt;/a&gt;&lt;/span&gt; &amp;#32; &lt;span&gt;&lt;a href=&quot;https://www.reddit.com/r/funny/comments/11mz9b9/while_on_marthastewartcom_an_unfortunate/&quot;&gt;[comments]&lt;/a&gt;&lt;/span&gt; &lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;</content>`;
    {
      xml += `
    <item>
    <title>${item.title}</title>
    <link>${item.link}</link>
    <description>${item.subtitle}</description>
    ${content}
    </item>`;
    }
  });
  xml += `</channel>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(root.end({ pretty: true }));
};

const clear = async (req: NextApiRequest, res: NextApiResponse) => {
  redis.del("list");
  res.status(200).send("deleted");
};

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body) {
    return res.status(422).send("no body");
  }

  redis.lpush("list", JSON.stringify(req.body));
  res.status(200).send("nice");
};
