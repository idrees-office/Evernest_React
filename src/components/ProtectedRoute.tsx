import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { IRootState } from '../store';

interface ProtectedRouteProps {
    children: React.ReactNode;  // Make 'children' required
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }): JSX.Element | null => {
    const isAuthenticated = useSelector((state: IRootState) => state.auth.isAuthenticated);
    // Only return valid JSX or null
    return isAuthenticated ? (children as JSX.Element) : <Navigate to="/auth/cover-login" />;
};

export default ProtectedRoute;
