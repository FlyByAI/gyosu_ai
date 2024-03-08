import React from "react";

interface DisplayResponseProps {
  label: string;
  message: string | null;
  ResponseComponent?: React.FC<any> | null;
  responseProps?: { [key: string]: any };
}

const DisplayResponse: React.FC<DisplayResponseProps> = ({ label, message, ResponseComponent, responseProps }) => {
  if (!message) return null;

  return (
    <div className="p-4 bg-white dark:bg-gray-900 shadow-md rounded-md w-full">
      {ResponseComponent ? <ResponseComponent {...responseProps} /> :
        <>
          <h2 className="text-xl font-bold mb-2 dark:text-gray-300 pe-4 place-self-end">{label}</h2>
          <p className="text-gray-700 dark:text-gray-300 pe-4 place-self-center mr-auto">{message}</p>
        </>
      }
    </div>
  );
};

export default DisplayResponse;
