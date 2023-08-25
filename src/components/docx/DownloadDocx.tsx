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
    <div className="flex flex-col items-center">
      <button className="text-white bg-blue-300 w-32" onClick={downloadDocx}>
        Export to Docx
      </button>
    </div>
  );
}

export default DownloadDocx;
