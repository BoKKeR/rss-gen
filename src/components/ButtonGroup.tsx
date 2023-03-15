import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: string;
  buttons: {
    id: string;
    title: string;
  }[];
  onClick: any;
}

const ButtonGroup = (props: ButtonProps) => {
  const buttons = props.buttons.map((button, index) => {
    const isFirst = index === 0;
    const isLast = props.buttons.length - 1 === index;
    const isActive = props.selected === button.id;

    const dynamicFirstClasses = isFirst && "border rounded-l-lg";
    const dynamicMidClasses = !isLast && !isFirst && "border-t border-b";
    const dynamicLastClasses = isLast && "border rounded-r-md";
    const dynamicActive = isActive ? "dark:bg-gray-700" : "dark:bg-gray-400";

    return (
      <button
        key={button.id}
        id={button.id}
        onClick={props.onClick}
        type="button"
        className={`bg-white px-4 py-2 text-sm font-medium text-gray-900 ${dynamicActive} ${dynamicMidClasses} ${dynamicFirstClasses} ${dynamicLastClasses} focus:text-blue-70 border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500`}
      >
        {button.title}
      </button>
    );
  });

  return (
    <>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        {buttons}
      </div>
    </>
  );
};
export default ButtonGroup;
