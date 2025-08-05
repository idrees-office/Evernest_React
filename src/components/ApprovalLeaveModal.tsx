import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select from 'react-select';

interface ApprovalLeaveModalProps {
    leave: { id: any; start_date?: any; end_date: any; days?: number; reason:any };
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formValues: { action: any; approved_start_date: any; approved_end_date: any; response:any }) => void;
}

const ApprovalLeaveModal = ({ leave, isOpen, onClose, onSubmit }: ApprovalLeaveModalProps) => {
    const [calculatedDays, setCalculatedDays] = useState(0);
    const formRef = useRef<HTMLFormElement | null>(null);
    const [approved_end_date, setApprovalEndDate] = useState<any | null>(null);
    const [approved_start_date, setApprovedStartDate] = useState<any | null>(null);
    const [action, setAction] = useState<any | null>(null);
    const [response, setResponse] = useState<string>('');
    const [errors, setErrors] = useState<{ action?: string; approved_start_date?: string; approved_end_date?: string;  response?:any }>({});
    useEffect(() => {
    if (!isOpen) return;
        setApprovedStartDate(leave.start_date ? new Date(leave.start_date) : null);
        setApprovalEndDate(leave.end_date ? new Date(leave.end_date) : null);
        setAction(null);
    }, [isOpen, leave]); 

    const handleActionChange = (selectedOption: any) => {
        const selectedValue = selectedOption?.value || null;
        setAction(selectedValue);
        setApprovedStartDate(leave.start_date ? new Date(leave.start_date) : null);
        setApprovalEndDate(leave.end_date ? new Date(leave.end_date) : null);
        if (selectedValue === 'reject') {
            setApprovedStartDate(null);
            setApprovalEndDate(null);
        }
    };
     const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const validationErrors: { action?: string; approved_start_date?: string; approved_end_date?: string; response?:any } = {};
        if (action === 'approve') {
        if (!approved_start_date) {
            validationErrors.approved_start_date = 'Approved start date is required';
        }
        if (!approved_end_date) {
            validationErrors.approved_end_date = 'Approved end date is required';
        }
    }
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return;  }
    setErrors({});
    onSubmit({ action, approved_start_date: formatDate(approved_start_date), approved_end_date: formatDate(approved_end_date), response: response.trim(), });
    };
    const actionOptions = [ { value: 'approve', label: 'Approve' }, { value: 'reject', label: 'Reject' } ];

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
                     <form encType="multipart/form-data" ref={formRef} onSubmit={handleSubmit}>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">Process Leave Request</Dialog.Title>
                                    <small> { leave?.reason} </small>
                                    <div className="mt-6 space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                                            <Select options={actionOptions} name='action' value={actionOptions.find(option => option.value == action)}
                                            onChange={handleActionChange} placeholder="Select action..." className="react-select-container" classNamePrefix="react-select" isSearchable={false} />
                                            {errors.action && <span className="text-red-500 text-sm">{errors.action}</span>}
                                        </div>
                                        {action === 'approve' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Approved Start Date</label>
                                                <Flatpickr options={{ dateFormat: 'Y-m-d' }} value={approved_start_date} name='approved_start_date'
                                                    className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Select start date" onChange={(approved_start_date) => { setApprovedStartDate(approved_start_date[0]); }}
                                                />
                                                {errors.approved_start_date && ( <span className="text-red-500 text-sm"> {errors.approved_start_date} </span> )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Approved End Date</label>
                                                <Flatpickr options={{ dateFormat: 'Y-m-d' }}  value={approved_end_date} name='approved_end_date' onChange={(approved_end_date) => { setApprovalEndDate(approved_end_date[0]); }}
                                                    className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Select end date"
                                                />
                                                {errors.approved_end_date && ( <span className="text-red-500 text-sm">{errors.approved_end_date}</span> )}
                                            </div>
                                        </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Give Your Response</label>
                                           <textarea name="response" id="response" className="form-input" value={response} onChange={(e) => setResponse(e.target.value)}
                                            ></textarea>
                                             {errors.response && ( <span className="text-red-500 text-sm">{errors.response}</span> )}

                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end space-x-3">
                                        <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={onClose}>   Cancel
                                        </button>
                                        <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={handleSubmit}> Submit
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                    </form>
                </Dialog>
            </Transition>
    );
};

export default ApprovalLeaveModal;