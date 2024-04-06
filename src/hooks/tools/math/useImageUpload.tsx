import { useClerk } from '@clerk/clerk-react';
import { UseMutationResult, useMutation } from '@tanstack/react-query';
import humps from 'humps';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';

interface ImageUploadResponse {
  response: string;
  problems: string[];
  instructions: string;
}

interface ImageUploadFormData {
  description?: string;
  image: File;
}

const useImageUpload = (endpoint: string) => {
  const { session } = useClerk();
  const { language } = useLanguage();
  const siteLanguage = languageNames[language];

  const imageUploadMutation: UseMutationResult<ImageUploadResponse, Error, ImageUploadFormData, unknown> = useMutation(
    async (formData: ImageUploadFormData): Promise<ImageUploadResponse> => {
      const token = session ? await session.getToken() : "none";

      // Corrected: Directly using the formData parameter now
      const { image, description } = formData;

      const originalName = image.name;
      const lastModified = new Date(image.lastModified).toISOString(); // Convert to ISO string for compatibility
      const size = image.size;
      const fileType = image.type; // MIME type, e.g., 'image/jpeg'

      const form = new FormData();
      form.append('image', image);
      form.append('description', description || '');
      form.append('original_name', originalName);
      form.append('last_modified', lastModified);
      form.append('size', size.toString()); // Ensure size is a string
      form.append('file_type', fileType); // Append MIME type
      form.append('site_language', siteLanguage);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data' will be set automatically
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: form,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json()
      return humps.camelizeKeys(responseData) as ImageUploadResponse;
    }
  );

  return {
    uploadImage: imageUploadMutation.mutate,
    isLoading: imageUploadMutation.isLoading,
    error: imageUploadMutation.error,
    data: imageUploadMutation.data,
    reset: imageUploadMutation.reset,
  };
};

export default useImageUpload;
