import { useClerk } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import humps from "humps";
import { DocumentDownload } from "../../../pages/Documents";

const fetchDocumentDownload = async (endpoint: string, blobName: string, token: string | null, documentOrAnswerKey: "document" | "answer_key"): Promise<DocumentDownload> => {
    const response = await fetch(`${endpoint}/cloud_storage_document/${blobName}/${documentOrAnswerKey}/`, {
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

    const mutation = useMutation<DocumentDownload, Error, { blobName: string, newWindow: Window | null, documentOrAnswerKey: "document" | "answer_key" }>(
        async ({ blobName, newWindow, documentOrAnswerKey }): Promise<DocumentDownload> => {
            const token = session ? await session.getToken() : 'none';
            const documentDownload = await fetchDocumentDownload(endpoint, blobName, token, documentOrAnswerKey);

            if (newWindow && documentDownload.signedUrl) {
                newWindow.location.href = documentDownload.signedUrl;
            }

            return documentDownload;
        }
    );

    return {
        getDocumentDownload: (blobName: string, newWindow: Window | null, documentOrAnswerKey: "document" | "answer_key") => {
            mutation.mutate({ blobName, newWindow, documentOrAnswerKey });
        },
        isLoading: mutation.isLoading,
        error: mutation.error,
        data: mutation.data,
    };
};

export default useGetDocumentDownload;
