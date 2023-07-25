import React, { useState, ChangeEvent, FormEvent } from "react";

interface TextInputFormProps {
  onSubmit: (input: string) => void;
  label: string;
  placeholder: string;
  validator?: (input: string) => boolean;
}

const TextInputForm: React.FC<TextInputFormProps> = ({ onSubmit, label, placeholder, validator }) => {
  const [input, setInput] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validator && !validator(input)) {
      setIsValid(false);
      return;
    }
    onSubmit(input);
    setInput("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (validator) {
      setIsValid(validator(e.target.value));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="TextInputForm" className="block font-semibold mb-2 dark:text-white">
          {label}:
        </label>
        <div className="flex">
          <input
            id="TextInputForm"
            type="text"
            value={input}
            onChange={handleInputChange}
            className={`border ${isValid ? "border-gray-300" : "border-red-600"} rounded-l px-4 py-2 w-full focus:outline-none focus:ring-2 ${isValid ? "focus:ring-blue-500" : "focus:ring-red-500"}`}
            placeholder={placeholder}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
        {!isValid && <p className="text-red-600 mt-2">Invalid input. Please check again.</p>}
      </form>
    </>
  );
};

export default TextInputForm;
