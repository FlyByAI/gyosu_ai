import { Document } from '../../../interfaces';
import humps from 'humps';
import { useClerk } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';
import fetchInterceptor from '../../../helpers/fetchInterceptor';

export interface SearchFormData {
    sourceMaterial: string;
    documentType: string;
    chapter?: string;
    section?: string;
}

const useSearchMathDocuments = (endpoint: string) => {
    const { session } = useClerk();

    const { language } = useLanguage();

    const options = { site_language: languageNames[language] };

    const searchMathDocuments = useMutation(async (formData: SearchFormData) => {
        const token = session ? await session.getToken() : 'none';

        const response = await fetchInterceptor(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(
                humps.decamelizeKeys({
                    ...formData,
                    section: formData.section?.split('.')[0],
                    chapter: formData.section?.split('.')[1],
                    ...options,
                })
            ),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json().then((json) => humps.camelizeKeys(json));

        return responseData as Document[];
    });
    return {
        searchMathDocuments: searchMathDocuments.mutate,
        isLoading: searchMathDocuments.isLoading,
        error: searchMathDocuments.error,
        documentSearchResults: searchMathDocuments.data,
    };
};

export default useSearchMathDocuments;
