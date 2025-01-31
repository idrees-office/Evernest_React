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
                    {(permissions.includes('view dashboard') ) && (
                        <li>
                            <NavLink to="/">{t('Lead-Dashboard')}</NavLink>
                        </li>
                    )}
                    {(permissions.includes('assign leads')) && (
                        <>
                            <NavLink to="/pages/leads/assign">{t('New-Leads')}</NavLink>
                            <NavLink to="/pages/leads/reassign">{t('Re-Assign')}</NavLink>
                        </>
                    )}
                    {(permissions.includes('won leads')) && (
                        <li>
                            <NavLink to="/pages/leads/won">{t('Won-Leads')}</NavLink>
                        </li>
                    )}
                    {(permissions.includes('all leads')) && (
                        <li>
                           <NavLink to="/pages/leads/exportpdf">{t('Export Pdf')}</NavLink>
                        </li>
                    )}
                    {(permissions.includes('roadshow leads')) && (
                        <li>
                            <NavLink to="/pages/leads/roadshow">{t('Road-Show Leads')}</NavLink>
                        </li>
                    )}
                    {/* {permissions.includes('view dashboard') ? (
                        <li>
                            <NavLink to="/">{t('Lead-Dashboard')}</NavLink>
                        </li>
                    ) : permissions.includes('assign leads') ? (
                        <>
                            <li><NavLink to="/pages/leads/assign">{t('New-Leads')}</NavLink></li>
                            <li><NavLink to="/pages/leads/reassign">{t('Re-Assign')}</NavLink></li>
                        </>
                    ) : permissions.includes('won leads') ? (
                        <li>
                            <NavLink to="/pages/leads/won">{t('Won-Leads')}</NavLink>
                        </li>
                    ) : permissions.includes('all leads') ? (
                        <li>
                            <NavLink to="/pages/leads/exportpdf">{t('Export Pdf')}</NavLink>
                        </li>
                    ) : permissions.includes('roadshow leads') ? (
                        <li>
                            <NavLink to="/pages/leads/roadshow">{t('Road-Show Leads')}</NavLink>
                        </li>
                    ) : null} */}
                </ul>
            </li>
            {permissions.includes('create userprofile') && (
                <li className="menu nav-item relative">
                    <button type="button" className="nav-link">
                        <div className="flex items-center">
                            <IconMenuApps className="shrink-0" />
                            <span className="px-1">{t('Account Setting')}</span>
                        </div>
                        <div className="right_arrow">
                            <IconCaretDown />
                        </div>
                    </button>
                    <ul className="sub-menu">
                        <li>
                            <NavLink to="/pages/users/profile">{t('Profile')}</NavLink>
                        </li>
                    </ul>
                </li>
            )}
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
                    {(permissions.includes('create user')) && (
                        <li>
                            <NavLink to="/pages/users/create">{t('Add-User')}</NavLink>
                        </li>
                    )}
                    {(permissions.includes('create role')) && (
                        <li>
                            <NavLink to="/pages/roles/create">{t('Add-Role')}</NavLink>
                        </li>
                    )}
                    {(permissions.includes('view permission')) && (
                        <li>
                            <NavLink to="/pages/permissions/assign">{t('Assign-Permission')}</NavLink>
                        </li>
                    )}
                </ul>
            </li>
        </>
    );
};

export default NavBar;
