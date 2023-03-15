import { FunctionComponent, InputHTMLAttributes } from "react";

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {}

const Toggle: FunctionComponent<ToggleProps> = (props) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        onClick={props.onClick}
        type="checkbox"
        defaultChecked={props.checked}
        className="peer sr-only"
      />
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />

      <p className="ml-3 text-sm font-medium text-gray-900">{props.children}</p>
    </label>
  );
};

export default Toggle;
