// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import HTMLtoDOCX from "html-to-docx";
import { saveAs } from "file-saver";

import "./DownloadDocx.css";

interface DownloadDocxProps {
  html: string;
}

function DownloadDocx({ html }: DownloadDocxProps) {

  async function downloadDocx(params: any) {

    params && console.log(params)

    const fileBuffer = await HTMLtoDOCX(html, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    // console.log("fileBuffer:", fileBuffer); 

    const blob = new Blob([new Uint8Array(fileBuffer)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

    saveAs(blob, "html-to-docx.docx");
  }

  return (
    <button
      className={`text-white rounded p-2 w-auto flex font-bold bg-blue-700 hover:bg-blue-500 me-4`}
      onClick={downloadDocx}>
      Export to Docx
    </button>
  );
}

export default DownloadDocx;
