import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select from 'react-select';

interface ApprovalModalProps {
    request: any;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formValues: { 
        action: string; 
        approved_start_date?: string; 
        approved_end_date?: string; 
        response: string 
    }) => void;
    modalType: 'leave' | 'activities'; 
    title: string;
    descriptionField?: string;
    requireDateRange?: boolean;
    actionOptions?: { value: string; label: string }[];
}

const ApprovalModal = ({ 
    request = {},
    isOpen, 
    onClose, 
    onSubmit, 
    modalType = 'leave',
    title = 'Process Request',
    descriptionField = modalType === 'leave' ? 'reason' : 'description',
    requireDateRange = true,
    actionOptions = [
        { value: 'approve', label: 'Approve' },
        { value: 'reject', label: 'Reject' }
    ]
}: ApprovalModalProps) => {
    const [approved_end_date, setApprovalEndDate] = useState<Date | null>(null);
    const [approved_start_date, setApprovedStartDate] = useState<Date | null>(null);
    const [action, setAction] = useState<string | null>(null);
    const [response, setResponse] = useState<string>('');
    const [errors, setErrors] = useState<{ 
        action?: string; 
        approved_start_date?: string; 
        approved_end_date?: string;  
        response?: string 
    }>({});

    useEffect(() => {
        if (!isOpen) return;
        setApprovedStartDate(request?.start_date ? new Date(request.start_date) : null);
        setApprovalEndDate(request?.end_date ? new Date(request.end_date) : null);
        setAction(null);
        setResponse('');
        setErrors({});
    }, [isOpen, request]); 

    const handleActionChange = (selectedOption: any) => {
        const selectedValue = selectedOption?.value || null;
        setAction(selectedValue);
        if (requireDateRange) {
            setApprovedStartDate(request?.start_date ? new Date(request.start_date) : null);
            setApprovalEndDate(request?.end_date ? new Date(request.end_date) : null);
        }

        if (selectedValue === 'reject' && requireDateRange) {
            setApprovedStartDate(null);
            setApprovalEndDate(null);
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const validationErrors: typeof errors = {};
        if (!action) { validationErrors.action = 'Action is required';
        }
        if (action === 'approve' && requireDateRange) {
            if (!approved_start_date) { validationErrors.approved_start_date = 'Start date is required'; }
            if (!approved_end_date) { validationErrors.approved_end_date = 'End date is required'; }
        }
        if (!response.trim()) { validationErrors.response = 'Response is required'; }
        if (Object.keys(validationErrors).length > 0) { 
            setErrors(validationErrors); 
            return;  
        }
        onSubmit({ 
            action: action || '',
            ...(requireDateRange && { 
                approved_start_date: formatDate(approved_start_date) || '', 
                approved_end_date: formatDate(approved_end_date) || '' 
            }),
            response: response.trim() 
        });
    };

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-50">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                    {title}
                                </Dialog.Title>
                                {request && request[descriptionField] && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        {request[descriptionField]}
                                    </div>
                                )}
                                <div className="mt-6 space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                                        <Select 
                                            options={actionOptions} 
                                            value={actionOptions.find(option => option.value === action)}
                                            onChange={handleActionChange} 
                                            placeholder="Select action..." 
                                            className="react-select-container" 
                                            classNamePrefix="react-select" 
                                            isSearchable={false} 
                                        />
                                        {errors.action && <span className="text-red-500 text-sm">{errors.action}</span>}
                                    </div>
                                    {action === 'approve' && requireDateRange && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                <Flatpickr options={{ dateFormat: 'Y-m-d' }}  value={approved_start_date || ''} 
                                                    className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Select start date" 
                                                    onChange={(dates) => { setApprovedStartDate(dates[0]); }}
                                                />
                                                {errors.approved_start_date && (
                                                    <span className="text-red-500 text-sm">{errors.approved_start_date}</span>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                <Flatpickr options={{ dateFormat: 'Y-m-d' }} value={approved_end_date || ''} 
                                                    onChange={(dates) => { setApprovalEndDate(dates[0]); }}
                                                    className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Select end date"
                                                />
                                                {errors.approved_end_date && (
                                                    <span className="text-red-500 text-sm">{errors.approved_end_date}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Response</label>
                                        <textarea 
                                            className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                                            value={response} 
                                            onChange={(e) => setResponse(e.target.value)}
                                            rows={3}
                                        />
                                        {errors.response && (
                                            <span className="text-red-500 text-sm">{errors.response}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-8 flex justify-end space-x-3">
                                    <button 
                                        type="button" 
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button" 
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                                        onClick={handleSubmit}
                                    >
                                        Submit
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

export default ApprovalModal;