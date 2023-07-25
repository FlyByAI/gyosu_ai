import React from "react";
import TextInputForm from "../../components/forms/TextInputForm";
import DisplayResponse from "../../components/DisplayResponse";
import { notSecretConstants } from "../../constants/notSecretConstants";
import useSubmitText from "../../hooks/tools/useSubmitText";
import ResponseFeedback from "../../components/ResponseFeedback";

const PlaceSearch: React.FC = () => {

  const { submitText, isLoading, error, data } = useSubmitText(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/place-search/`); // use the hook

  const validatePlaceName = (placeName: string) => {
    // Add place name validation logic here. For example, you could check if the name is not empty.
    return placeName.trim() !== "";
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mt-8 mb-4 dark:text-white">Place Search Tool</h1>

      {/* Tool Image */}
      <div className="flex justify-center mb-4">
        <img className="w-64" src={"../images/place_search.png"} alt={"title"} />
      </div>

      {/* Place Name input */}
      <div className="max-w-md mx-auto p-4 shadow-md rounded-md">
        <TextInputForm
          label="Search for a restaurant, item, or place using text. (e.g. 'Starbucks near me' or 'buy a kite')"
          placeholder="Enter text here"
          validator={validatePlaceName}
          onSubmit={submitText}
        />
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
      {data && <ResponseFeedback responseText={data ? data.message : null} toolName={"Place Search"} />}

    </div>
  );
};

export default PlaceSearch;
