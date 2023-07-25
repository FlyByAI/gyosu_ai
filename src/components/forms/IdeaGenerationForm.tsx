import React, { useState } from 'react';

interface IdeaGenerationFormProps {
  onSubmit: (args: { shopInformation: string, productInformation: string, targetAudience: string, additionalText: string }) => void;
}

const IdeaGenerationForm = ({ onSubmit }: IdeaGenerationFormProps) => {
  const [shopInformation, setShopInformation] = useState("");
  const [productInformation, setProductInformation] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [additionalText, setAdditionalText] = useState("Please create tags, title, and description for my new listing. ");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Call the onSubmit function passed as a prop
    onSubmit({ shopInformation, productInformation, targetAudience, additionalText });
  };

  return (

    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-gray-700 dark:text-gray-300">Product Information</span>
        <textarea placeholder={"Print on demand design on a yellow C1717 shirt with a picture of a sunflower"} value={productInformation} onChange={(e) => setProductInformation(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700 dark:text-gray-300">Target Audience</span>
        <textarea placeholder={"Tell the AI who you will likely buy your product"} value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700 dark:text-gray-300">Shop Information</span>
        <textarea placeholder={"Describe your shop"} value={shopInformation} onChange={(e) => setShopInformation(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <label className="block">
        <span className="text-gray-700 dark:text-gray-300">Additional Info (Optional)</span>
        <textarea placeholder={""} value={additionalText} onChange={(e) => setAdditionalText(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </label>

      <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Generate Etsy Listing Details
      </button>
    </form>
  );
};

export default IdeaGenerationForm;
