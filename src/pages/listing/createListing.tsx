import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../slices/themeConfigSlice';
import Swal from 'sweetalert2';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Loader from '../../services/loader';
import { Rentoptions, Saleoptions, RentalPeriodOption } from '../../services/status';
import Select from 'react-select';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPencil from '../../components/Icon/IconPencil';
import Table from '../../components/Table';
import { AppDispatch } from '../../store';
import '../dashboard/dashboard.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Toast from '../../services/toast';

const endpoints = {
    createApi: `${getBaseUrl()}/users/create_user`,
    roleApi: `${getBaseUrl()}/users/get_user_role`,
    listApi: `${getBaseUrl()}/users/user_list`,
    destoryApi: `${getBaseUrl()}/users/delete_user`,
    updateApi: `${getBaseUrl()}/users/update_user`,
};

const createListing = () => {
    const dispatch = useDispatch<AppDispatch>();
    const loader = Loader();
    const toast = Toast();
    const combinedRef = useRef<any>({ userformRef: null });
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState<any | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [urole, setRoles] = useState<any | null>(null);
    const [selectedRole, setSelectedRole] = useState<any | null>(null);
    const requestMade = useRef(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'client_user_id', direction: 'asc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [occupancy, setoccupancy] = useState<any>({ disabled : true, occupancyoption: {} });
    const [selectedOccOption, setSelectedOccOption] = useState<any | null>(null);
     const [rentalPeriod, setRentalPeriod] = useState<any>({ disabled : true, options: RentalPeriodOption});


    useEffect(() => {
        if (!requestMade.current) {
            dispatch(setPageTitle('Create User'));
            fetchRoles();
            requestMade.current = true;
        }
    }, [dispatch]);

    useEffect(() => {
        fetchUserLists();
    }, [page, pageSize, sortStatus, searchQuery]);

    const fetchRoles = async () => {
        try {
            const response = await apiClient.get(endpoints.roleApi);
            if (response.data) {
                const roleOptions = response.data.data.map((role: any) => ({
                    value: role.id,
                    label: role.name,
                }));
                setRoles(roleOptions);
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                window.location.href = '/error';
            }
        }
    };

    const fetchUserLists = async () => {
        try {
            const params = {
                page,
                per_page: pageSize,
                sort_field: sortStatus.columnAccessor,
                sort_order: sortStatus.direction,
                search: searchQuery,
            };
            const response = await apiClient.get(endpoints.listApi, { params });
            if (response.data) {
                setUsers(response.data.data.data || []);
                setTotalRecords(response.data.data.total || 0);
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
                const userId = formData.get('client_user_id');
                const response = userId ? await apiClient.post(`${endpoints.updateApi}/${userId}`, formData) : await apiClient.post(endpoints.createApi, formData);
                if (response.status === 200 || response.status === 201) {
                    showSuccessToast(response.data.message);
                    fetchUserLists();
                    setErrors({});
                    combinedRef.current.userformRef.reset();
                    setSelectedRole(null);
                    setStatus(null);
                }
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.status === 403) {
                window.location.href = '/error';
            } else {
                showServerError();
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

    const handleRoleChange = (selectedOption: any) => {
        setSelectedRole(selectedOption);
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

    const HandleCategory = (e:any) => {
        const optionValue = e.target.value ? e.target.value : '0';
        setSelectedOccOption(null);
        if (!optionValue || optionValue == 0) {
            setoccupancy({ disabled: true, occupancyoption: {} });
            setRentalPeriod({ disabled: true, options: [] });
            return;
        }
        const isRent = optionValue == 1 || optionValue === 2;
        const isSale = optionValue == 3 || optionValue == 4;

        if (isRent) {
            setoccupancy({ disabled: false, occupancyoption: Rentoptions });
            setRentalPeriod({ disabled: false, options: RentalPeriodOption });
        } else if (isSale) {
            setoccupancy({ disabled: false, occupancyoption: Saleoptions });
            setRentalPeriod({ disabled: true, options: [] });
        }

    }


    const selectOption = (option: any) => {
        setSelectedOccOption(option);   
    }


    const columns = [
        {
            accessor: 'client_user_id',
            title: '#',
            width: 80,
            key: 'id',
        },
        {
            accessor: 'client_user_name',
            title: 'Name',
            sortable: true,
            key: 'client_user_name_column',
        },
        {
            accessor: 'client_user_email',
            title: 'Email',
            sortable: true,
            key: 'email-column',
        },
    ];

    return (
        <form ref={(el) => (combinedRef.current.userformRef = el)} onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-wrap -mx-4">
                <div className="w-full lg:w-1/3 px-4">
                    <div className="panel">
                        <div className="panel-body">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label htmlFor="listing_category_id">Listing Type</label>
                                    <select id="listing_category_id" className="form-input" onChange={HandleCategory}>
                                        <option value="">Select Listing Type</option>
                                        <option value="1">Residential (Rent)</option>
                                        <option value="2">Commercial (Rent)</option>
                                        <option value="3">Residential (Sale)</option>
                                        <option value="4">Commercial (Sale)</option>
                                    </select>
                                    <input type="hidden" name="listing_id" id="listing_id" />
                                    {errors.listing_category_id && <span className="text-red-500 text-sm"> {errors.listing_category_id} </span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="listing_slug">Slug</label>
                                    <input name="listing_slug" type="text" placeholder="Slug" className="form-input" />
                                    {errors.listing_slug && <span className="text-red-500 text-sm"> {errors.listing_slug} </span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="listing_meta_description">Meta Designation</label>
                                    <input name="listing_meta_description" type="text" placeholder="Meta Designation" className="form-input" />
                                    {errors.listing_meta_description && <span className="text-red-500 text-sm">{errors.listing_meta_description}</span>}
                                </div>
                                 <div className="form-group">
                                    <div className="form-group">
                                        <label htmlFor="rental_period">Rental Period</label>
                                        <Select name="rental_period" placeholder="Select rental period" value={selectedOccOption} options={rentalPeriod.options} isDisabled={rentalPeriod.disabled} />
                                    </div>
                                    {errors.rental_period && <span className="text-red-500 text-sm">{errors.rental_period}</span>}
                                </div>

                                 <div className="form-group sm:col-span-2">
                                    <label htmlFor="price">Price</label>
                                    <input name="price" type="text" placeholder="Price" className="form-input" />
                                    {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                                </div>
                                <div className="form-group sm:col-span-2">
                                    <label htmlFor="listing_meta_description">Designation</label>
                                    <ReactQuill theme="snow" placeholder="Description" />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button type="submit" className="btn btn-primary">{' '}Submit{' '}</button>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="w-full lg:w-1/3 px-4">
                    <div className="panel">
                        <div className="panel-body">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="form-group">
                                        <label htmlFor="listing_reference">Reference #</label>
                                        <input name="listing_reference" type="number" placeholder="Reference Number" className="form-input"/>
                                        {errors.listing_reference && ( <span className="text-red-500 text-sm"> {errors.listing_reference} </span> )}
                                    </div> 
                                <div className="form-group">
                                    <label htmlFor="listing_type_id">Property Type</label>
                                    <input name="listing_type_id" type="text" placeholder="Slug" className="form-input" />
                                    {errors.listing_type_id && <span className="text-red-500 text-sm"> {errors.listing_type_id} </span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="listing_size">Size (Sqft)</label>
                                    <input name="listing_size" type="text" placeholder="Size" className="form-input" />
                                    {errors.listing_size && <span className="text-red-500 text-sm">{errors.listing_size}</span>}
                                </div>
                                <div className="form-group">
                                        <label htmlFor="listing_built_up_area">Built-up area (Sqft): #</label>
                                        <input name="listing_built_up_area" type="number" placeholder="Built-up Area" className="form-input"/>
                                        {errors.listing_built_up_area && ( <span className="text-red-500 text-sm"> {errors.listing_built_up_area} </span> )}
                                </div> 
                                <div className="form-group">
                                    <label htmlFor="listing_bedrooms"># of Bedrooms:</label>
                                    <input name="listing_bedrooms" type="number" placeholder="Bedrooms..." className="form-input"/>
                                    {errors.listing_bedrooms && ( <span className="text-red-500 text-sm"> {errors.listing_bedrooms} </span> )}
                                </div> 
                                <div className="form-group">
                                    <label htmlFor="listing_bathrooms"># of Bathrooms:</label>
                                    <input name="listing_bathrooms" type="number" placeholder="Bathrooms.." className="form-input"/>
                                    {errors.listing_bathrooms && ( <span className="text-red-500 text-sm"> {errors.listing_bathrooms} </span> )}
                                </div> 
                                <div className="form-group">
                                    <label htmlFor="listing_parking_space"># of Parking</label>
                                    <input name="listing_parking_space" type="number" placeholder="Parking" className="form-input"/>
                                    {errors.listing_parking_space && ( <span className="text-red-500 text-sm"> {errors.listing_parking_space} </span> )}
                                </div> 
                                 <div className="form-group">
                                    <label htmlFor="listing_furnished_type">Furnished Type</label>
                                    <select id="listing_furnished_type" className="form-input">
                                        <option value="">Select Furnished Type</option>
                                        <option value="1">Furnished</option>
                                        <option value="2">Sami-Furnished</option>
                                        <option value="3">unFurnished</option>
                                    </select>
                                    {errors.listing_furnished_type && <span className="text-red-500 text-sm"> {errors.listing_furnished_type} </span>}
                                </div>  
                                <div className="form-group">
                                    <label htmlFor="listing_parking_space"># of Parking</label>
                                    <input name="listing_parking_space" type="number" placeholder="Parking" className="form-input"/>
                                    {errors.listing_parking_space && ( <span className="text-red-500 text-sm"> {errors.listing_parking_space} </span> )}
                                </div>
                                {/* <div className="form-group">
                                    <label htmlFor="client_user_status">Occupancy</label>
                                    <Select name="client_user_status" placeholder="Select an option" options={occupancy.occupancyoption} isDisabled={occupancy.disabled} 
                                     onChange={selectOption} />
                                </div> */}
                                <div className="form-group">
                                <label htmlFor="occupancy_status">Occupancy</label>
                                <Select
                                    name="occupancy_status"
                                    placeholder="Select occupancy"
                                    options={occupancy.occupancyoption}
                                    isDisabled={occupancy.disabled}
                                    onChange={(option) => setSelectedOccOption(option)}
                                    value={selectedOccOption}
                                />
                                {errors.occupancy_status && (
                                    <span className="text-red-500 text-sm">{errors.occupancy_status}</span>
                                )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="listing_permit">Property Permit</label>
                                    <select id="listing_permit" className="form-input">
                                        <option value="">Property Permit</option>
                                        <option value="1">RERA</option>
                                        <option value="2">DTCM</option>
                                    </select>
                                    {errors.listing_permit && <span className="text-red-500 text-sm"> {errors.listing_permit} </span>}
                                </div>
                                   <div className="form-group">
                                    <label htmlFor="listing_permit_number">Permit Number</label>
                                    <input name="listing_permit_number" type="number" placeholder="Permit Number" className="form-input"/>
                                    {errors.listing_permit_number && ( <span className="text-red-500 text-sm"> {errors.listing_permit_number} </span> )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default createListing;
