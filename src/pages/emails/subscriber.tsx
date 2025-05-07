// import { useEffect, useRef, useState } from 'react';
// import CodeMirror from '@uiw/react-codemirror';
// import { html } from '@codemirror/lang-html';
// import { useLocation, useNavigate } from 'react-router-dom';
// import IconBell from '../../components/Icon/IconBell';
// import IconTrash from '../../components/Icon/IconTrash';
// import IconPlus from '../../components/Icon/IconPlus';
// import SubscriberModal from '../../components/SubscriberModal';
// import '../dashboard/dashboard.css';
// import { getBaseUrl } from '../../components/BaseUrl';
// import apiClient from '../../utils/apiClient';
// import Table from '../../components/Table';
// import IconPencil from '../../components/Icon/IconPencil';
// import IconTrashLines from '../../components/Icon/IconTrashLines';


// const endpoints = {
//     listApi : `${getBaseUrl()}/subscriber/show`,
// };

// const SubscriberTemplate = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { htmlCode, cssCode } = location.state || { htmlCode: '', cssCode: '' };
//     const [isSubscriberModal, setSubscriberModal] = useState(false);
//     const [loading, setloading] = useState(false);
//     const requestfetch = useRef<any>(false);
//     const [subscriber, setSubscriber] = useState([]);

//     useEffect(() => {
//         if(requestfetch.current == false){
//             getsubscriber();
//         }
//         requestfetch.current = true;
//     })

//     const addContact = () => {
//         setSubscriberModal(true);
//     };

//     const tableData = (Array.isArray(subscriber) ? subscriber : []).map((subscriberuser: any, index: number) => ({
//         id     : subscriberuser.id,
//         name   : subscriberuser.name,
//         email  : subscriberuser.email,
//         phone  : subscriberuser.phone,
//         source : subscriberuser.status,
//     }));

//     const getsubscriber = async () => {
//         const response = await apiClient.get(endpoints.listApi);
//         if (response.status === 200 || response.status === 201){
//             setSubscriber(response.data);

//         }
//     }

//     const Import = async () => {
//         window.open('http://127.0.0.1:8000/add-subscriber', '_blank');
//     }
    
//     return (
//         <div>
//             <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
//                 <div className="flex items-center">
//                     <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
//                         <IconBell />
//                     </div>
//                     <span className="ltr:mr-3 rtl:ml-3">Details of Your Email Subscriber: </span>
//                     <button onClick={Import}   className="btn btn-primary btn-sm">{' '} <IconPlus /> Import Contact{' '} </button>
//                 </div>
//                 <div className="">
//                     <button className="btn btn-primary btn-sm" type="button" onClick={addContact}> Create Single </button>
//                 </div>
//             </div>
//              <div className="datatables mt-6">
//                 <Table
//                     title="List of all users:"
//                     columns={[
//                         { accessor: 'id', title: '#', sortable: true },
//                         { accessor: 'name', title: 'Name', sortable: true },
//                         { accessor: 'email', title: 'Email', sortable: true },
//                         { accessor: 'phone', title: 'Phone', sortable: true },
//                         {
//                             accessor: 'source',
//                             title: 'Source',
//                             sortable: true,
//                             render: (record) => {
//                                 switch (record.source) {
//                                     case 1:
//                                         return <span className="badge bg-success">Subscriber</span>;
//                                     case 2:
//                                         return <span className="badge bg-secondary">Inactive</span>;
//                                     case 3:
//                                         return <span className="badge bg-danger">Unsubscribed</span>;
//                                     default:
//                                         return <span className="badge bg-light">Unknown</span>;
//                                 }
//                             }
//                         },
//                         {
//                             accessor: 'action',
//                             title: 'Action',
//                             sortable: true,
//                             render: (user) => (
//                                 <div className="flex space-x-2">
//                                     <button type="button"  className="btn px-1 py-0.5 rounded text-white bg-info">
//                                         <IconPencil />
//                                     </button>
//                                     <button type="button" className="btn px-1 py-0.5 rounded text-white" style={{ background: '#d33', color: '#fff' }}>
//                                         <IconTrashLines />
//                                     </button>
//                                 </div>
//                             ),
//                         },
//                     ]}
//                     rows={tableData}
//                 />
//             </div> 
//             <SubscriberModal isOpen={isSubscriberModal} onClose={() => setSubscriberModal(false)}  onSuccess={getsubscriber} />
//         </div>
//     );
// };

// export default SubscriberTemplate;






import { useEffect, useRef, useState } from 'react';
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
import Swal from 'sweetalert2';
import { DataTableSortStatus } from 'mantine-datatable';

const endpoints = {
    listApi: `${getBaseUrl()}/subscriber/show`,
};

const SubscriberTemplate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { htmlCode, cssCode } = location.state || { htmlCode: '', cssCode: '' };
    const [isSubscriberModal, setSubscriberModal] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ 
        columnAccessor: 'id', 
        direction: 'asc' 
    });
    const [searchQuery, setSearchQuery] = useState('');

    const [subscriber, setSubscriber] = useState([]);

    useEffect(() => {
        getSubscriber();
    }, [page, pageSize, sortStatus, searchQuery]);

    const getSubscriber = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                per_page: pageSize,
                sort_field: sortStatus.columnAccessor,
                sort_order: sortStatus.direction,
                search: searchQuery
            };
            
            const response = await apiClient.get(endpoints.listApi, { params });
            if (response.data) {
                setSubscriber(response.data.data || []);
                setTotalRecords(response.data.total || 0);
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                window.location.href = '/error';
            }
            showServerError('Something wrong on server');
        } finally {
            setLoading(false);
        }
    };

    const showSuccessToast = (message: string) => {
        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: message,
            icon: 'success',
        });
    };

    const showServerError = (message: string) => {
        Swal.fire({
            text: message,
            icon: 'error',
            title: 'Server Error',
        });
    };

    const addContact = () => {
        setSubscriberModal(true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const tableData = (Array.isArray(subscriber) ? subscriber : []).map((subscriberuser: any, index: number) => ({
        id: subscriberuser.id,
        name: subscriberuser.name,
        email: subscriberuser.email,
        phone: subscriberuser.phone,
        source: subscriberuser.status,
    }));

    const Import = async () => {
        window.open('http://127.0.0.1:8000/add-subscriber', '_blank');
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });
        
        if (result.isConfirmed) {
            try {
                const response = await apiClient.delete(`${getBaseUrl()}/subscriber/delete/${id}`);
                if (response.status === 200) {
                    showSuccessToast('Subscriber deleted successfully');
                    getSubscriber();
                }
            } catch (error: any) {
                if (error.response?.status === 403) {
                    window.location.href = '/error';
                }
                showServerError('Something wrong on server');
            }
        }
    };

    return (
        <div>
            <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
                <div className="flex items-center">
                    <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                        <IconBell />
                    </div>
                    <span className="ltr:mr-3 rtl:ml-3">Details of Your Email Subscriber: </span>
                    <button onClick={Import} className="btn btn-primary btn-sm">
                        {' '}
                        <IconPlus /> Import Contact{' '}
                    </button>
                </div>
                <div className="">
                    <button className="btn btn-primary btn-sm" type="button" onClick={addContact}>
                        Create Single
                    </button>
                </div>
            </div>
            <div className="datatables mt-6">
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
                            render: (record: any) => {
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
                            },
                        },
                        {
                            accessor: 'action',
                            title: 'Action',
                            sortable: false,
                            render: (user: any) => (
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        className="btn px-1 py-0.5 rounded text-white bg-info"
                                    >
                                        <IconPencil />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(user.id)}
                                        className="btn px-1 py-0.5 rounded text-white bg-red-600"
                                    >
                                        <IconTrashLines />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    rows={tableData}
                    totalRecords={totalRecords}
                    currentPage={page}
                    recordsPerPage={pageSize}
                    onPageChange={(p) => setPage(p)}
                    onRecordsPerPageChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                    onSortChange={setSortStatus}
                    onSearchChange={handleSearchChange}
                    sortStatus={sortStatus}
                    isLoading={loading}
                    minHeight={200}
                    noRecordsText="No subscribers found"
                    searchValue={searchQuery}
                />
            </div>
            <SubscriberModal
                isOpen={isSubscriberModal}
                onClose={() => setSubscriberModal(false)}
                onSuccess={getSubscriber}
            />
        </div>
    );
};

export default SubscriberTemplate;
