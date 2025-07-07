import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { IRootState, AppDispatch } from '../store';
import { topBarStatus, SidebarStatus, MatchColorList, HRDropdownOption, statues, JobDashboard, uniqueDropdown, HrSidebarStatus } from '../services/status';
import Toast from '../services/toast';
import Loader2 from '../services/loader2';

export const useDashboardStates = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { dashboardType } = useParams();

    // Static config data
    const TopbarStatuses     = topBarStatus();
    const JobDashboardList   = JobDashboard();
    const uniqueDropdownList = uniqueDropdown();
    const hrSidebarStatus    = HrSidebarStatus();
    const Statues            = statues();
    const loader2            = Loader2();
    const SidebarStatuses    = SidebarStatus();
    const colorsarray        = MatchColorList();
    const hrdropdownOption   = HRDropdownOption();
    const toast              = Toast();
    
    const loginuser       = useSelector((state: IRootState) => state.auth.user || {});
    const leads           = useSelector((state: IRootState) => state.dashboardslice.leads);
    const currentStatus   = useSelector((state: IRootState) => state.dashboardslice.lead_status);
    const { loading, meta, counters } = useSelector((state: any) => state.dashboardslice);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const combinedRef = useRef<any>({ fetched: false, form: null, topbarButtonRefs: {}, addleadform: null, ishideshow: false });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [AllLeadList, setAllLeadList]       = useState<any[]>([]);
    const [selectedLead, setSelectedLead]     = useState<any>(null);
    const [selectedTab, setSelectedTab]       = useState<any>();
    const [isShowMailMenu, setIsShowMailMenu] = useState(false);
    const [isEdit, setIsEdit]                 = useState(false);
    const [searchText, setSearchText]         = useState<any>('');
    const [isModalOpen, setIsModalOpen]       = useState(false);
    const [errors, setErrors]                 = useState<Record<string, string[]>>({});
    const [date, setDate]                     = useState<any>(null);
    const [IsDisable, setIsDisable]           = useState(true);
    const [IsColor, setsColor]                = useState('hsl(0, 0%, 95%)');
    const [IsRemarkData, SetIsRemarkData]     = useState<Array<{ name: string; values: string[] }>>([]);
    const [isMemark, setIsMemark]             = useState(false);
    const [isOpen, setIsOpen]                 = useState(false);
    const [files, setFiles]                   = useState([]);
    const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
    const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

    return {
        dispatch,
        navigate,
        dashboardType,
        TopbarStatuses,
        JobDashboardList,
        uniqueDropdownList,
        hrSidebarStatus,
        Statues,
        loader2,
        SidebarStatuses,
        colorsarray,
        hrdropdownOption,
        toast,
        loginuser,
        leads,
        currentStatus,
        loading,
        meta,
        counters,
        isRtl,
        combinedRef,
        fileInputRef,
        AllLeadList, setAllLeadList,
        selectedLead, setSelectedLead,
        selectedTab, setSelectedTab,
        isShowMailMenu, setIsShowMailMenu,
        isEdit, setIsEdit,
        searchText, setSearchText,
        isModalOpen, setIsModalOpen,
        errors, setErrors,
        date, setDate,
        IsDisable, setIsDisable,
        IsColor, setsColor,
        IsRemarkData, SetIsRemarkData,
        isMemark, setIsMemark,
        isOpen, setIsOpen,
        files, setFiles,
        isFileViewerOpen, setIsFileViewerOpen,
        isCustomizerOpen, setIsCustomizerOpen,
    };
};
