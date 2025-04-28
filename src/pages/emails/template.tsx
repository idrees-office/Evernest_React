import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
// import "tailwindcss/tailwind.css";

const EmailTemplate = () => {
    const [htmlCode, setHtmlCode] = useState("");
    const [cssCode, setCssCode] = useState("");
    const [recipients, setRecipients] = useState<string[]>([]); 
    const [emailInput, setEmailInput] = useState("");
    const navigate = useNavigate();

    const generatePreview = () => {
        return `
            <html>
                <head>
                    <style>${cssCode}</style>
                </head>
                <body>${htmlCode}</body>
            </html>
        `;
    };
    const handleSave = () => {
        navigate("/pages/email/preview", { 
            state: { htmlCode, cssCode } 
        });
    };
    
    return (
        <div className="min-h-screen p-2 sm:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[calc(100vh-100px)]">
                <div className="panel p-3 sm:p-4 border rounded bg-white shadow h-[calc(100vh-140px)] overflow-hidden">
                    <h2 className="text-lg font-bold mb-3">HTML Code</h2>
                    <div className="h-[calc(100%-3rem)]">
                        <CodeMirror 
                            value={htmlCode}
                            height="100%"
                            extensions={[html()]}
                            onChange={(value) => setHtmlCode(value)}
                            className="border rounded overflow-auto"
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                </div>
                <div className="panel p-3 sm:p-4 border rounded bg-white shadow h-[calc(100vh-140px)] overflow-hidden flex flex-col">
                    <h2 className="text-lg font-bold mb-3">Live Preview</h2>
                    <div className="flex-grow">
                        <iframe 
                            title="preview"
                            className="w-full h-full border rounded"
                            srcDoc={generatePreview()}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                    <button className="mt-3 p-2 btn btn-secondary btn-sm text-white rounded" onClick={handleSave} >Save</button>
                </div>

                {/* <div className="panel p-3 sm:p-4 border rounded bg-white shadow h-[calc(100vh-140px)] overflow-hidden">
                    <h2 className="text-lg font-bold mb-3">Recipients</h2>
                    <div>
                        <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="border p-2 rounded mb-2 w-full" placeholder="Add recipient email"
                        />
                        <button onClick={handleAddRecipient} className="btn btn-primary w-full mb-3">
                            Add Recipient
                        </button>
                        <ul>
                            {recipients.map((email, index) => (
                                <li key={index} className="text-sm mb-1">
                                    {email}
                                    <button 
                                        onClick={() => setRecipients(recipients.filter((_, i) => i !== index))}
                                        className="ml-2 text-red-500"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button 
                        onClick={sendEmailCampaign}
                        className="btn btn-primary w-full"
                    >
                        Send Email Campaign
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default EmailTemplate;

