import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import Plot from 'react-plotly.js';
import html2canvas from 'html2canvas';
import useGcpUploader from '../../hooks/tools/useGcpUploader';


interface AddGraphModalProps {
    markdown: string;
    isOpen: boolean;
    onClose: (url: string) => void;
    updateProblem: (index: number, newProblem: string) => void;
    problemIndex: number;
    graphData: any; // define appropriate type
    graphLayout: any; // define appropriate type
}

const AddGraphModal: React.FC<AddGraphModalProps> = ({ markdown, isOpen, onClose, problemIndex, graphData, graphLayout }) => {

    const plotRef = useRef(null);

    const { uploading, url, error, uploadToGcp } = useGcpUploader('Your-GCP-Bucket-Name');  // Replace 'Your-GCP-Bucket-Name' with your bucket's name


    const capture = async () => {
        if (plotRef.current !== null) {
            const canvas = await html2canvas(plotRef.current)
            const imgData = canvas.toDataURL("image/png");

            uploadToGcp(imgData, `plot_${problemIndex}.png`);
        }
    };

    const handleUpload = async () => {
        const graphUrl = "https://gyosu.ai"; // will reach out to GCP bucket once link is
        await capture();

        console.log("Upload success!", url)
    };
    const handleAccept = async () => {
        console.log("url")
        console.log(url)
        if (url) {
            onClose(url ? url : "");
        }
    };

    const handleReject = () => {
        onClose("");
    };

    return isOpen ? (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-700"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-3/4 sm:mx-auto md:w-1/2 lg:w-1/3">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200" id="modal-title">
                            Current Problem
                        </h3>
                    </div>
                    <div className="mb-4 bg-gray-700 p-2 rounded-l">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            className={" form-textarea mt-1 block w-full"}
                        >
                            {markdown}
                        </ReactMarkdown>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200" id="modal-title">
                            Graph
                        </h3>
                        <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                            {!uploading ? <div ref={plotRef}><Plot

                                data={graphData ? graphData : [{ 'x': [0, 1, 2, 3], 'y': [0, 2, 3, 5], 'mode': 'markers+lines', 'name': 'Line 1' }, { 'x': [0, 1, 2, 3], 'y': [0, -2, -3, -5], 'mode': 'markers+lines', 'name': 'Line 2' }]}
                                layout={graphLayout}
                                useResizeHandler
                                style={{ width: "100%", height: "100%" }}
                            /></div> : "Uploading..."}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse items-center justify-center">
                    <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={url ? handleAccept : handleUpload}>
                        {url ? "Accept" : "Upload"}
                    </button>
                    <button
                        type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleReject}>
                        Reject
                    </button>
                </div>
            </div>
        </div>
    ) : <></>;
};

export default AddGraphModal;
