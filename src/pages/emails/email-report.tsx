import { useEffect, useRef, useState } from 'react';
import '../dashboard/dashboard.css';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import Table from '../../components/Table';
import Swal from 'sweetalert2';
import { DataTableSortStatus } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

const endpoints = {
    listApi: `${getBaseUrl()}/subscriber/show-email-report`,
};

const EmailReportTemplate = () => {
    const dispatch = useDispatch<AppDispatch>();
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
    const [emailreports, setEmailReports] = useState([]);
    const combinedRef = useRef<any>({  fetched: false,});

    useEffect(() => {
         if (!combinedRef.current.fetched) {
            getEmailReportData();
         }
         combinedRef.current.fetched = true;
    }, [page, pageSize, sortStatus, searchQuery]);

    const getEmailReportData = async () => {
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
                setEmailReports(response.data.data || []);
                setTotalRecords(response.data.meta.total || 0);
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

   

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const tableData = (Array.isArray(emailreports) ? emailreports : []).map((emailreport: any, index: number) => ({
        id: emailreport.id,
        campaign_name: emailreport.campaign_name,
        subscriber_name: emailreport.subscriber_name,
        last_opened_at: emailreport.last_opened_at,
        status: emailreport.status,
    }));
    

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
                    // getEmailReportData();
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
            <div className="datatables mt-6">
                <Table
                    title="Email Reports:"
                    columns={[
                        { accessor: 'id', title: '#', sortable: true },
                        { accessor: 'campaign_name', title: 'Campaign Name', sortable: true },
                        { accessor: 'subscriber_name', title: 'Subscriber Name', sortable: true },
                        { accessor: 'last_opened_at', title: 'Last Open', sortable: true },
                        {
                            accessor: 'status',
                            title: 'Status',
                            sortable: true,
                            render: (record: any) => {
                                switch (record.status) {
                                    case 1:
                                        return <span className="badge bg-success">Opend</span>;
                                    case 2:
                                        return <span className="badge bg-secondary">Inactive</span>;
                                    case 3:
                                        return <span className="badge bg-danger">Unsubscribed</span>;
                                    default:
                                        return <span className="badge bg-light">Unknown</span>;
                                }
                            },
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
        </div>
    );
};

export default EmailReportTemplate;
