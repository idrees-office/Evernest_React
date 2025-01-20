import React from 'react';
import IconAirplay from '../components/Icon/IconAirplay';
import IconUser from '../components/Icon/IconUser';
import IconListCheck from '../components/Icon/IconListCheck';
import IconThumbUp from '../components/Icon/IconThumbUp';
import IconStar from '../components/Icon/IconStar';
import IconFile from '../components/Icon/IconFile';
import IconSend from '../components/Icon/IconSend';
import IconCaretDown from '../components/Icon/IconCaretDown';
import IconInfoHexagon from '../components/Icon/IconInfoHexagon';
import IconBookmark from '../components/Icon/IconBookmark';
import IconTrash from '../components/Icon/IconTrash';


export const options = [
    { value: 1, label: 'Active' },
    { value: 2, label: 'Inactive' },
];

export const STATUSES = [
    {
        value: 1,
        label: 'New Lead',
        displayIn: ['', '', '', 'commentsarray'],
        icon    : <IconAirplay className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-dark',
        bgColor : 'bg-success',
        notes   : ' From Interested Lead',
        notes2  : 'New Lead Created and Marked <span class="text-success">Interested </span>',
        tab     : 'newtab',
        activeColor: "bg-dark text-white",

    },
    {
        value: 2,
        label: 'Assigned Lead',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconListCheck className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-dark',
        bgColor : 'bg-dark',
        notes: ' From Assigned',
        notes2  : '<span class="text-dark">Assigned </span> Lead to',
        tab   : 'assignedtab',
        activeColor: "bg-dark text-white",
    },
    {
        value: 3,
        label: 'Connected Lead',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconStar className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-secondary',
        bgColor : 'bg-secondary',
        notes   : ' From Connected',
        notes2  : ' Moved to: <span class="text-secondary">Connected </span>',
        tab   : 'connectedtab',
        activeColor: "btn-secondary text-white",
    },
    {
        value: 4,
        label: 'Cold Lead',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconThumbUp className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-success',
        bgColor : 'bg-success',
        notes  : ' From Cold',
        notes2 : ' Moved to: <span class="text-success">Cold </span>',
        tab   : 'coldtab',
        activeColor: "bg-success text-white",
    },
    {
        value: 5,
        label: 'Warm Lead',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-warning',
        bgColor : 'bg-warning',
        notes : ' From Warm',
        notes2 : ' Moved to: <span class="text-warning">Warm Lead</span>',
        tab   : 'warmtab',
        activeColor: "btn-warning text-white",
    },
    {
        value: 6,
        label: 'Hot Lead',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconSend className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-info',
        bgColor : 'bg-info',
        notes : ' From Hot',
        notes2 : ' Moved to: <span class="text-info">Hot </span> Leads',
        tab   : 'hottab',
        activeColor: "btn-info text-white",
    },
    {
        value: 7,
        label: 'Meeting Schedule',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-primary',
        bgColor : 'bg-primary',
        notes   : ' From Meeting Schedule',
        notes2  : ' Moved to: <span class="text-primary">Meeting Schedule </span>',
        tab   : 'meetingtab',
        activeColor: "bg-primary text-white",
    },
    {
        value: 8,
        label: 'Meeting Complete',
        displayIn: ['dropdown', 'dashboard', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'btn-outline-secondary',
        bgColor : 'bg-secondary',
        notes   : ' From Meeting Complete',
        notes2  : ' Moved to: <span class="text-secondary">Meeting Complete </span>',
        activeColor: "bg-secondary text-white",
    },
    {
        value: 9,
        label: 'No-Answer',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist', 'commentsarray'],
        icon: <IconInfoHexagon className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'bg-white text-secondary',
        bgColor : 'bg-secondary',
        notes   : ' From No Answer',
        notes2  : ' Moved to: <span class="text-primary">No Answer </span>',
        tab   : 'noanswertab',
        activeColor: "bg-white-dark/10 text-secondary",

    },
    {
        value: 10,
        label: 'Low-Budget',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist', 'commentsarray'],
        icon: <IconBookmark className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'bg-white text-secondary',
        bgColor : 'bg-secondary',
        notes   : ' From Low Buget',
        notes2  : ' Moved to: <span class="text-primary">Low-Budget</span>',
        tab   : 'lowbudgettab',
        activeColor: "bg-white-dark/10 text-secondary",

    },
    {
        value: 11,
        label: 'Not-Responding',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist', 'commentsarray'],
        icon: <IconInfoHexagon className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'bg-white text-secondary',
        bgColor : 'bg-secondary',
        notes   : ' From Not Responding AnyMore',
        notes2  : ' Moved to: <span class="text-primary">Not Responding </span> AnyMore',
        tab     : 'notrespondingtab',
        activeColor: "bg-white-dark/10 text-secondary",
    },
    {
        value: 12,
        label: 'Incorrect Detail',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist', 'commentsarray'],
        icon: <IconTrash className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'bg-white text-secondary',
        bgColor : 'bg-secondary',
        notes   : ' From Incorrect Detail',
        notes2  : ' Moved to: <span class="text-primary">Incorrect Detail </span>',
        tab     : 'incorrecttab',
        activeColor: "bg-white-dark/10 text-secondary",

    },
    {
        value: 13,
        label: 'Agent',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist', 'commentsarray'],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'bg-white text-secondary',
        bgColor : 'bg-primary',
        notes   : ' From Agent',
        notes2  : ' Moved to: <span class="text-primary">Agent </span>',
        tab     : 'agenttab',
        activeColor: "bg-white-dark/10 text-secondary",
    },
    {
        value: 14,
        label: 'Junk',
        displayIn: ['sidebar', 'dropdown', 'matchcolorlist'],
        icon: <IconTrash className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'bg-white text-secondary',
        bgColor : 'bg-primary',
        notes   : ' From Junk',
        notes2  : ' Moved to: <span class="text-primary">Junk </span>',
        tab     : 'junktab',
        activeColor: "bg-white-dark/10 text-secondary",
    },
    {
        value: 15,
        label: 'System Automatically Moved',
        displayIn: ['', '', ''],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'bg-white text-secondary',
        bgColor : 'bg-primary',
        notes   : ' From Junk',
        notes2  : 'System Automatically Move at 8 PM'
    },
    {
        value: 16,
        label: 'Congratulations Close Deal',
        displayIn: ['', '', ''],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'bg-white text-secondary',
        bgColor : 'bg-primary',
        // notes   : ' From Junk',
        // notes2  : 'System Automatically Move at 8 PM'
    },
    {
        value: 17,
        label: 'New Lead Created By',
        displayIn: ['', '', ''],
        icon: <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />,
        outlineColor: 'bg-white text-secondary',
        bgColor : 'bg-primary',
        // notes   : ' From Junk',
        // notes2  : 'System Automatically Move at 8 PM'
    },
];

export const topBarStatus   = ()   => STATUSES.filter((status) => status.displayIn?.includes('dashboard'));
export const SidebarStatus  = ()   => STATUSES.filter((status) => status.displayIn?.includes('sidebar'));
export const MatchColorList = ()   => STATUSES.filter((status) => status.displayIn?.includes('matchcolorlist'));
export const DropdownOption = ()   => STATUSES.filter((status) => status.displayIn?.includes('dropdown'));




