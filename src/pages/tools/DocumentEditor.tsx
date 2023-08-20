import { Editor } from '@tinymce/tinymce-react';
import React from 'react';
import { Chunk, Instruction, Problem, Table, Text, Math, Document } from '../../interfaces';
import { useParams } from 'react-router-dom';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import { notSecretConstants } from '../../constants/notSecretConstants';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import DocumentShelf from '../../components/document/DocumentShelf';



const DocumentEditor: React.FC = () => {
    const { id } = useParams();
    const { isLoading, error, document } = useGetDocument(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document`, Number(id));


    const renderContent = (content: (Chunk | Instruction | Problem)[]): string => {
        return content.map((item) => {
            switch (item.type) {
                case 'chunk':
                    return renderChunk(item.content);
                case 'instruction':
                    return renderInstruction(item.content);
                case 'problem':
                    return renderProblem(item.content);
                default:
                    return null;
            }
        })
            .filter(item => item !== null) // Optional: remove null values
            .join(''); // Join the array into a single string
    };

    const renderChunk = (content: (Instruction | Problem)[]) => {
        return renderContent(content); // Reusing renderContent to handle chunks
    };

    const renderInstruction = (content: (Text | Math)[]) => {
        return content.map(item => {
            switch (item.type) {
                case 'text':
                    return item.value;
                case 'math':
                    return String.raw`$$${item.value}$$`; // Using Math delimiters that you configured with rehypeKatex
                default:
                    return '';
            }
        }).join('');
    };

    const renderProblem = (content: (Text | Math)[]) => {
        return content.map(item => {
            switch (item.type) {
                case 'text':
                    return item.value;
                case 'math':
                    return String.raw`$$${item.value}$$`; // Using Math delimiters that you configured with rehypeKatex
                default:
                    return '';
            }
        }).join('');
    };

    const content = document?.problemChunks ? renderContent(document.problemChunks) : "";


    return (

        <div className='flex bg-gray-900'>
            <DocumentShelf isExporting={true} />
            <div className="w-5/6">
                {document && document.problemChunks && <Editor
                    initialValue={content}
                    init={{
                        /* Your tinyMCE configuration here */
                    }}
                    onChange={() => console.log("onchange tinymce")}
                />}

            </div>
        </div>

    );
};

export default DocumentEditor;
