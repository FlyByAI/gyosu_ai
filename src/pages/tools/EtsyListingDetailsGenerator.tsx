import React, { useEffect } from "react";
import DisplayResponse from "../../components/DisplayResponse";
import IdeaGenerationForm from "../../components/forms/IdeaGenerationForm";
import useSubmitIdea from "../../hooks/tools/useSubmitEtsyInfo";
import { notSecretConstants } from "../../constants/notSecretConstants";
import ResponseFeedback from "../../components/ResponseFeedback";

const EtsyListingDetailsGenerator: React.FC = () => {

  const { submitEtsyInfo, isLoading, error, data } = useSubmitIdea(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/etsy_listing_app/create_listing_details/`); // use the hook

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mt-8 mb-4 dark:text-white">Etsy Listing Details Creation Tool</h1>

      {/* Tool Image */}
      <div className="flex justify-center mb-4">
        <img className="w-64" src={"/images/kicksent_a_logo_for_a_Etsy_Idea_Search_tool_that_features_An_in_9d5fbee2-1193-4062-942b-feaaba5e8595.png"} alt={"Etsy Idea Generator Tool"} />
      </div>

      <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
        Fill out the information below, and the AI will generate tags, title, and description for your listing.
      </h3>

      {/* Idea input */}
      <div className="max-w-md mx-auto p-4 shadow-md rounded-md">
        <IdeaGenerationForm onSubmit={submitEtsyInfo} />
      </div>

      {/* Show error message if there's any */}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      {/* Show loading spinner if loading */}
      {isLoading && (
        <div className="flex justify-center mt-4">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}
      <DisplayResponse label="Response:" message={data ? data.message : null} />
      <ResponseFeedback responseText={data ? data.message : null} toolName={"EtsyListingDetailsGenerator"} />

    </div>
  );
};

export default EtsyListingDetailsGenerator;
