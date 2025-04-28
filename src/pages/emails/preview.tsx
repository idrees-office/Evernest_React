import { useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { useLocation, useNavigate } from 'react-router-dom';
import '../dashboard/dashboard.css';
import AnimateHeight from 'react-animate-height';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';

const endpoints = {
    createApi    : `${getBaseUrl()}/subscriber/send-campaign`,
   
};


const PreviewTemplate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { htmlCode, cssCode } = location.state || { htmlCode: '', cssCode: '' };
    const [active, setActive] = useState<string>('1');
    const combinedRef     = useRef<any>({ emailform : null });
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
            formData.append('sendto[]', 'idreesoffice9012@gmail.com');
            formData.append('sendto[]', 'farhanalidxb1@gmail.com');
            try {
                const response = await apiClient.post(endpoints.createApi, formData);

                alert("Emails are being sent in the background!");
            } catch (error) {
                console.error(error);
                alert("Error sending email campaign.");
            }

        }

    };

    return (
        <div>
            <div className="min-h-screen p-2 sm:p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[calc(100vh-200px)]">
                    <div className="md:col-span-8 panel p-3 sm:p-4 border rounded bg-white shadow h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] overflow-auto">
                        <h2 className="text-lg font-bold mb-3">HTML Code</h2>
                        <div className="mb-5">
                            <form className="emailform" ref={(el) => (combinedRef.current.emailform = el)} onSubmit={sendEmailCampaign}>
                                <div className="space-y-2 font-semibold">
                                    <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                                        <button type="button" className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${active === '1' ? '!text-primary' : ''}`}
                                            onClick={() => togglePara('1')}
                                        >
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
                                                            <input type="checkbox" className="form-checkbox text-secondary rounded-full peer" />
                                                            <span className="peer-checked:text-secondary">Send Email to All Subscribers</span>
                                                        </label>                                                        
                                                    </div>
                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                    <div className="border border-[#d3d3d3] dark:border-[#1b2e4b] rounded">
                                        <button type="button" className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${active === '2' ? '!text-primary' : ''}`} onClick={() => togglePara('2')} >
                                            From: Who is sending this email?
                                            <div className={`ltr:ml-auto rtl:mr-auto ${active === '2' ? 'rotate-180' : ''}`}>
                                                <IconCaretDown />
                                            </div>
                                        </button>
                                        <div>
                                            <AnimateHeight duration={300} height={active === '2' ? 'auto' : 0}>
                                                <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                    <div className="mb-3">
                                                        <label htmlFor="name">Name </label>
                                                        <input id="name" type="text" name="name" placeholder="Evernest Real Estate" className="form-input" autoComplete="off" />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="email">Email </label>
                                                        <input id="email" type="text" name="email" placeholder="evernestre@gmail.com" className="form-input" autoComplete="off" />
                                                    </div>
                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                    <div className="border border-[#d3d3d3] dark:border-[#1b2e4b] rounded">
                                        <button
                                            type="button"
                                            className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${active === '3' ? '!text-primary' : ''}`}
                                            onClick={() => togglePara('3')}
                                        >
                                            Subject & Time
                                            <div className={`ltr:ml-auto rtl:mr-auto ${active === '3' ? 'rotate-180' : ''}`}>
                                                <IconCaretDown />
                                            </div>
                                        </button>
                                        <div>
                                            <AnimateHeight duration={300} height={active === '3' ? 'auto' : 0}>
                                                <div className="p-4 text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                    <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                        <div className="mb-3">
                                                            <label htmlFor="subject">Subject </label>
                                                            <input id="subject" type="text" name="subject" placeholder="Subject" className="form-input" autoComplete="off" />
                                                        </div>
                                                    </div>
                                                    <hr></hr>
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
                            <iframe
                                title="preview"
                                className="w-full h-full border rounded"
                                srcDoc={generatePreview()}
                                scrolling="no"
                                seamless
                                style={{ width: '100%', height: '100%', border: 'none' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewTemplate;
