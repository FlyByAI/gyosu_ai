import { useClerk } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import humps from "humps";
import { DocumentDownload } from "../../../pages/Documents";

const fetchDocumentDownload = async (endpoint: string, blobName: string, token: string | null): Promise<DocumentDownload> => {
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
    return humps.camelizeKeys(responseData) as DocumentDownload;
};

const useGetDocumentDownload = (endpoint: string) => {
    const { session } = useClerk();

    const mutation = useMutation<DocumentDownload, Error, { blobName: string, newWindow: Window | null }>(
        async ({ blobName, newWindow }): Promise<DocumentDownload> => {
            const token = session ? await session.getToken() : 'none';
            const documentDownload = await fetchDocumentDownload(endpoint, blobName, token);

            if (newWindow && documentDownload.signedUrl) {
                newWindow.location.href = documentDownload.signedUrl;
            }

            return documentDownload;
        }
    );

    return {
        getDocumentDownload: (blobName: string, newWindow: Window | null) => {
            mutation.mutate({ blobName, newWindow });
        },
        isLoading: mutation.isLoading,
        error: mutation.error,
        data: mutation.data,
    };
};

export default useGetDocumentDownload;
