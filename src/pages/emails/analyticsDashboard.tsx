import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Table from '../../components/Table';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';
import { Link } from 'react-router-dom';
import IconTrendingUp from '../../components/Icon/IconTrendingUp';
import { setPageTitle } from '../../slices/themeConfigSlice';
import { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';

const endpoints = {
    reportApi: `${getBaseUrl()}/subscriber/tracking-report`,
};

const CampaignStatistics = () => {
    const dispatch = useDispatch<AppDispatch>();
    const combinedRef = useRef<any>({ fetched: false });
    const [campaignData, setCampaignData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({
        subscriber: 0,
        totalCampaigns: 0,
        totalEmails: 0,
        totalSendCampaigns : 0,
        PendingCampaign : 0
    });

    useEffect(() => {
        // if(!combinedRef.current.fetched){
          dispatch(setPageTitle('Create User'));
             fetchData();
             combinedRef.current.fetched = true;
        // }
    }, [ dispatch , page, pageSize, sortStatus]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(endpoints.reportApi, {
                params: {
                    page: page,
                    per_page: pageSize,
                    sort_field: sortStatus.columnAccessor,
                    sort_direction: sortStatus.direction
                }
            });
            
            setCampaignData(response.data.reports);
            setStats({subscriber: response.data.subscriber, totalCampaigns: response.data.totalCampaigns, totalEmails: response.data.totalEmails, totalSendCampaigns : response.data.totalSendCampaigns, PendingCampaign : response.data.PendingCampaign });
            setTotalRecords(response.data.totalCampaigns);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            accessor: 'id',
            title: 'Total',
            sortable: true,
            key : 'id',
        },
        {
            accessor: 'name',
            title: 'Campaign Name',
            sortable: true,
            key : 'name',
            render: (record: any) => (
                <div className="text-black dark:text-white">
                    <span className="whitespace-nowrap">{record.name}</span>
                </div>
            )
        },
        {
            accessor: 'total',
            title: 'Total',
            sortable: true,
            key : 'total',
        },
        {
            accessor: 'sent',
            title: 'Sent',
            sortable: true,
            key : 'send',

        },
        {
            accessor: 'read',
            title: 'Read',
            sortable: true,
            key : 'read',
        },
        {
            accessor: 'status',
            title: 'Status',
            key : 'status',
            render: (record: any) => (<span className="badge bg-success">{record.status}</span> )
        },
        {
            accessor: 'created_at',
            title: 'Created At | Send-Time',
              key : 'created_at',
            render: (record: any) => (
                record.created_at 
                    ? record.created_at 
                    : <span className="badge bg-dark">Already Scheduled</span>
            )
        },
        {
            accessor: 'scheduled_at',
            title: 'Scheduled At',
            key : 'scheduled_at',
            render: (record: any) => (
                record.scheduled_at 
                    ? record.scheduled_at 
                    : <span className="badge bg-dark">Already sent</span>
            )
        }
    ];

    return (

        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline"> Dashboard </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Analytics</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
                    <div className="panel h-full sm:col-span-2 lg:col-span-1">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Campaign Summary</h5>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#515365] font-bold">
                            <div>
                                <div>Total Emails</div>
                                <div className="text-[#f8538d] text-md">{stats.totalEmails}</div>
                            </div>
                            <div>
                                <div>Total Campaigns</div>
                                <div className="text-[#f8538d] text-md">{stats.totalCampaigns}</div>
                            </div>
                        </div>
                    </div>
                    <div className="panel h-full sm:col-span-2 lg:col-span-1">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Campaign Performance</h5>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#515365] font-bold">
                            <div>
                                <div>Pending Campaigns</div>
                                <div className="text-[#f8538d] text-sm">{stats.PendingCampaign}</div>
                            </div>
                            <div>
                                <div>Send Campaigns</div>
                                <div className="text-[#f8538d] text-sm">{stats.totalSendCampaigns}</div>
                            </div>
                        </div>
                    </div>
                    {/* Email Performance */}
                    <div className="panel h-full sm:col-span-2 lg:col-span-1">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Email Performance</h5>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#515365] font-bold">
                            <div>
                                <div>Open Rate</div>
                                <div className="text-[#f8538d] text-sm">{0}%</div>
                            </div>
                            <div>
                                <div>Hot Leads</div>
                                <div className="text-[#f8538d] text-sm">{0}</div>
                            </div>
                        </div>
                    </div>
                    {/* Subscribers */}
                    <div className="panel h-full">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Current | Total Subscribers</h5>
                        </div>
                        <div className=" text-[#e95f2b] text-3xl font-bold my-10">
                            <span>{stats.subscriber}</span>
                            <IconTrendingUp className="text-success inline ml-2" />
                        </div>
                    </div>

                </div>
            </div>
             <div className="pt-2">
            <div className="h-full w-full">
                <Table 
                    columns={columns}
                    rows={campaignData}
                    title=""
                    totalRecords={totalRecords}
                    currentPage={page}
                    recordsPerPage={pageSize}
                    onPageChange={setPage}
                    onRecordsPerPageChange={setPageSize}
                    onSortChange={setSortStatus}
                    sortStatus={sortStatus}
                    isLoading={isLoading}
                    noRecordsText="No campaign data available"
                    idAccessor="id"
                />
            </div>
        </div>
        </div>
       
    );
};

export default CampaignStatistics;
