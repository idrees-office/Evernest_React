import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../slices/themeConfigSlice';
import Swal from 'sweetalert2';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Loader from '../../services/loader';
import { leaveTypes, approvalStatusOptions } from '../../services/status';
import Select from 'react-select';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPencil from '../../components/Icon/IconPencil';
import Table from '../../components/Table';
import { AppDispatch, IRootState } from '../../store';
import '../dashboard/dashboard.css';
import ReactQuill from 'react-quill';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconEye from '../../components/Icon/IconEye';
import ApprovalLeaveModal from '../../components/ApprovalLeaveModal';
import Toast from '../../services/toast';

const endpoints = {
    createApi       : `${getBaseUrl()}/users/leave_request`,
    listApi         : `${getBaseUrl()}/users/leaves_list`,
    deleteApi       : `${getBaseUrl()}/users/delete_leave`,
    aprovalLeaveApi : `${getBaseUrl()}/users/aprove_leave`,

};

const Leaves = () => {
    const dispatch = useDispatch<AppDispatch>();
    const loader = Loader();
    const combinedRef = useRef<any>({ userformRef: null });
    const [leaves, setLeaves] = useState([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [start_date, setStartDate] = useState<any | null>(null);
    const [end_date, setEndDate] = useState<any | null>(null);
    const [leavetype, setLeaveType] = useState<any | null>(null);
    const [totalallowLeave, setTotalAllowLeave] = useState(0);
    const [RemainingLeaves, setRemainingLeaves] = useState(0);
    const loginuser       = useSelector((state: IRootState) => state.auth.user || {});

    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState<any>(null);
    const toast = Toast();
    
    useEffect(() => {
        setPageTitle('Create Leave')
        fetchLeaveList();
    }, [page, pageSize, sortStatus, searchQuery]);

    const fetchLeaveList = async () => {
        try {
            const params = { page, per_page: pageSize, sort_field: sortStatus.columnAccessor, sort_order: sortStatus.direction, search: searchQuery};
            const response = await apiClient.get(endpoints.listApi, { params });
            if (response.data) {
                setLeaves(response.data.data.leaves || []); 
                setTotalRecords(response.data.data.leaves.length || 0);
                setTotalAllowLeave(response.data.data.allowed_leave || 0);
               const approvedLeaves = response.data.data.leaves.filter((leave: any) => leave.status === 2 && leave.client_user_id === loginuser.client_user_id);
               const totalUsedDays = approvedLeaves.reduce((acc: number, leave: any) => { return acc + (leave.days || 0); }, 0);
               setRemainingLeaves(response.data.data.allowed_leave - totalUsedDays);
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                window.location.href = '/error';
            }
            showServerError();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (combinedRef.current.userformRef) {
                const formData = new FormData(combinedRef.current.userformRef);
                const userId = formData.get('id');
                const response = userId ? await apiClient.post(`${endpoints.createApi}/${userId}`, formData) : await apiClient.post(endpoints.createApi, formData);
                if (response.status === 200 || response.status === 201) {
                    showSuccessToast(response.data.message);
                    fetchLeaveList();
                    setErrors({});
                    combinedRef.current.userformRef.reset();
                  
                }
            }
        } catch (error: any) {
            if (error.response?.data) { setErrors(error.response.data); } 
            if(error.status === 422){
                Swal.fire({ 
                    icon: 'warning', 
                    title: 'Incomplete Leave Request', 
                    text: `` + error.response.data.message+``,
                });
            }
            
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

    const showServerError = () => {
        Swal.fire({
            text: 'Something went wrong on the server',
            icon: 'error',
            title: 'Server Error',
        });
    };

    const handleEdit = async (leave: any) => {
        if(leave.status = 2){ toast.info('Cannot update leave — its already approved. Thank you.'); return }

        if (combinedRef.current.userformRef) {
            const form = combinedRef.current.userformRef;
            form.reset();
            form.id.value = leave.id || '';
            setStartDate(new Date(leave.start_date));
            setEndDate(new Date(leave.end_date));
            setLeaveType(leave.leave_type);
            form.reason.value = leave.reason || '';
        }
    };

    const handleDelete = async (leave: any) => {
         if(leave.status = 2){ toast.info('Cannot Delete leave — its already approved. Thank you.'); return }
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
                const response = await apiClient.delete(endpoints.deleteApi + `/${leave.id}`);
                if (response.status === 200 || response.status === 201) {
                    showSuccessToast('Leave deleted successfully');
                    fetchLeaveList(); 
                }
            } catch (error: any) {
               if (error.status == 403 || error.status == 404) {
                    Swal.fire(error.response.data.message || 'Validation failed.');
                } else {
                    Swal.fire('Error', 'Something went wrong.', 'error');
                }
            }
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1); 
    };
    const handlePageChange = (p: number) => {
        setPage(p);
    };
    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setPage(1);
    };

    const AprovalLeave = async (leave: any) => {
        setSelectedLeave(leave);
        setIsApprovalModalOpen(true);
    };
    
    const handleApprovalSubmit = async (formValues: { action: string; approved_start_date: string; approved_end_date: string; response:any }) => {
        try {
            const formData = new FormData();
            formData.append('id', selectedLeave.id);
            formData.append('approved_by', loginuser.client_user_id);
            formData.append('action', formValues.action);
            if (formValues.action === 'approve') {
                formData.append('approved_start_date', formValues.approved_start_date);
                formData.append('approved_end_date', formValues.approved_end_date);
                
            }
            formData.append('response', formValues.response);
            const response = await apiClient.post(endpoints.aprovalLeaveApi, formData);
            if (response.status === 200 || response.status === 201) {
                fetchLeaveList();
                setErrors({});
                Swal.fire('Success!', response.data.message, 'success');
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                Swal.fire('Error', error.response.data.message || 'Validation failed.', 'error');
                setIsApprovalModalOpen(false);
                
            } else {
                Swal.fire('Error', 'Something went wrong.', 'error');
            }
        }
    };

    const columns = [
    {
        accessor: 'id',
        title: '#',
        width: 80,
        key: 'id'
    },
    {
        accessor: 'leave_type',
        title: 'Leave Type',
        sortable: true,
        render: (row: any) => {
        const type = leaveTypes.find((type) => type.value === row.leave_type);
        return type ? <span className="bg-secondary badge"> {type.label} </span> : '-';
        },
        key: 'leave_type'
    },
    {
        accessor: 'client_user_name',
        title: 'Agent Name',
        sortable: true,
        render: (row: any) => row.user?.client_user_name || '-',
        key: 'client_user_name'
    },
    {
        accessor: 'start_date',
        title: 'Start Date',
        sortable: true,
        render: (row: any) => {
        if (row.status === 1) {
            return  <div>{row.start_date}</div>;
        }else if(row.status === 2 && row.approved_start_date){
              return  <div>{row.approved_start_date}</div>;
        }else{
           return  <div>{row.start_date}</div>;
        }
        },
        key: 'start_date'
    },
    {
        accessor: 'end_date',
        title: 'End Date',
        sortable: true,
        render: (row: any) => {
        if (row.status === 1) {
            return <div>{row.end_date}</div>;
        }else if(row.status === 2 && row.approved_end_date){
            return <div>{row.approved_end_date}</div> 
        }else{
             return <div>{row.end_date}</div>;
        }
        },
        key: 'end_date'
    },
    {
        accessor: 'days',
        title: 'Total Days',
        sortable: true,
        render: (row: any) => {
        return row.days ? <span className="bg-success badge"> {row.days} </span> : '-';
        },
        key: 'days'
    },
    {
        accessor: 'status',
        title: 'Leave Status',
        sortable: true,
        render: (row: any) => {
        const type = approvalStatusOptions.find((type) => type.value == row.status);
        return type ? <span className="bg-dark badge"> {type.label} </span> : '-';
        },
        key: 'status'
    },
    {
        accessor: 'actions',
        title: 'Actions',
        width: 120,
        key: 'actions-column',
        render: (item: any) => (
        <div className="flex space-x-2">
            <>
            <button
                type="button"
                onClick={() => AprovalLeave(item)}
                className="btn px-1 py-0.5 rounded text-white bg-green-600"
                key={`view-${item.id}`}
            >
                <IconEye />
            </button>
            <button
                type="button"
                onClick={() => handleDelete(item)}
                className="btn px-1 py-0.5 rounded text-white bg-red-600"
                key={`delete-${item.id}`}
            >
                <IconTrashLines />
            </button>
            </>
            <button
            type="button"
            onClick={() => handleEdit(item)}
            className="btn px-1 py-0.5 rounded text-white bg-info"
            key={`edit-${item.id}`}
            >
            <IconPencil />
            </button>
        </div>
        )
    }
    ];

    return (
        <form ref={(el) => (combinedRef.current.userformRef = el)} onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-wrap -mx-4">
                <div className="w-full lg:w-2/3 px-2 mt-6 lg:mt-0 md-mt-0">
                      <div className="datatables">
                        <Table
                            columns={columns}
                            rows={leaves}
                            title="List of all Leaves"
                            idAccessor="id"
                            totalRecords={totalRecords}
                            currentPage={page}
                            recordsPerPage={pageSize}
                            onPageChange={handlePageChange}
                            onRecordsPerPageChange={handlePageSizeChange}
                            onSortChange={setSortStatus}
                            onSearchChange={handleSearchChange}
                            sortStatus={sortStatus}
                            isLoading={false}
                            minHeight={200}
                            noRecordsText="No Leaves found"
                            searchValue={searchQuery}
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/3 px-3">
                    <div className="panel">
                        <div className="panel-body">
                            <div className="flex justify-end">
                                <span className="badge bg-info text-white mr-2"> Total Allow Leave { totalallowLeave } </span>
                                 <span className="badge bg-dark text-white">Remaining Leave { RemainingLeaves || 0} </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="form-group sm:col-span-2">
                                    <label htmlFor="title">Leave Start Date</label>
                                    <Flatpickr name="start_date" value={start_date}   options={{ dateFormat: 'Y-m-d'}} className="form-input" placeholder="Y-m-d" onChange={(start_date) => { setStartDate(start_date[0]); }} />
                                    <input type="hidden" name="id" id="id" />
                                    {errors.start_date && <span className="text-red-500 text-sm">{errors.start_date}</span>}
                                </div>
                                 <div className="form-group sm:col-span-2">
                                    <label htmlFor="title">Leave End Date</label>
                                    <Flatpickr name="end_date" value={end_date} options={{ dateFormat: 'Y-m-d'}} className="form-input" placeholder="Y-m-d" onChange={(end_date) => { setEndDate(end_date[0]); }} />
                                    {errors.end_date && <span className="text-red-500 text-sm">{errors.end_date}</span>}
                                </div>
                                <div className="form-group sm:col-span-2">
                                    <label htmlFor="leave_type">Leave Type</label>
                                    <Select name="leave_type" placeholder="Employee Type" options={leaveTypes} value={leaveTypes.find((option) => option.value === leavetype)} onChange={(selected) => setLeaveType(selected?.value || null)}
                                    />
                                    {errors.leave_type && ( <span className="text-red-500 text-sm"> {errors.leave_type} </span> )}
                                </div>
                                <div className="form-group sm:col-span-2">
                                    <label htmlFor="reason">Leave Reason</label>
                                    <textarea name="reason" id="reason" className="form-input" style={{ height: '316px' }} />
                                     {errors.reason && ( <span className="text-red-500 text-sm"> {errors.reason} </span> )}
                                </div>
                                <div className="sm:col-span-2 flex justify-end">
                                    <button type="submit" className="btn btn-success w-full"> Submit </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ApprovalLeaveModal leave={selectedLeave} isOpen={isApprovalModalOpen} onClose={() => setIsApprovalModalOpen(false)} onSubmit={handleApprovalSubmit}/>
        </form>
    );
};

export default Leaves;
