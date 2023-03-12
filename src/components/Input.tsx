import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

const Input = (props: InputProps) => {
  return (
    <div>
      <label htmlFor={props.id} className="block mb-2 text-sm font-medium">
        {props.name}
      </label>
      <input
        {...props}
        type="text"
        className={`bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${props.className}`}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export default Input;
