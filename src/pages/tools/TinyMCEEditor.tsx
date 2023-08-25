import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import DownloadDocx from '../../components/docx/DownloadDocx';
import katex from 'katex';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default function App() {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(editorRef.current.getContent());
    }
  };

  const initialValue = `<p>This is the initial content of the editor.</p>
  <p>
    Here's an equation: 
    <span class="katex">
      ( ax^2 + bx + c = 0 )
    </span>
  </p>`;

  const katexInsert = () => {
    const latexString = window.prompt('Enter LaTeX equation:');
    if (editorRef.current && latexString) {
      const katexHtml = katex.renderToString(latexString, {
        throwOnError: true
      })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      editorRef.current.insertContent(katexHtml);
    }
  };

  const insertLatex = (latex: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const wrappedLatex = `${latex}`;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      editor.insertContent(wrappedLatex);
    }
  };

  return (
    <div className='text-white'>
      <DownloadDocx html={initialValue} />
      <div>{`${katex.renderToString(`ax^2 + bx + c`)}`}</div>
      REACTMARKDOWN
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {`$$ax^2 + bx + c$$`}
      </ReactMarkdown>
      <Editor
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={initialValue}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist,autolink,lists,link,image,charmap,print,preview,anchor',
            'searchreplace,visualblocks,code,fullscreen',
            'insertdatetime,media,table,paste,code,help,wordcount',
            'tiny_mce_wiris'
          ],
          toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry',
          external_plugins: {
            'tiny_mce_wiris': '/node_modules/@wiris/mathtype-tinymce6/plugin.min.js' // Replace with your actual path
          },
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <button onClick={() => insertLatex('ax^2 + bx + c = 0')}>Insert Equation</button>

      <button onClick={log}>Log editor content</button>
    </div>
  );
}
