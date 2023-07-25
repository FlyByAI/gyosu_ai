import React, { useState, ChangeEvent, FormEvent } from "react";

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  label: string;
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({ onSubmit, label }) => {
  const [url, setUrl] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(url);
    setUrl("");
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="UrlInputForm" className="block font-semibold mb-2 dark:text-white">
          {label}
        </label>
        <div className="flex">
          <input
            id="UrlInputForm"
            type="text"
            value={url}
            onChange={handleUrlChange}
            className="border border-gray-300 rounded-l px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default UrlInputForm;
