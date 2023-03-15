import { InputHTMLAttributes } from "react";

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

const CheckBox = (props: CheckBoxProps) => {
  const { children, ...propsNoChildren } = props;

  return (
    <div className="">
      <input
        {...propsNoChildren}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
      />

      <label htmlFor={props.id}>{props.children}</label>
    </div>
  );
};
export default CheckBox;
