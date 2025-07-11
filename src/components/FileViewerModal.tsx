import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { deleteFiles, setLoading } from '../slices/dashboardSlice';
import Toast from '../services/toast';
import { Divider } from '@mantine/core';

interface FileViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    files: Array<{
        file_id: number;
        name: string;
        size: number;
        mime_type: string;
        url: string;
    }>;
}

const FileViewerModal = ({ isOpen, onClose, files }: FileViewerModalProps) => {
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const dispatch        = useDispatch<AppDispatch>();
    const toast           = Toast();

    useEffect(() => {
        if (files.length > 0) {
            setCurrentFileIndex(0); 
        }
    }, [files]);

    const isImage = (mimeType: string) => {
        return mimeType.startsWith('image/');
    };

    const isPDF = (mimeType: string) => {
        return mimeType === 'application/pdf';
    };

    const isWordDoc = (mimeType: string) => {
        return [
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
        ].includes(mimeType);
    };

    const nextFile = () => {
        setCurrentFileIndex((prev) => (prev < files.length - 1 ? prev + 1 : prev));
    };

    const prevFile = () => {
        setCurrentFileIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const deleteFilesHandler = async (mediaId: any) => {
        
            try {
                dispatch(setLoading(true));
                const resultAction = await dispatch(deleteFiles(mediaId));
                if(resultAction){
                     toast.success(``+resultAction.payload.message+``);
                     onClose();
                }
            } catch (error) {
                toast.error('Failed to load files');
                console.error("Error viewing files:", error);
            } finally {
                dispatch(setLoading(false));
            }
        };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" open={isOpen} onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto" />
                </Transition.Child>
                <div className="fixed inset-0 z-[1000] flex items-start justify-center min-h-screen px-4">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-5xl text-black dark:text-white-dark">
                            <div className="p-5">
                                {files.length > 0 && files[currentFileIndex] ? (
                                    <div className="file-viewer-container">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">
                                                {files[currentFileIndex].name} ({currentFileIndex + 1}/{files.length})
                                            </h3>
                                            <div className="text-sm text-gray-500">
                                                { files[currentFileIndex].size } • {files[currentFileIndex].mime_type}
                                            </div>
                                        </div>

                                        <div className="file-preview-container bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 flex justify-center items-center min-h-[400px] relative">
                                            {isImage(files[currentFileIndex].mime_type) ? (
                                                <img src={files[currentFileIndex]?.url} alt={files[currentFileIndex].name} className="max-h-[400px] max-w-full object-contain"
                                                />
                                            ) : isPDF(files[currentFileIndex]?.mime_type) ? (
                                                <iframe src={files[currentFileIndex]?.url} className="w-full h-[400px]" style={{ border: 'none' }} ></iframe>
                                            ) : isWordDoc(files[currentFileIndex].mime_type) ? (
                                                <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(files[currentFileIndex]?.url)}`}
                                                    className="w-full h-[400px]"
                                                    style={{ border: 'none' }}
                                                ></iframe>
                                            ) : (
                                                <div>
                                                    <div className="text-center p-8">
                                                        <div className="text-4xl mb-4">📄</div>
                                                        <p>Preview not available for this file type</p>
                                                    </div>
                                                </div>
                                            )}
                                            {files.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={prevFile}
                                                        disabled={currentFileIndex === 0}
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md disabled:opacity-50"
                                                    >
                                                        &larr;
                                                    </button>
                                                    <button
                                                        onClick={nextFile}
                                                        disabled={currentFileIndex === files.length - 1}
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md disabled:opacity-50"
                                                    >
                                                        &rarr;
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <div className="file-thumbnails flex gap-2 overflow-x-auto py-2">
                                            {files.map((file, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => setCurrentFileIndex(index)}
                                                    className={`thumbnail cursor-pointer border-2 rounded ${currentFileIndex === index ? 'border-primary' : 'border-transparent'}`}
                                                >
                                                    {isImage(file.mime_type) ? (
                                                        <img src={file.url} alt={file.name} className="h-16 w-auto object-cover" />
                                                    ) : isWordDoc(file.mime_type) ? (
                                                        <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                            <span className="text-xs text-center p-1 break-all">
                                                                {file.name.endsWith('.docx') ? 'DOCX' : 'DOC'}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                            <span className="text-xs text-center p-1 break-all">
                                                                {file.name.split('.').pop()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No files available</p>
                                    </div>
                                )}
                                <div className="flex justify-end items-center mt-4 gap-2">
                                    {files.length > 0 && files[currentFileIndex] && (
                                        <div className='flex gap-2'>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteFilesHandler(files[currentFileIndex].file_id)}> Delete Current </button>
                                            <a href={files[currentFileIndex].url} download={files[currentFileIndex].name} className="btn btn-primary btn-sm" > Download Current</a>
                                        </div>
                                    )}
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={onClose}> Close </button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default FileViewerModal;