import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface RemarkModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Array<{ name: string; values: string[] }>;
}
const RemarkModal: React.FC<RemarkModalProps> = ({ isOpen, onClose, data }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" open={isOpen} onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto" />
                </Transition.Child>
                <div className="fixed inset-0 z-[1000] flex items-start justify-center min-h-screen px-4">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-5xl text-black dark:text-white-dark">
                            <div className="p-5">
                                <table className="table-responsive w-full">
                                    <tbody>
                                        {data && data.length > 0 ? (
                                            data.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-300">
                                                    <td className="border-gray-400 px-4 py-2 font-semibold">{item.name?.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}</td>
                                                    <td className="border-gray-400 px-4 py-2">{item.values?.join(', ')}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="px-4 py-2 text-center" colSpan={2}>
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className="flex justify-end items-center mt-2">
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={onClose}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};
export default RemarkModal;
