import { useClerk } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import humps from "humps";

const fetchDocumentDownload = async (endpoint: string, blobName: string, token: string | null) => {
    const response = await fetch(`${endpoint}/cloud_storage_document/${blobName}`, {
        method: 'GET',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return humps.camelizeKeys(responseData);
};

const useGetDocumentDownload = (endpoint: string) => {
    const { session } = useClerk();

    const mutation = useMutation(async (blobName: string) => {
        const token = session ? await session.getToken() : 'none';
        return fetchDocumentDownload(endpoint, blobName, token);
    });

    return {
        getDocumentDownload: mutation.mutate,
        isLoading: mutation.isLoading,
        error: mutation.error,
        data: mutation.data,
    };
};

export default useGetDocumentDownload;