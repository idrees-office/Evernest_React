import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useRef, useState } from 'react';
import { setPageTitle } from '../../slices/themeConfigSlice';
import Dropdown from '../../components/Dropdown';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconTrendingUp from '../../components/Icon/IconTrendingUp';
import { getBaseUrl } from '../../components/BaseUrl';
import apiClient from '../../utils/apiClient';

const endpoints = {
    reportApi: `${getBaseUrl()}/subscriber/tracking-report`,
};

const AnalyticsDashboard = () => {
    const dispatch = useDispatch();
    const combinedRef = useRef<any>({ fetched: false });

    const [TotalCampaign, setTotalCampaign] = useState(0);
    const [TotalEmails, setTotalEmails] = useState(0);
    const [PendingCampaigns, setPendingCampaigns] = useState(0);
    const [SentCampaigns, setSentCampaigns] = useState(0);
    const [OpenRate, setOpenRate] = useState(0);
    const [HotLeads, setHotLeads] = useState(0);
    const [TotalSubscribers, setTotalSubscribers] = useState(0);

    interface Campaign {
        name: string;
        delivered: number;
        failed: number;
        read: number;
        sent: number;
        total: number;
        status: string;
    }

    const [campaignData, setCampaignData] = useState<Campaign[]>([]);

    useEffect(() => {
        dispatch(setPageTitle('Analytics Admin'));
        if (!combinedRef.current.fetched) {
            EmailTrackingReport();
            combinedRef.current.fetched = true;
        }
    }, [dispatch]);

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const EmailTrackingReport = async () => {
        try {
            const response = await apiClient.get(endpoints.reportApi);
            if (response.data) {
                const data = response.data.reports;
                setCampaignData(data || []);
                setTotalSubscribers(response.data.subscriber);
                setTotalCampaign(response.data.totalCampaigns)
                setTotalEmails(response.data.totalEmails)
            }
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    };

    const getStatusBadge = (status:any) => {
        switch (status) {
            case 1:
                return <span className="badge rounded-full bg-success/20 text-success">Completed</span>;
            case 2:
                return <span className="badge rounded-full bg-info/20 text-info">Scheduled</span>;
            default:
                return <span className="badge rounded-full bg-danger/20 text-danger">Pending</span>;
        }
    };

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
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="panel h-full sm:col-span-2 lg:col-span-1">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Campaign Summary</h5>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#515365] font-bold">
                            <div>
                                <div>Total Emails</div>
                                <div className="text-[#f8538d] text-md">{TotalEmails}</div>
                            </div>
                            <div>
                                <div>Total Campaigns</div>
                                <div className="text-[#f8538d] text-md">{TotalCampaign}</div>
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
                                <div className="text-[#f8538d] text-sm">{PendingCampaigns}</div>
                            </div>
                            <div>
                                <div>Sent Campaigns</div>
                                <div className="text-[#f8538d] text-sm">{SentCampaigns}</div>
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
                                <div className="text-[#f8538d] text-sm">{OpenRate}%</div>
                            </div>
                            <div>
                                <div>Hot Leads</div>
                                <div className="text-[#f8538d] text-sm">{HotLeads}</div>
                            </div>
                        </div>
                    </div>
                    {/* Subscribers */}
                    <div className="panel h-full">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Current | Total Subscribers</h5>
                        </div>
                        <div className=" text-[#e95f2b] text-3xl font-bold my-10">
                            <span>{TotalSubscribers}</span>
                            <IconTrendingUp className="text-success inline ml-2" />
                        </div>
                    </div>

                </div>
            </div>
            <div className="pt-5">
                <div className="panel h-full w-full">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Campaign Statistics</h5>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th className="ltr:rounded-l-md rtl:rounded-r-md">Campaign Name</th>
                                     <th>Total</th>
                                     <th>Sent</th>
                                     <th>Read</th>
                                   
                                    <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaignData.map((campaign, index) => (
                                    <tr key={index} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="min-w-[150px] text-black dark:text-white">
                                            <div className="flex items-center">
                                                <span className="whitespace-nowrap">{campaign.name}</span>
                                            </div>
                                        </td>
                                         <td>{campaign.total}</td>
                                        <td>{campaign.sent}</td>
                                        <td>{campaign.read}</td>
                                        <td>
                                            {getStatusBadge(campaign.status)}
                                        </td>
                                    </tr>
                                ))}
                                {campaignData.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-4">No campaign data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AnalyticsDashboard;



