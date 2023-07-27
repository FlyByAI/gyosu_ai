import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface RerollProblemModalProps {
    markdown: string;
    newProblem: string;
    isOpen: boolean;
    setNewProblem: (newProblem: string) => void;
    onClose: () => void;
    updateProblem: (index: number, newProblem: string) => void
    problemIndex: number;
}

const RerollProblemModal: React.FC<RerollProblemModalProps> = ({ markdown, newProblem, isOpen, setNewProblem, onClose, problemIndex, updateProblem }) => {
    const handleAccept = () => {
        updateProblem(problemIndex, newProblem);
        onClose();
    };

    const handleReject = () => {
        setNewProblem("");
        onClose();
    };

    return isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-700"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto md:w-1/2 lg:w-1/3">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5">
                    <div className="mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200" id="modal-title">
                            Current Problem
                        </h3>
                    </div>
                    <div className="mb-4 bg-gray-700 p-2 rounded-l">
                        <label htmlFor="problem" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Problem</label>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            className={" form-textarea mt-1 block w-full"}
                        >
                            {markdown}
                        </ReactMarkdown>
                        {/* <textarea id="problem" defaultValue={markdown} className="mt-1 p-2 block w-full border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" readOnly /> */}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 pt-2">
                    <div className="mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200" id="modal-title">
                            New Problem
                        </h3>
                    </div>
                    {newProblem ? <div className="mb-4 bg-gray-700 p-2 rounded-l">
                        <label htmlFor="problem" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Problem</label>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            className={" form-textarea mt-1 block w-full"}
                        >
                            {newProblem}
                        </ReactMarkdown>
                        {/* <textarea id="problem" defaultValue={newProblem} className="mt-1 p-2 block w-full border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" readOnly /> */}
                    </div> : <div className='text-green-300'>"Loading..."</div>}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse items-center justify-center">
                    <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleAccept}>
                        Accept
                    </button>
                    <button onClick={handleReject} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RerollProblemModal;
