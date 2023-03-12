import { HTMLAttributes } from "react";
import * as Parser from "rss-parser";

interface CardProps extends HTMLAttributes<HTMLElement> {
  item: Partial<Parser.Item>;
}

const Card = (props: CardProps) => {
  let regex = /<img src="([^"]*)"/;

  let imageSrc =
    props.item.content &&
    // @ts-ignore
    regex.exec(props.item.content)[1].replaceAll("&amp;", "&");

  return (
    <>
      <div className="w-full lg:max-w-full lg:flex rounded-r-lg">
        {props.item.content && (
          <div
            className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-l-lg text-center overflow-hidden"
            style={{ backgroundImage: `url(${imageSrc})` }}
            title={props.item.title}
          />
        )}
        <div className="w-full border-r border-b border-l border-gray-400 hover:bg-sky-100 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <a href={props.item.link} target="_blank">
            <div className="mb-8">
              <div className="text-gray-900 font-bold text-xl mb-2">
                {props.item.title}
              </div>

              <p className="text-gray-700 text-base">
                {props.item.description}
              </p>
              <p className="text-gray-700 text-base">
                {props.item.contentSnippet}
              </p>
            </div>
            <div className="flex items-center">
              <div className="text-sm">
                {/* @ts-ignore */}
                <p className="text-gray-900 leading-none">
                  {props.item.creator}
                </p>
                <p className="text-gray-600">{props.item.pubDate}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default Card;
