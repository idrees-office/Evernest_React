import { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { useLocation, useNavigate } from 'react-router-dom';
import IconBell from '../../components/Icon/IconBell';
import IconTrash from '../../components/Icon/IconTrash';
import IconPlus from '../../components/Icon/IconPlus';
import SubscriberModal from '../../components/SubscriberModal';
import '../dashboard/dashboard.css';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import Table from '../../components/Table';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';


const endpoints = {
    listApi : `${getBaseUrl()}/subscriber/show`,
};

const SubscriberTemplate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { htmlCode, cssCode } = location.state || { htmlCode: '', cssCode: '' };
    const [isSubscriberModal, setSubscriberModal] = useState(false);
    const [loading, setloading] = useState(false);
    const requestfetch = useRef<any>(false);
    const [subscriber, setSubscriber] = useState([]);

    useEffect(() => {
        if(requestfetch.current == false){
            getsubscriber();
        }
        requestfetch.current = true;
    })

    const addContact = () => {
        setSubscriberModal(true);
    };

    const tableData = (Array.isArray(subscriber) ? subscriber : []).map((subscriberuser: any, index: number) => ({
        id     : subscriberuser.id,
        name   : subscriberuser.name,
        email  : subscriberuser.email,
        phone  : subscriberuser.phone,
        source : subscriberuser.status,
    }));

    const getsubscriber = async () => {
        const response = await apiClient.get(endpoints.listApi);
        if (response.status === 200 || response.status === 201){
            setSubscriber(response.data);

        }
    }

    const Import = async () => {
        // window.location.href = 'http://127.0.0.1:8000/add-subscriber';
        window.open('http://127.0.0.1:8000/add-subscriber', '_blank');
        // navigate('/http://127.0.0.1:8000/add-subscriber');
    }
    
    return (
        <div>
            <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
                <div className="flex items-center">
                    <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                        <IconBell />
                    </div>
                    <span className="ltr:mr-3 rtl:ml-3">Details of Your Email Subscriber: </span>
                    <button onClick={Import}   className="btn btn-primary btn-sm">{' '} <IconPlus /> Import Contact{' '} </button>
                </div>
                <div className="">
                    <button className="btn btn-primary btn-sm" type="button" onClick={addContact}> Create Single </button>
                </div>
            </div>
            {/* <div className="datatables mt-6">
                <Table
                    title="List of all users:"
                    columns={[
                        { accessor: 'id', title: '#', sortable: true },
                        { accessor: 'name', title: 'Name', sortable: true },
                        { accessor: 'email', title: 'Email', sortable: true },
                        { accessor: 'phone', title: 'Phone', sortable: true },
                        {
                            accessor: 'source',
                            title: 'Source',
                            sortable: true,
                            render: (record) => {
                                switch (record.source) {
                                    case 1:
                                        return <span className="badge bg-success">Subscriber</span>;
                                    case 2:
                                        return <span className="badge bg-secondary">Inactive</span>;
                                    case 3:
                                        return <span className="badge bg-danger">Unsubscribed</span>;
                                    default:
                                        return <span className="badge bg-light">Unknown</span>;
                                }
                            }
                        },
                        {
                            accessor: 'action',
                            title: 'Action',
                            sortable: true,
                            render: (user) => (
                                <div className="flex space-x-2">
                                    <button type="button"  className="btn px-1 py-0.5 rounded text-white bg-info">
                                        <IconPencil />
                                    </button>
                                    <button type="button" className="btn px-1 py-0.5 rounded text-white" style={{ background: '#d33', color: '#fff' }}>
                                        <IconTrashLines />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    rows={tableData}
                />
            </div> */}
            <SubscriberModal isOpen={isSubscriberModal} onClose={() => setSubscriberModal(false)}  onSuccess={getsubscriber} />
        </div>
    );
};

export default SubscriberTemplate;
