import { getFeedData } from "@/network/axios";
import decodeHTMLEntities from "@/utils/decodeHtml";
import Image from "next/image";
import { HTMLAttributes } from "react";
import * as Parser from "rss-parser";

interface CardProps extends HTMLAttributes<HTMLElement> {
  item: Partial<Parser.Item>;
}

const Card = (props: CardProps) => {
  // maybe cus its async? async parts need to use useEffect https://stackoverflow.com/questions/57847626/using-async-await-inside-a-react-functional-component

  /*   let parser = new Parser();

  let feedReq = await getFeedData("https://www.reddit.com/r/funny/new/.rss");

  // @ts-ignore
  let feed = await parser.parseString(feedReq); */

  let regex = /<img src="([^"]*)"/;
  console.log("content", props.item);

  let imageSrc =
    props.item.content &&
    regex.exec(props.item.content)[1].replaceAll("&amp;", "&");

  return (
    <>
      <div className="max-w-sm w-full lg:max-w-full lg:flex rounded-r-lg">
        <div
          className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-l-lg text-center overflow-hidden"
          style={{ backgroundImage: `url(${imageSrc})` }}
          title="Woman holding a mug"
        />
        <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <a href={props.item.link} target="_blank">
              <div className="text-gray-900 font-bold text-xl mb-2">
                {props.item.title}
              </div>
            </a>
            <p className="text-gray-700 text-base">{props.item.content}</p>
          </div>
          <div className="flex items-center">
            <div className="text-sm">
              <p className="text-gray-900 leading-none">{props.item.author}</p>
              <p className="text-gray-600">{props.item.pubDate}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
