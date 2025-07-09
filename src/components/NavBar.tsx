import { useState, useEffect } from 'react';
import IconCaretDown from './Icon/IconCaretDown';
import IconMenuDashboard from './Icon/Menu/IconMenuDashboard';
import { NavLink } from 'react-router-dom';
import IconMenuApps from './Icon/Menu/IconMenuApps';
import IconMenuComponents from './Icon/Menu/IconMenuComponents';
import IconMenuElements from './Icon/Menu/IconMenuElements';
import IconMenuForms from './Icon/Menu/IconMenuForms';
import { useTranslation } from 'react-i18next';
import IconMenuDatatables from './Icon/Menu/IconMenuDatatables';
import IconMenuPages from './Icon/Menu/IconMenuPages';
import IconMenuMore from './Icon/Menu/IconMenuMore';
import { useSelector } from 'react-redux';
const NavBar = () => {
    const { t } = useTranslation();
    const [permissions, setPermissions] = useState<any>([]);
    const [role, setRoles] = useState<string>();

    useEffect(() => {
        const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const userrole = localStorage.getItem('role') || '';
        setPermissions(storedPermissions);
        setRoles(userrole);
    }, []);
    
    return (
        <>
            <li className="menu nav-item relative">
                {(permissions.includes('view dashboard') || role === 'super admin') && (
                    <button type="button" className="nav-link">
                        <div className="flex items-center">
                            <IconMenuDashboard className="shrink-0" />
                            <span className="px-1">{t('Leads Management')}</span>
                        </div>
                        <div className="right_arrow"> {' '} <IconCaretDown />{' '} </div>
                    </button>
                )}
                <ul className="sub-menu">
                    {/* {(permissions.includes('view dashboard') || role === 'super admin'  || role === 'agent') && (
                        <li>
                            <NavLink to="/pages/leads/dashboard">{t('Lead-Dashboard')}</NavLink>
                        </li>
                    )} */}
                    {(role === 'super admin') && (
                        <li>
                            <NavLink to="/dashboard/hr">{t('HR Dashboard')}</NavLink>
                        </li>
                    )}
                    {(permissions.includes('assign leads') || role === 'super admin') && (
                        <>
                            <NavLink to="/pages/leads/assign">{t('New-Leads')}</NavLink>
                            <NavLink to="/pages/leads/reassign">{t('Re-Assign')}</NavLink>
                        </>
                    )}
                    {(permissions.includes('won leads') || role === 'super admin') && (
                        <li>
                            <NavLink to="/pages/leads/won">{t('Won-Leads')}</NavLink>
                        </li>
                    )}
                    {(permissions.includes('view pdf') || role === 'super admin') && (
                        <li>
                           <NavLink to="/pages/leads/exportpdf">{t('Export Pdf')}</NavLink>
                        </li>
                    )}
                    {(permissions.includes('roadshow leads') || role === 'super admin') && (
                        <li>
                            <NavLink to="/pages/leads/roadshow">{t('Road-Show Leads')}</NavLink>
                        </li>
                    )}

                    {(permissions.includes('roadshow leads') || role === 'super admin') && (
                        <li>
                            <NavLink to="/pages/leads/reports">{t('Agent Reports')}</NavLink>
                        </li>
                    )}
                </ul>
            </li>
            <li className="menu nav-item relative">
                {(permissions.includes('create user') || role === 'super admin') && (
                    <button type="button" className="nav-link">
                        <div className="flex items-center">
                            <IconMenuElements className="shrink-0" />
                            <span className="px-1">{t('Manage Team')}</span>
                        </div>
                        <div className="right_arrow">
                            <IconCaretDown />
                        </div>
                    </button>
                )}
                <ul className="sub-menu">
                    {(permissions.includes('create user') || role === 'super admin') && (
                        <li>
                            <NavLink to="/pages/users/create">{t('Add-User')}</NavLink>
                        </li>
                    )}
                    {(permissions.includes('create role') || role === 'super admin') && (
                        <li>
                            <NavLink to="/pages/roles/create">{t('Add-Role')}</NavLink>
                        </li>
                    )}
                    {(permissions.includes('view permission') || role === 'super admin') && (
                        <li>
                            <NavLink to="/pages/permissions/assign">{t('Assign-Permission')}</NavLink>
                        </li>
                    )}
                </ul>
            </li>
            {(permissions.includes('view activities') || role === 'super admin') && (
                <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuDatatables className="shrink-0" />
                                <span className="px-1">{t('Activities')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li> <NavLink to="/pages/activities/activities">{t('Add-Activity')}</NavLink> </li>
                        </ul>
                </li>   
            )}
            {(permissions.includes('create subscriber') || role === 'super admin') && (
            <li className="menu nav-item relative">
                    <button type="button" className="nav-link">
                        <div className="flex items-center">
                            <IconMenuDatatables className="shrink-0" />
                            <span className="px-1">{t('Email Marketing')}</span>
                        </div>
                        <div className="right_arrow">
                            <IconCaretDown />
                        </div>
                    </button>
                    <ul className="sub-menu">
                        <li>
                            <NavLink to="/pages/email/subscriber">{t('Create-Subscriber')}</NavLink>
                            <NavLink to="/pages/email/template">{t('Create-Campaign')}</NavLink>
                            <NavLink to="/pages/email/analyticsDashboard">{t('Tracking Dashboard')}</NavLink>
                            <NavLink to="/pages/email/email-report-list">{t('Report List')}</NavLink>
                        </li>
                    </ul>
            </li>
            )}
            {(permissions.includes('create subscriber') || role === 'super admin') && (
                <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuDashboard className="shrink-0" />
                                <span className="px-1">{t('Listing')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/pages/listing/create-listing">{t('Create Listing')}</NavLink>
                            </li>
                        </ul>
                </li>
            )}

            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                <div className="flex items-center">
                    <IconMenuElements className="shrink-0" />
                    <span className="px-1">{t('Announcements')}</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
                </button>
                <ul className="sub-menu">
                {(permissions.includes('create announcements') || role === 'super admin' || role === 'HR' || role === 'receptionist') && (
                    <li>
                    <NavLink to="/pages/announcements/create">
                        <span>{t('HR-Announcements')}</span>
                    </NavLink>
                    </li>
                )}
                <li>
                    <NavLink to="/pages/announcements/view">
                    <span>{t('New-Announcements')}</span>
                    </NavLink>
                </li>
                </ul>
            </li>
        </>
    );
};

export default NavBar;
