import React, { useEffect } from "react";
import TextInputForm from "../../components/forms/TextInputForm";
import DisplayResponse from "../../components/DisplayResponse";
import { notSecretConstants } from "../../constants/notSecretConstants";
import useSubmitSearch from "../../hooks/tools/useSubmitSearch";
import ResponseFeedback from "../../components/ResponseFeedback";
import RestaurantResponse from "../../components/RestaurantResponse";
import { IRestaurant } from "../../interfaces";

const RestaurantSearch: React.FC = () => {

  const { submitSearch, isLoading, error, data } = useSubmitSearch(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/restaurant_search/find_restaurant/`, true); // use the hook

  const validateSearch = (searchString: string) => {
    // Add search string validation logic here. For example, you could check if the string is not empty.
    return searchString.trim() !== "";
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mt-8 mb-4 dark:text-white">Restaurant Search Tool</h1>

      {/* Tool Image */}
      <div className="flex justify-center mb-4">
        <img className="w-64" src={"../../images/kicksent_a_magnifying_glass_looking_for_food_no_background_7412f6e1-e6d4-4a12-b1f9-07390dc8ca90.png"} alt={"title"} />
      </div>

      {/* Search input */}
      <div className="max-w-md mx-auto p-4 shadow-md rounded-md">
        <TextInputForm
          label="Search for a restaurant using text. (e.g. 'Pizza place near me')"
          placeholder="Enter text here"
          validator={validateSearch}
          onSubmit={submitSearch}
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
      {data ? data.results.map((restaurant: IRestaurant) => {
        const toolName = "Restaurant Search"
        const message = `Selection Reason: ${restaurant.selectionReason} Phone: ${restaurant.contact} Website: ${restaurant.website}`
        return (
          <div className="p-4 bg-white dark:bg-gray-900 shadow-md rounded-md">
            <div className="flex">
              <>
                <DisplayResponse label={`${restaurant.name}:`} message={message} ResponseComponent={RestaurantResponse} responseProps={{ restaurant }} />
                {data && <ResponseFeedback responseText={message} toolName={toolName} />}
              </>
            </div >
          </div >)
      }) : null}

    </div >
  );
};

export default RestaurantSearch;
