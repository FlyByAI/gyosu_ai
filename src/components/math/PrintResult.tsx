import React from 'react';
import PrintIcon from '../../svg/PrintIcon';

interface PrintResultProps {
    documentName?: string;
    workSheetTitle?: string; // I want to set these automatically using the form data to make it easy to download and understand the content in the documents
    divPrintId: string;
}

const PrintResult: React.FC<PrintResultProps> = ({ documentName, workSheetTitle, divPrintId }) => {

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

        if (content && myWindow?.document) {
            myWindow.document.write(`<html><head><title>${documentName || "Print"}</title>`);
            myWindow.document.write(`</head><body ><h2>${workSheetTitle || "Print"}</h2>`);
            myWindow.document.write('<div>');
            myWindow.document.write(content.innerHTML);
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
            className={`text-white rounded p-2 w-auto flex font-bold bg-blue-700 hover:bg-blue-500`}
            onClick={() => printDiv(divPrintId)}
        >
            <p className='me-2 hidden md:block'>Print</p>
            <PrintIcon />
        </button>
    )
}

export default PrintResult;
