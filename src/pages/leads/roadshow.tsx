// import { useState, useEffect, useRef, Fragment } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { IRootState, AppDispatch } from '../../store';
// import Table from '../../components/Table';
// import IconBell from '../../components/Icon/IconBell';
// import IconPlus from '../../components/Icon/IconPlus';
// import IconPencil from '../../components/Icon/IconPencil';
// import IconTrash from '../../components/Icon/IconTrash';
// import { useNavigate } from 'react-router-dom';
// import Toast from '../../services/toast';
// import Loader from '../../services/loader';
// import { setPageTitle } from '../../slices/themeConfigSlice';
// import { download, roadshowleads } from '../../slices/leadsSlice';
// import Select from 'react-select';
// import LeadModal from '../../components/LeadModal';
// import { createLeads} from '../../slices/dashboardSlice';
// import '../dashboard/dashboard.css'; 
// import { jsPDF } from 'jspdf';
// import "jspdf-autotable";
// import { CountryList } from '../../services/status';
// import { DataTableSortStatus } from 'mantine-datatable';

// const RoadShow = () => {
    
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();
//     const toast =  Toast();
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEdit, setIsEdit] = useState(false);
//     const [selectedRecords, setSelectedRecords] = useState([]);
//     const [disable, setDisable] = useState(true);
//     const [list, setList] = useState<typeof CountryList>([]);
//     const [selectedCity, setSelectedCity] = useState<string>("");
//     const [searchTerm, setSearchTerm] = useState<string>('');
//     const [effectiveSearchTerm, setEffectiveSearchTerm] = useState('');
//     const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
//         columnAccessor: 'id',
//         direction: 'desc',
//     });
//     const [currentPage, setCurrentPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);
    
//     const { leads, loading, agents, total } = useSelector((state: IRootState) => state.leadslices);

//     useEffect(() => {
//         dispatch(setPageTitle('RoadShow Leads'));
//     }, [dispatch]);

//     useEffect(() => {
//         if (searchTerm.length >= 3 || searchTerm.length === 0) {
//             setEffectiveSearchTerm(searchTerm);
//             setCurrentPage(1);
//         }
//     }, [searchTerm]);

//     useEffect(() => {
//         const params = {
//             page: currentPage,
//             perPage,
//             sortField: sortStatus.columnAccessor,
//             sortOrder: sortStatus.direction,
//             search: effectiveSearchTerm,
//             cityname: selectedCity
//         };
//         dispatch(roadshowleads(params));
//     }, [dispatch, currentPage, perPage, sortStatus, effectiveSearchTerm, selectedCity]);


//     useEffect(() => {
//         if (CountryList.length > 0 && !selectedCity) {
//             setSelectedCity(CountryList[0].value);
//         }
//     }, [CountryList]);

//     const SelectCity = (value: any) => {
//         setSelectedCity(value.value);
//         setCurrentPage(1); // Reset to first page when city changes
//     };


    

//      const handlePageChange = (page: number) => {
//         setCurrentPage(page);
//         // setSelectedRecords([]);
//         // setDisable(true);
//     };
    
//     const handlePerPageChange = (pageSize: number) => {
//         setPerPage(pageSize);
//         setCurrentPage(1);
//         // setSelectedRecords([]);
//         // setDisable(true);
//     };
    
//     const handleSortChange = (status: DataTableSortStatus) => {
//         setSortStatus(status);
//         setCurrentPage(1);
//     };
//     const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(e.target.value);
//         setCurrentPage(1);
//     };
//     const tableData = (Array.isArray(leads) ? leads : []).map((lead: any, index: number) => {
//         const createdAt = lead?.created_at;
//         const formattedDate = createdAt && !isNaN(new Date(createdAt).getTime())
//             ? new Intl.DateTimeFormat('en-US', {
//                   year: 'numeric',
//                   month: '2-digit',
//                   day: '2-digit',
//                   hour: '2-digit',
//                   minute: '2-digit',
//                   second: '2-digit',
//               }).format(new Date(createdAt))
//             : 'Invalid Date'; 
//         return {
//             id      : lead?.lead_id || 'Unknown',
//             title   : lead?.lead_title || 'Unknown',
//             name    : lead?.customer_name || 'Unknown',
//             phone   : lead?.customer_phone || 'Unknown',
//             email   : lead?.customer_email || 'Unknown',
//             date    : formattedDate,
//         };
//     });

//     const copyEmails = () => {
//         const allEmails = tableData.map((row) => row.email).join('\n');
//         navigator.clipboard
//             .writeText(allEmails)
//             .then(() => {
//                 toast.success('Emails copied to clipboard!');
//             })
//             .catch(() => {
//                 toast.error('Failed to copy emails.');
//             });
//     };


//     const columns = [

//         { accessor: 'title', title: 'Title', sortable: true },
//         { accessor: 'name',  title: 'Name', sortable: true },
//         { accessor: 'phone',  title: 'Phone', sortable: true },
//         {
//             accessor: 'email',
//             title: 'Email',
//             sortable: true,
//             render: (row: any) => (
//                 <span className="badge bg-secondary cursor-pointer" onClick={copyEmails} >
//                     {row.email}
//                 </span>
//             ),
//         },
//         { accessor: 'date',  title: 'Date', sortable: true },

//     ];


//     return (
//     <div>
//         <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
//         <div className="flex items-center">
//             <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3"><IconBell /></div>
//             <span className="ltr:mr-3 rtl:ml-3"> Details of Your Road-Show Leads.</span>
//         </div> 
//          <div className="flex items-center space-x-2">
//             <Select placeholder="Choose City.." options={list.map(item => ({ value: item.value, label: item.name }))} onChange={(selectedOption) => SelectCity(selectedOption)}name="name" className="cursor-pointer custom-multiselect z-10 w-[300px]" />
//         </div>
//     </div>
//         <div className="datatables mt-6">
//             {loading ?  (  <Loader />  ) : (
//                 <Table 
//                     title="Show Road-Show Leads"  
//                     columns={columns}  
//                     rows={tableData}  
//                     totalRecords={total || 0}  
//                     currentPage={currentPage} 
//                     recordsPerPage={perPage} 
//                     onPageChange={handlePageChange} 
//                     onRecordsPerPageChange={handlePerPageChange} 
//                     onSortChange={handleSortChange} 
//                     sortStatus={sortStatus} 
//                     isLoading={loading}
//                     onSearchChange={onSearchChange}
//                     searchValue={searchTerm}
//                     noRecordsText="No records found matching your search criteria"
//                 />
//             )}
//     </div>
//         <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}  />
//     </div>
//     )
// }
// export default RoadShow;


import { useState, useEffect, useRef, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState, AppDispatch } from '../../store';
import Table from '../../components/Table';
import IconBell from '../../components/Icon/IconBell';
import IconPlus from '../../components/Icon/IconPlus';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import { useNavigate } from 'react-router-dom';
import Toast from '../../services/toast';
import Loader from '../../services/loader';
import { setPageTitle } from '../../slices/themeConfigSlice';
import { download, roadshowleads } from '../../slices/leadsSlice';
import Select from 'react-select';
import LeadModal from '../../components/LeadModal';
import { createLeads } from '../../slices/dashboardSlice';
import '../dashboard/dashboard.css'; 
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import { CountryList } from '../../services/status';
import { DataTableSortStatus } from 'mantine-datatable';

const RoadShow = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast = Toast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [disable, setDisable] = useState(true);
    const [selectedCity, setSelectedCity] = useState<string>(CountryList[3].value); // Default to Canada
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [effectiveSearchTerm, setEffectiveSearchTerm] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'desc',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    
    const { leads, loading, agents, total } = useSelector((state: IRootState) => state.leadslices);

    useEffect(() => {
        dispatch(setPageTitle('RoadShow Leads'));
    }, [dispatch]);

    useEffect(() => {
        if (searchTerm.length >= 3 || searchTerm.length === 0) {
            setEffectiveSearchTerm(searchTerm);
            setCurrentPage(1);
        }
    }, [searchTerm]);

    useEffect(() => {
        const params = {
            page: currentPage,
            perPage,
            sortField: sortStatus.columnAccessor,
            sortOrder: sortStatus.direction,
            search: effectiveSearchTerm,
            cityname: selectedCity
        };
        dispatch(roadshowleads(params));
    }, [dispatch, currentPage, perPage, sortStatus, effectiveSearchTerm, selectedCity]);

    const SelectCity = (value: any) => {
        setSelectedCity(value.value);
        setCurrentPage(1); // Reset to first page when city changes
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    const handlePerPageChange = (pageSize: number) => {
        setPerPage(pageSize);
        setCurrentPage(1);
    };
    
    const handleSortChange = (status: DataTableSortStatus) => {
        setSortStatus(status);
        setCurrentPage(1);
    };

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const tableData = (Array.isArray(leads) ? leads : []).map((lead: any, index: number) => {
        const createdAt = lead?.created_at;
        const formattedDate = createdAt && !isNaN(new Date(createdAt).getTime())
            ? new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
              }).format(new Date(createdAt))
            : 'Invalid Date'; 
        return {
            id: lead?.lead_id || 'Unknown',
            title: lead?.lead_title || 'Unknown',
            name: lead?.customer_name || 'Unknown',
            phone: lead?.customer_phone || 'Unknown',
            email: lead?.customer_email || 'Unknown',
            date: formattedDate,
        };
    });

    const copyEmails = () => {
        const allEmails = tableData.map((row) => row.email).join('\n');
        navigator.clipboard
            .writeText(allEmails)
            .then(() => {
                toast.success('Emails copied to clipboard!');
            })
            .catch(() => {
                toast.error('Failed to copy emails.');
            });
    };

    const columns = [
        { accessor: 'title', title: 'Title', sortable: true },
        { accessor: 'name', title: 'Name', sortable: true },
        { accessor: 'phone', title: 'Phone', sortable: true },
        {
            accessor: 'email',
            title: 'Email',
            sortable: true,
            render: (row: any) => (
                <span className="badge bg-secondary cursor-pointer" onClick={copyEmails}>
                    {row.email}
                </span>
            ),
        },
        { accessor: 'date', title: 'Date', sortable: true },
    ];

    return (
        <div>
            <div className="panel flex items-center justify-between overflow-visible whitespace-nowrap p-3 text-dark relative">
                <div className="flex items-center">
                    <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                        <IconBell />
                    </div>
                    <span className="ltr:mr-3 rtl:ml-3">Details of Your Road-Show Leads.</span>
                </div> 
                <div className="flex items-center space-x-2">
                    <Select 
                        placeholder="Choose City.." 
                        options={CountryList.map(item => ({ value: item.value, label: item.name }))} 
                        onChange={SelectCity}
                        defaultValue={{ value: CountryList[3].value, label: CountryList[3].name }} // Default to Canada
                        name="name" 
                        className="cursor-pointer custom-multiselect z-10 w-[300px]" 
                    />
                </div>
            </div>
            <div className="datatables mt-6">
                {loading ? (
                    <Loader />
                ) : (
                    <Table 
                        title="Show Road-Show Leads"  
                        columns={columns}  
                        rows={tableData}  
                        totalRecords={total || 0}  
                        currentPage={currentPage} 
                        recordsPerPage={perPage} 
                        onPageChange={handlePageChange} 
                        onRecordsPerPageChange={handlePerPageChange} 
                        onSortChange={handleSortChange} 
                        sortStatus={sortStatus} 
                        isLoading={loading}
                        onSearchChange={onSearchChange}
                        searchValue={searchTerm}
                        noRecordsText="No records found matching your search criteria"
                    />
                )}
            </div>
            <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default RoadShow;
