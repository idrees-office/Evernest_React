import React from 'react';
import IconAirplay from '../components/Icon/IconAirplay';
import IconUser from '../components/Icon/IconUser';

export const options = [
    { value: 1, label: 'Active' },
    { value: 2, label: 'Inactive' },
];
// bgColor: 'bg-primary',
export const STATUSES = [
    {
        value: 1,
        label: 'New Lead',
        displayIn: ['', '', 'dashboard', 'commentsarray'],
        icon: <IconAirplay className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-dark',
        bgColor : 'bg-success',
        notes   : 'From Interested Lead',
        notes2  : 'New Lead Created and Marked <span class="text-success">Interested </span>',
    },

    {
        value: 2,
        label: 'Assigned Lead',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconAirplay className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-dark',
        bgColor : 'bg-dark',
        notes: 'From Assigned',
        notes2  : '<span class="text-dark">Assigned </span> Lead to',
    },
    {
        value: 3,
        label: 'Connected Lead',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-secondary',
        bgColor : 'bg-secondary',
        notes   : 'From Connected',
        notes2  : 'Moved to: <span class="text-secondary">Connected </span>',

    },
    {
        value: 4,
        label: 'Cold Lead',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-success',
        bgColor : 'bg-success',
        notes  : 'From Cold',
        notes2 : 'Moved to: <span class="text-success">Cold </span>'
    },
    {
        value: 5,
        label: 'Warm Lead',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-warning',
        bgColor : 'bg-warning',
        notes : 'From Warm',
        notes2 : 'Moved to: <span class="text-warning">Warm Lead</span>'
    },
    {
        value: 6,
        label: 'Hot Lead',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-info',
        bgColor : 'bg-info',
        notes : 'From Hot',
        notes2 : 'Moved to: <span class="text-info">Hot </span> Leads'
    },
    {
        value: 7,
        label: 'Meeting Schedule',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-primary',
        bgColor : 'bg-primary',
        notes   : 'From Meeting Schedule',
        notes2  : 'Moved to: <span class="text-primary">Meeting Schedule </span>'
    },
    {
        value: 8,
        label: 'Meeting Complete',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-secondary',
        bgColor : 'bg-secondary',
        notes   : 'From Meeting Complete',
        notes2  : 'Moved to: <span class="text-secondary">Meeting Complete </span>'
    },
    {
        value: 9,
        label: 'No-Answer',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-secondary',
        bgColor : 'bg-secondary',
        notes   : 'From No Answer',
        notes2  : 'Moved to: <span class="text-primary">No Answer </span>'
    },
    {
        value: 10,
        label: 'Low-Budget',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-secondary',
        bgColor : 'bg-secondary',
        notes   : 'From Low Buget',
        notes2  : 'Moved to: <span class="text-primary">Low-Budget</span>',
    },
    {
        value: 11,
        label: 'Not-Responding',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-secondary',
        bgColor : 'bg-secondary',
        notes   : 'From Not Responding AnyMore',
        notes2  : 'Moved to: <span class="text-primary">Not Responding </span> AnyMore'
    },
    {
        value: 12,
        label: 'Incorrect Detail',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-secondary',
        bgColor : 'bg-secondary',
        notes   : 'From Incorrect Detail',
        notes2  : 'Moved to: <span class="text-primary">Incorrect Detail </span>'
    },
    {
        value: 13,
        label: 'Agent',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-secondary',
        bgColor : 'bg-primary',
        notes   : 'From Agent',
        notes2  : 'Moved to: <span class="text-primary">Agent </span>'
    },
    {
        value: 14,
        label: 'Junk',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-secondary',
        bgColor : 'bg-primary',
        notes   : 'From Junk',
        notes2  : 'Moved to: <span class="text-primary">Junk </span>'
    },
    {
        value: 15,
        label: 'System Automatically Moved',
        displayIn: ['', 'dropdown', ''],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-secondary',
        bgColor : 'bg-primary',
        notes   : 'From Junk',
        notes2  : 'System Automatically Move at 8 PM'
    },

];

export const topBarStatus = () => STATUSES.filter((status) => status.displayIn?.includes('dashboard'));
export const SidebarStatus = ()   => STATUSES.filter((status) => status.displayIn?.includes('sidebar'));
export const MatchColorList = ()   => STATUSES.filter((status) => status.displayIn?.includes('matchcolorlist'));
export const DropdownOption = ()   => STATUSES.filter((status) => status.displayIn?.includes('dropdown'));




