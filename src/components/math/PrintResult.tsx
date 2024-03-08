import React from 'react';
import PrintIcon from '../../svg/PrintIcon';

interface PrintResultProps {
    documentName?: string;
    workSheetTitle?: string; // I want to set these automatically using the form data to make it easy to download and understand the content in the documents
    divPrintId: string;
}

const PrintResult: React.FC<PrintResultProps> = ({ workSheetTitle, divPrintId }) => {

    const printDiv = (divId: string) => {
        const div = document.getElementById(divId);
        const content = div?.cloneNode(true) as HTMLElement;

        const unwantedElementsArr = ["mord", "mbin", "mrel", "mopen", "mclose", "mspace", "mpunct"];

        unwantedElementsArr.forEach(unwantedClass => {
            const unwantedElements = content?.getElementsByClassName(unwantedClass);

            if (unwantedElements) {
                Array.from(unwantedElements).forEach(el => el.parentNode?.removeChild(el));
            }
        });

        const myWindow = window.open('', '', 'width=600,height=600');

        const myCSS = `
/* General Page Styling */
body {
    font-family: 'Arial', sans-serif; /* Let's switch back to the more conventional Arial */
    font-size: 14pt; /* A little larger for clarity */
    line-height: 1.6;
    color: #333;
    background-color: #fff; /* Pure white background for print-friendliness */
    margin: 1.5cm;
}

.page-break {
    display: block;
    page-break-before: always;
}

p > strong {
    border-bottom: 1px dashed #666; /* Solid separator before each problem */
    display: block;
    font-size: 16pt; /* Larger font size for problem numbers */
}

.math {
    background-color: #fff; /* No background to keep it clean */
    border: 1px solid #ddd; /* Light border to differentiate */
    padding: 3px 6px;
    border-radius: 3px;
    display: inline-block;
    margin: 0 2px;
}

img {
    max-width: 100%;
    margin: 20px 0;
    box-shadow: none; /* Removing shadows for a more traditional look */
}

div > p {
    margin-top: 20px;
    margin-bottom: 20px;
    padding-left: 20px; /* A slight padding for better visibility */
    position: relative;
}

p > span {
    background-color: #fff;
    padding: 2px 5px;
    border-radius: 2px;
    margin: 0 2px;
}

/* Dotted lines for potential answers or workings out */
div > p::after {
    content: '';
    display: block;
    margin-top: 10px;
}


/* Initialize the counter */
body::before {
    content: '';
    counter-reset: problemNumber;
}



`;


        if (content && myWindow?.document) {
            myWindow.document.write(`<style>${myCSS}</style>`);
            myWindow.document.write('<html><head><title>&nbsp;</title>');
            myWindow.document.write(`</head><body><h2>${workSheetTitle || " "}</h2>`);
            myWindow.document.write('<div>');
            myWindow.document.write(content.innerHTML.replace(/<\/p><br><\/div>/g, "</p></div>"));
            // myWindow.document.write(content.innerHTML);
            myWindow.document.write('</div>');
            myWindow.document.write('</body></html>');
            myWindow.document.close(); // necessary for IE >= 10
        }

        if (myWindow) {
            myWindow.onload = function () {
                myWindow.focus(); // necessary for IE >= 10
                myWindow.print();
                myWindow.close();
            };
        }
    }

    return (
        <button
            className={`text-gray-300 rounded p-2 w-auto flex font-bold bg-blue-700 hover:bg-blue-500`}
            onClick={() => printDiv(divPrintId)}
        >
            <p className='me-2 hidden md:block'>Print</p>
            <PrintIcon />
        </button>
    )
}

export default PrintResult;
