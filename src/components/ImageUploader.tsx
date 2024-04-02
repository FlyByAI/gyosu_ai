import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onFileUpload: (file: File) => void; // Callback function to update state in the parent
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Assuming you only need to handle single file uploads for simplicity
    const file = acceptedFiles[0];
    onFileUpload(file);
  }, [onFileUpload]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false});

  return (
    <div {...getRootProps()} className="p-4 border-dashed border-2 border-gray-300 text-center cursor-pointer">
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the image here ...</p> :
          <p>Drag 'n' drop an image here, or click to select one</p>
      }
    </div>
  );
};

export default ImageUploader;
