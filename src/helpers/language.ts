export const languageNames = Object({
    "us": 'English',
    "es": 'Spanish',
    "fr": 'French',
    "de": 'German',
    "kr": 'Korean',
});

export const getLanguageName = (code: string) => {
    return languageNames[code] || 'Unknown';
};