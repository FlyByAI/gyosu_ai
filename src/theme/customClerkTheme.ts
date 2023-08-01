
export const getGyosuClerkTheme = () => {
    return (
        {
            variables: {
                colorPrimary: '#22c55e',
                colorTextSecondary: 'white',
                fontWeight: {
                    normal: 500,
                    medium: 600,
                    bold: 700,
                },
                colorBackground: '#111827',
                colorAlphaShade: 'white', // icons
                colorText: 'white',
                colorInputText: 'white',
                colorInputBackground: '#333', // Added this line for the input background
                colorShimmer: 'rgba(255,255,255,0.36)',
                shadowShimmer: '1px 1px 2px rgba(0,0,0,0.36)',
            },
            elements: {
                card: {
                    boxShadow: '7px 7px 0px #000',
                    border: '3px solid #fff',
                },
            }
        })
}