import { useState } from 'react';

interface UseGcpUploaderReturn {
    uploading: boolean;
    url: string | null;
    error: Error | null;
    uploadToGcp: (dataUrl: string, filePath: string) => Promise<void>;
}

const useGcpUploader = (bucketName: string): UseGcpUploaderReturn => {
    const [uploading, setUploading] = useState<boolean>(false);
    const [url, setUrl] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // const storage = new Storage();  // Initialize Google Cloud Storage
    // const bucket = storage.bucket(bucketName);

    const uploadToGcp = async (dataUrl: string, filePath: string) => {
        setUploading(true);

        // const base64EncodedImageString = dataUrl.replace(/^data:image\/\w+;base64,/, '');
        // const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');

        // const file = bucket.file(filePath);

        try {
            // await file.save(imageBuffer, {
            //     gzip: true,
            //     public: true,
            //     metadata: {
            //         cacheControl: 'public, max-age=31536000',  // One year
            //         contentType: 'image/png',
            //     },
            // });

            setUrl(`https://picsum.photos/536/354`);
        } catch (err) {
            setError(err);
        } finally {
            setUploading(false);
        }
    };

    return { uploading, url, error, uploadToGcp };
};

export default useGcpUploader;
