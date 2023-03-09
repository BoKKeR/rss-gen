import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

const Input = (props: InputProps) => {
  return (
    <>
      <label htmlFor={props.id} className="block mb-2 text-sm font-medium">
        {props.name}
      </label>
      <input
        type="text"
        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={props.placeholder}
        {...props}
      />
    </>
  );
};

export default Input;
