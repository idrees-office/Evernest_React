import { useState, useEffect, useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from './Icon/IconX';
import { Dispatch } from 'redux';
import { createLeads } from '../slices/dashboardSlice';
import Toast from '../services/toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IRootState } from '../store';
import { getBaseUrl } from './BaseUrl';
import apiClient from '../utils/apiClient';


const endpoints = {
    createApi    : `${getBaseUrl()}/subscriber/store`,
    // createApi  : `${getBaseUrl()}/users/create_role`,
    // destoryApi : `${getBaseUrl()}/users/delete_role`,
    // updateApi  : `${getBaseUrl()}/users/update_role`,
};


interface LeadModalProps {  isOpen: boolean; onClose: () => void; }
const SubscriberModal: React.FC<LeadModalProps> = ({ isOpen, onClose }) => {
const dispatch = useDispatch<AppDispatch>();
const [errors, setErrors] = useState<Record<string, string[]>>({});
const combinedRef     = useRef<any>({ subscriberform : null });
const toast           = Toast();
const [permissions, setPermissions] = useState<any>([]);
const [role, setRoles] = useState<string>();

useEffect(() => {

    if (isOpen) { setErrors({}); }
    const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    const userrole = localStorage.getItem('role') || '';
    setPermissions(storedPermissions);
    setRoles(userrole);
}, [isOpen]);

const saveSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (combinedRef.current.subscriberform) {
        const formData = new FormData(combinedRef.current.subscriberform);
        try {
            const response = await apiClient.post(endpoints.createApi, formData);
            if (response.status === 200 || response.status === 201){
                toast.success('Lead Create Successfully');
                onClose();
                setErrors({}); 
                combinedRef.current.subscriberform.reset();
            }else{
                //   setErrors(response);
                return
            }
        } catch (error: any) { 
            if(error.response.status === 422){
                setErrors(error.response.data || {});
            }
        }
    }
}
return (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-[51]">
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="fixed inset-0 bg-[black]/60" />
            </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-4 py-8">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                <IconX />
                </button>
                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]"> Add Subscrber Infomation...</div>
                <div className="p-5">
                <form className="leadForm" ref={(el) => (combinedRef.current.subscriberform = el)} onSubmit={saveSubscriber}>
                    <div className="mb-3">
                        <label htmlFor="name">Name </label>
                        <input id="name" type="text" placeholder="Full Name" name="name" className="form-input" />
                        {errors?.name && <p className="text-danger error">{errors.name[0]}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Email </label>
                        <input id="email" type="text" name="email" placeholder="john@gmail.com" className="form-input" />
                        {errors?.email && <p className="text-danger error">{errors.email[0]}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone">Phone</label>
                        <input id="text" type="text" name="phone" placeholder="Phone" className="form-input" />
                        {errors?.phone && <p className="text-danger error">{errors.phone[0]}</p>}
                    </div>
                    <div className="ltr:text-right rtl:text-left flex justify-end items-center mt-8">
                      <button type="button" className="btn btn-outline-danger" onClick={onClose} > Cancel </button>
                      <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">Save</button>
                    </div>
                </form>
                </div>
            </Dialog.Panel>
            </Transition.Child>
        </div>
        </div>
    </Dialog>
</Transition>
);
};
export default SubscriberModal;
