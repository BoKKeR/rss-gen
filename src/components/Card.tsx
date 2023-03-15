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
      <div className="w-full rounded-r-lg lg:flex lg:max-w-full">
        {props.item.content && (
          <div
            className="h-48 flex-none overflow-hidden rounded-l-lg bg-cover text-center lg:h-auto lg:w-48"
            style={{ backgroundImage: `url(${imageSrc})` }}
            title={props.item.title}
          />
        )}
        <div className="flex w-full flex-col justify-between rounded-b border-r border-b border-l border-gray-400 bg-white p-4 leading-normal hover:bg-sky-100 lg:rounded-b-none lg:rounded-r lg:border-t lg:border-gray-400">
          <a href={props.item.link} target="_blank">
            <div className="mb-8">
              <div className="mb-2 text-xl font-bold text-gray-900">
                {props.item.title}
              </div>

              <p className="text-base text-gray-700">
                {/* @ts-ignore */}
                {props.item.description}
              </p>
              <p className="text-base text-gray-700">
                {props.item.contentSnippet}
              </p>
            </div>
            <div className="flex items-center">
              <div className="text-sm">
                <p className="leading-none text-gray-900">
                  {props.item.creator}
                </p>
                <p className="text-gray-600">{props.item.pubDate}</p>
                <p>link: {props.item.link}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default Card;
