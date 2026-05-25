import { useState } from 'react';

import {
    FaBars,
    FaTruck,
    FaUsers,
    FaMapMarkedAlt,
    FaChartBar,
    FaTimes,
    FaBox,
    FaSignOutAlt
} from 'react-icons/fa';

import {
    Link,
    Outlet,
    useNavigate,
} from 'react-router-dom';
import NotificationBell from '../components/common/NotificationBell';

const MainLayout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const closeSidebar = () => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100 overflow-hidden">
            {/* Overlay */}
            {
                sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )
            }
            {/* Sidebar */}
            <div
                className={`
                    fixed top-0 left-0 z-[1000]
                    bg-blue-900 text-white flex flex-col
                    w-64 h-screen
                    transform
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                    md:static
                    transition-transform duration-300
                    overflow-y-auto
                `}
            >
                {/* Logo + Close */}
                <div className="p-5 flex items-center justify-between border-b border-blue-700">
                    <h1 className="text-2xl font-bold">
                        FleetNova
                    </h1>
                    {/* Close Button */}
                    <button
                        className="md:hidden text-2xl"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FaTimes />
                    </button>
                </div>
                {/* Menu */}

                <nav className="p-4 space-y-3">

                    <Link
                        to="/dashboard"
                        onClick={closeSidebar}
                        className="flex items-center gap-3 hover:bg-blue-700 p-3 rounded transition"
                    >
                        <FaTruck />
                        Dashboard
                    </Link>

                    <Link
                        to="/vehicles"
                        onClick={closeSidebar}
                        className="flex items-center gap-3 hover:bg-blue-700 p-3 rounded transition"
                    >
                        <FaTruck />
                        Vehicles
                    </Link>

                    <Link
                        to="/drivers"
                        onClick={closeSidebar}
                        className="flex items-center gap-3 hover:bg-blue-700 p-3 rounded transition"
                    >
                        <FaUsers />
                        Drivers
                    </Link>

                    <Link
                        to="/tracking"
                        onClick={closeSidebar}
                        className="flex items-center gap-3 hover:bg-blue-700 p-3 rounded transition"
                    >
                        <FaMapMarkedAlt />
                        Tracking
                    </Link>

                    <Link
                        to="/analytics"
                        onClick={closeSidebar}
                        className="flex items-center gap-3 hover:bg-blue-700 p-3 rounded transition"
                    >
                        <FaChartBar />
                        Analytics
                    </Link>

                    <Link
                        to="/orders"
                        onClick={closeSidebar}
                        className="flex items-center gap-3 hover:bg-blue-700 p-3 rounded transition"
                    >
                        <FaBox />
                        Orders
                    </Link>
                    <div className="p-4 mt-auto">

                        <button
                            onClick={logout}
                            className="
            w-full
            flex
            items-center
            gap-3
            bg-red-500
            hover:bg-red-600
            p-3
            rounded-lg
            transition
            font-semibold
        "
                        >

                            <FaSignOutAlt />

                            Logout

                        </button>

                    </div>
                </nav>

            </div>

            {/* Main Content */}

            <div className="flex-1 flex flex-col min-w-0">

                {/* Navbar */}

                <header
                    className="
        bg-white
        shadow
        p-4
        flex
        items-center
        justify-between
        gap-4
        sticky
        top-0
        z-30
    "
                >

                    <button
                        className="
            md:hidden
            text-2xl
            text-blue-900
        "
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >

                        <FaBars />

                    </button>

                    <h1
                        className="
            text-lg
            md:text-2xl
            font-bold
            text-blue-900
            truncate">
                        FleetNova Dashboard
                    </h1>
                    <NotificationBell />
                </header>
                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;