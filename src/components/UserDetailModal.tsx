import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react';
import { options, employeeType, documentTypes } from '../services/status';
import apiClient from '../utils/apiClient';
import { getBaseUrl } from './BaseUrl';

const endpoints = {
    pullFileApi: `${getBaseUrl()}/users/pull_file`,
};

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    user:  any | null;
}

const UserDetailModal = ({ isOpen, onClose, user }: UserDetailModalProps) => {
    const [files, setFiles] = useState<any[]>([]);
    useEffect(() => {
        if (isOpen) {
            fetchFiles();
        }
    }, [isOpen]);

    const fetchFiles = async () => {
    try {
        const response = await apiClient.post(endpoints.pullFileApi, { user_id: user?.client_user_id });
        if (response.data) {
            if ((response.data)) {
                setFiles(response.data.media || []);
            } else {
                setFiles([]);
            }
        }
    } catch (error: any) {
        if (error.response?.status === 403) {
            window.location.href = '/error';
        }
        setFiles([]); 
    }
}

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    User Details
                                </Dialog.Title>
                                
                                <Tab.Group>
                                    <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mt-4">
                                        <Tab
                                            className={({ selected }) =>
                                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                                                ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                                                ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
                                            }
                                        >
                                            Personal Information
                                        </Tab>
                                        <Tab className={({ selected }) =>
                                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                                                ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                                                ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
                                            }
                                        >
                                            Documents
                                        </Tab>
                                    </Tab.List>
                                    <Tab.Panels className="mt-2">
                                        <Tab.Panel className="rounded-xl bg-white p-3">
                                            {user && (
                                                <div className="overflow-hidden">
                                                    <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                                                        <div className="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                                                            {user.client_user_name.charAt(0)}
                                                        </div>
                                                        <div className="ml-4">
                                                            <h3 className="text-xl font-bold text-gray-800">{user.client_user_name}</h3>
                                                            <p className="text-gray-600">{user.client_user_designation}</p>
                                                        </div>
                                                    </div>

                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Email</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.client_user_email}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Phone</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.client_user_phone}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Status</td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className="badge bg-success">
                                                                         {options.find(opt => opt.value === user.client_user_status)?.label || 'Inactive'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Role</td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                     <span className="badge bg-secondary">
                                                                        {user.roles?.[0]?.name}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Date of Birth</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    <span className="badge bg-dark">
                                                                              {user.client_user_dob || 'Unknown'}
                                                                    </span>
                                                                  </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Joining Date</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                     <span className="badge bg-dark">
                                                                     {user.client_user_joing_date || 'Unknown'}
                                                                     </span>
                                                                   </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Employee Type</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                                                                    <span className="badge bg-info">
                                                                         {employeeType.find(opt => opt.value === user.client_user_type)?.label || 'Unknown'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Allowed Leave Days</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                <span className="badge bg-secondary">{user.client_user_allow_leave || 0}</span>
                                                                    </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </Tab.Panel>
                                        <Tab.Panel className="rounded-xl bg-white p-3">
                                            {files && files.length > 0 ? (
                                                <div className="space-y-4">
                                                    {files.map((file:any, index:any) => (
                                                        <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <p className="font-semibold">
                                                                        {documentTypes.find(doc => doc.value == file.collection_name)?.label || 'Document'}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">{file.file_name}</p>
                                                                </div>
                                                                <a 
                                                                    href={file.original_url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                >
                                                                    View
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    No documents found for this user
                                                </div>
                                            )}
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default UserDetailModal;