import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

const Input = (props: InputProps) => {
  return (
    <div>
      <label htmlFor={props.id} className="mb-2 block text-sm font-medium">
        {props.name}
      </label>
      <input
        {...props}
        type="text"
        className={`block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${props.className}`}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export default Input;
