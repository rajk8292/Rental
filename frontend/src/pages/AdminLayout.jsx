import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminLayout = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

    return (
        <div className="flex bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[80vh]">
            <Sidebar />
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
