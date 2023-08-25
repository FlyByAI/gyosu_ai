import React from 'react';
import { useToPng } from '@hugocxl/react-to-image';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import HTMLtoDOCX from "html-to-docx";
import { saveAs } from "file-saver";

import "./DownloadDocx.css";

interface DownloadDocxProps {
  html: string;
}

function DownloadDocx({ html }: DownloadDocxProps) {
  const [state, convertToPng, ref] = useToPng<HTMLDivElement>({
    onSuccess: async (data) => {
      const clonedHtml = document.createElement('div');
      clonedHtml.innerHTML = html;
      // Create an image element with the base64 data
      const img = document.createElement('img');
      img.src = data;
      clonedHtml.appendChild(img); // Append the image to the HTML

      const fileBuffer = await HTMLtoDOCX(clonedHtml.innerHTML, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      });

      const blob = new Blob([new Uint8Array(fileBuffer)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, "html-to-docx.docx");
    }
  });

  return (
    <div>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      <button onClick={convertToPng}>Export to Docx</button>
    </div>
  );
}

export default DownloadDocx;
