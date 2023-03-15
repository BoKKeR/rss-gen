import { AllHTMLAttributes } from "react";

interface AllProps extends AllHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onClick: any;
}

const Tab = (props: AllProps) => {
  const activeProps = props.active
    ? "bg-gray-50 cursor-default"
    : "text-white bg-blue-600 hover:bg-gray-600 cursor-pointer";

  return (
    <>
      <li className="mr-2">
        <a
          onClick={props.onClick}
          aria-current="page"
          className={`active inline-block rounded-t-lg p-4 ${activeProps}`}
          id={props.id}
        >
          {props.title}
        </a>
      </li>
      {props.children}
    </>
  );
};

export default Tab;
