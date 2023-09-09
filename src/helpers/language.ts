export const languageNames: { [key: string]: string } = {
    "en": 'English',
    "es": 'Spanish',
    // "fr": 'French',
    // "de": 'German',
    // "ko": 'Korean',
};

export const flagOptions = Object({
    "en": 'us',
    "es": 'es',
    // "fr": 'fr',
    // "de": 'de',
    // "ko": 'kr',
});

export const getLanguageName = (code: string) => {
    return languageNames[code] || 'Unknown';
};