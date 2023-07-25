import React from "react";
import UrlInputForm from "../../components/forms/UrlInputForm";
import useSubmitUrl from "../../hooks/tools/useSubmitUrl";
import { notSecretConstants } from "../../constants/notSecretConstants";
import Chat from "../../components/Chat";
import ResponseFeedback from "../../components/ResponseFeedback";
import DisplayResponse from "../../components/DisplayResponse";



const Youtube: React.FC = () => {

  const { submitUrl, isLoading, error, data } = useSubmitUrl(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/youtube/summary/`); // use the hook

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mt-8 mb-4 dark:text-white">YouTube Summary Tool</h1>

      {/* Tool Image */}
      <div className="flex justify-center mb-4">
        <img className="w-64" src={"../images/kicksent_a_logo_for_a_tool_that_is_called_YouTube_Video_Time_Sa_3bb1c717-e384-4602-a5de-e378c039fa34.png"} alt={"title"} />
      </div>

      {/* URL input */}
      <div className="max-w-md mx-auto p-4 shadow-md rounded-md">
        <UrlInputForm label="Youtube Video" onSubmit={submitUrl} />
      </div>

      {/* Show error message if there's any */}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      {/* Show loading spinner if loading */}
      {isLoading && (
        <div className="flex justify-center mt-4">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}

      {data?.sessionId && `Session Id: ${data?.sessionId}`}
      <DisplayResponse label="Summary: " message={data ? data.message : null} />
      {data && <ResponseFeedback responseText={data ? data.message : null} toolName={"Youtube Summarizer"} />}

      {data?.sessionId && <Chat sessionId={data?.sessionId} />}

    </div>
  );
};

export default Youtube;
