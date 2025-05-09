import { useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { useLocation, useNavigate } from 'react-router-dom';
import '../dashboard/dashboard.css';
import AnimateHeight from 'react-animate-height';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import Toast from '../../services/toast';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

const endpoints = {
    createApi    : `${getBaseUrl()}/subscriber/send-campaign`,
};

const PreviewTemplate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast    = Toast();
    const { htmlCode, cssCode } = location.state || { htmlCode: '', cssCode: '' };
    const [active, setActive] = useState<string>('1');
    const combinedRef     = useRef<any>({ emailform : null });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isSendNow, setIsSendNow] = useState(false);
    const [date, setDate] = useState<any>('');

    const togglePara = (value: string) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const generatePreview = () => {
        return htmlCode
    };

    const sendEmailCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (combinedRef.current.emailform) {
            const formData = new FormData(combinedRef.current.emailform);
            formData.append('htmlContent',generatePreview());
            formData.append('schedule_at', date);
            if (formData.has('send_to_all')) {
                
            } else {
                toast.error('Please select at least one subscriber to send the email.');
                setErrors({ send_to_all: ['Please select at least one subscriber to send the email.'] });
                setActive('1');
                return
            }
            
            try {
                const response = await apiClient.post(endpoints.createApi, formData);
                alert("Emails are being sent in the background!");
            } catch (error:any) {
                if (error.response && error.response.status === 422) {
                    setActive('2');
                    setErrors(error.response.data);
                }
            }
        }
    };

    const handleFormKeyUp = (e: React.KeyboardEvent) => {  
        const target = e.target as HTMLInputElement;   // it will tale input attribute
        const inputName = target.name;
        if (errors[inputName]) {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [inputName]: ''
            }));
        }
    };

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {  
        const target = e.target;
        const inputName = target.name;
        if (errors[inputName]) {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [inputName]: ''
            }));
        }
    };

    const handleSendNowToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setDate('');
        }

        setErrors((prevErrors:any) => ({
            ...prevErrors,
            sendNow: '',
            date: isChecked ? '' : prevErrors.date
        }));
        setIsSendNow(isChecked);
        if (!isChecked && !date) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                date: ['Please select a date for scheduled sending']
            }));
            setActive('3'); 
        }
    };

    const selectDate = (e: any) => {
        const selectedDate = e[0]; 
        setDate(selectedDate);
        setErrors((prevErrors:any) => ({
            ...prevErrors,
            date: ''
        }));

        if (isSendNow) {
            setIsSendNow(false);
        }
    }
    
    return (
        <div>
            <div className="min-h-screen p-2 sm:p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[calc(100vh-200px)]">
                    <div className="md:col-span-8 panel p-3 sm:p-4 border rounded bg-white shadow h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] overflow-auto">
                        <h2 className="text-lg font-bold mb-3">HTML Code</h2>
                        <div className="mb-5">
                            <form className="emailform" ref={(el) => (combinedRef.current.emailform = el)} onSubmit={sendEmailCampaign} onKeyUp={handleFormKeyUp}>
                                <div className="space-y-2 font-semibold">
                                  <div className={`border rounded ${errors.send_to_all  ? 'border-red-400' : 'border-[#d3d3d3] dark:border-[#1b2e4b]'}`}>
                                    <button type="button" className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${active === '1' ? '!text-primary' : ''}`}
                                            onClick={() => togglePara('1')}>
                                            To, Who are you sending this email to?
                                            <div className={`ltr:ml-auto rtl:mr-auto ${active === '1' ? 'rotate-180' : ''}`}>
                                                <IconCaretDown />
                                            </div>
                                        </button>
                                        <div>
                                            <AnimateHeight duration={300} height={active === '1' ? 'auto' : 0}>
                                                <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                    <div className="mb-3">
                                                        <label className="inline-flex">
                                                            <input type="checkbox" name="send_to_all" className="form-checkbox text-secondary rounded-full peer" />
                                                            <span className="peer-checked:text-secondary">Send Email to All Subscribers</span>
                                                        </label>                                                        
                                                    </div>
                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                    <div className={`border rounded ${errors.name || errors.subject || errors.email ? 'border-red-400' : 'border-[#d3d3d3] dark:border-[#1b2e4b]'}`}>
                                        <button type="button" className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${active === '2' ? '!text-primary' : ''}`} onClick={() => togglePara('2')} > From: Who is sending this email?
                                            <div className={`ltr:ml-auto rtl:mr-auto ${active === '2' ? 'rotate-180' : ''}`}> <IconCaretDown /> </div>
                                        </button>
                                        <div>
                                            <AnimateHeight duration={300} height={active === '2' ? 'auto' : 0}>
                                                <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                    <div className="mb-3">
                                                        <label htmlFor="name">Campaign Name </label>
                                                        <input id="name" type="text" name="name" placeholder="Evernest Real Estate" className="form-input" autoComplete="off" />
                                                        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="subject">Subject </label>
                                                        <input id="subject" type="text" name="subject" placeholder="Subject" className="form-input" autoComplete="off" />
                                                        {errors.subject && <span className="text-red-500 text-sm">{errors.subject}</span>}
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="from_email">Email </label>
                                                        <select id="from_email" name="from_email" className="form-select" defaultValue="" onChange={handleSelect}>
                                                            <option value="" disabled>Select Email</option>
                                                            <option value="evernestre@gmail.com">evernestre@gmail.com</option>
                                                            <option value="info@evernestre.ae">info@evernestre.ae</option>
                                                        </select>
                                                        {errors.from_email && <span className="text-red-500 text-sm">{errors.from_email}</span>}
                                                    </div>
                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                    <div className={`border rounded ${errors.sendNow || errors.date ? 'border-red-400' : 'border-[#d3d3d3] dark:border-[#1b2e4b]'}`}>
                                        <button type="button" className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${active === '3' ? '!text-primary' : ''}`}
                                            onClick={() => togglePara('3')}> Send Options
                                            <div className={`ltr:ml-auto rtl:mr-auto ${active === '3' ? 'rotate-180' : ''}`}>
                                                <IconCaretDown />
                                            </div>
                                        </button>
                                        <div>
                                            <AnimateHeight duration={300} height={active === '3' ? 'auto' : 0}>
                                                <div className="p-4 text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                    <div className="space-y-4 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <label htmlFor="sendNow" className="mr-2" style={{ cursor: 'pointer' }}><h1>Send Now</h1></label>
                                                            <input id="sendNow" type="checkbox" name="sendNow" className="form-checkbox" onChange={handleSendNowToggle} />
                                                        </div>
                                                        {errors.sendNow && <span className="text-red-500 text-sm">{errors.sendNow}</span>}
                                                        <hr />
                                                        <div className="mt-4">
                                                            <label htmlFor="slugmark" className="text-white-dark"> Date</label>
                                                            <Flatpickr value={date}  name="date"  options={{ dateFormat: 'Y-m-d H:i', enableTime: true,}} className="form-input" 
                                                            onChange={selectDate}  
                                                            disabled={isSendNow}  placeholder='Y-m-d H:i' />
                                                            {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <button type="submit"  className="mt-3 btn btn-secondary text-white rounded"> Send </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="md:col-span-4 panel p-3 sm:p-4 border rounded bg-white shadow h-[50vh] md:h-[calc(100vh-140px)]">
                        <h2 className="text-lg font-bold mb-3">Live Preview</h2>
                        <div className="h-[calc(100%-2rem)]">
                            <iframe title="preview" className="w-full h-full border rounded" srcDoc={generatePreview()} scrolling="no" seamless style={{ width: '100%', height: '100%', border: 'none' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewTemplate;
