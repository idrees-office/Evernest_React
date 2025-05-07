import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState, AppDispatch } from '../../store';
import Table from '../../components/Table';
import IconBell from '../../components/Icon/IconBell';
import IconRefresh from '../../components/Icon/IconRefresh';
import { setPageTitle } from '../../slices/themeConfigSlice';
import { closeleads } from '../../slices/leadsSlice';
import Toast from '../../services/toast';
import Loader from '../../services/loader';
import '../dashboard/dashboard.css';

interface Lead {
  lead_id: string;
  lead_title: string;
  customer_name: string;
  customer_phone: string;
  lead_status: string;
  updated_at: string;
}

interface SortStatus {
  columnAccessor: string;
  direction: 'asc' | 'desc';
}

const WonLeads = () => {
    const dispatch = useDispatch<AppDispatch>();
    const toast = Toast();
    const loader = Loader();
    const combinedRef = useRef<{ fetched: boolean }>({ fetched: false });
    
    // State with proper typing
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchValue, setSearchValue] = useState<string>('');
    const [sortStatus, setSortStatus] = useState<SortStatus>({
        columnAccessor: 'date',
        direction: 'desc'
    });

    // Redux state with proper typing
    const { leads, loading, total, last_page, current_page, per_page } = useSelector((state: IRootState) => state.leadslices);
    
    // Fetch closed leads with pagination
    const fetchClosedLeads = () => {
        dispatch(closeleads({
            page,
            perPage: pageSize,
            sortField: sortStatus.columnAccessor === 'date' ? 'updated_at' : sortStatus.columnAccessor,
            sortOrder: sortStatus.direction,
            search: searchValue
        }));
    };

    useEffect(() => {
        if (!combinedRef.current.fetched) {
            dispatch(setPageTitle('Closed Deals'));
            combinedRef.current.fetched = true;
        }
        fetchClosedLeads();
    }, [page, pageSize, sortStatus, searchValue]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    };

    const handleSortChange = (newSortStatus: SortStatus) => {
        setSortStatus(newSortStatus);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setPage(1);
    };

    const handleRefresh = () => {
        fetchClosedLeads();
        toast.success('Closed deals refreshed successfully!');
    };

    const tableData = leads?.map((lead: any) => ({
        id: lead.lead_id || 'N/A',
        title: lead.lead_title || 'N/A',
        name: lead.customer_name || 'N/A',
        phone: lead.customer_phone || 'N/A',
        status: lead.lead_status || 'N/A',
        date: lead.updated_at ? new Intl.DateTimeFormat('en-US', {
            year: 'numeric', 
            month: '2-digit',
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit'
        }).format(new Date(lead.updated_at)) : 'N/A',
    })) || [];

    return (
        <div className="container mx-auto px-4">
            <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
                <div className="flex items-center">
                    <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3"> <IconBell /> </div>
                    <span className="ltr:mr-3 rtl:ml-3">Closed Deals ({total || 0})</span>
                </div>
                {/* <div className="flex items-center space-x-2">
                    <button 
                        onClick={handleRefresh}
                        className="btn btn-primary btn-sm flex items-center"
                        disabled={loading}
                    >
                        <IconRefresh className="w-4 h-4 mr-1" />
                        Refresh
                    </button>
                </div> */}
            </div>
            
            <div className="datatables mt-6">
                    <Table 
                        title={`Closed Deals (${total})` || 'Closed Deals (0)'}
                        columns={[
                            { 
                                accessor: 'title', 
                                title: 'Title', 
                                sortable: true,
                                width: '25%'
                            },
                            { 
                                accessor: 'name', 
                                title: 'Name', 
                                sortable: true,
                                width: '20%'
                            },
                            { 
                                accessor: 'phone', 
                                title: 'Phone', 
                                sortable: true,
                                width: '15%'
                            },
                            { 
                                accessor: 'status', 
                                title: 'Status', 
                                sortable: false,
                                width: '15%',
                                render: () => (
                                    <span className="badge bg-success">Closed</span>
                                ),
                            },
                            { 
                                accessor: 'date', 
                                title: 'Closed Date', 
                                sortable: true,
                                width: '25%'
                            },
                        ]} 
                        rows={tableData}
                        totalRecords={total}
                        currentPage={current_page}
                        recordsPerPage={per_page}
                        onPageChange={handlePageChange}
                        onRecordsPerPageChange={handlePageSizeChange}
                        onSortChange={handleSortChange}
                        sortStatus={sortStatus}
                        onSearchChange={handleSearchChange}
                        searchValue={searchValue}
                        noRecordsText="No closed deals found"
                    />
               
            </div> 
        </div>
    );
};

export default WonLeads;