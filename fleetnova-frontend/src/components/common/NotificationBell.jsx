import {

    useEffect,
    useState,

} from 'react';

import {

    FaBell,

} from 'react-icons/fa';

import API from '../../services/api';

const getNotificationIcon = (type) => {

    switch (type) {

        case 'ORDER_CREATED':
            return '📦';

        case 'DRIVER_CREATED':
            return '👨‍✈️';

        case 'VEHICLE_CREATED':
            return '🚚';

        case 'GPS_ACTIVE':
            return '📍';

        case 'DELIVERY_COMPLETED':
            return '✅';

        default:
            return '🔔';

    }

};

const NotificationBell = () => {

    const [notifications, setNotifications] =
        useState([]);

    const [open, setOpen] =
        useState(false);

    const fetchNotifications = async () => {

        try {

            const { data } =
                await API.get('/notifications');

            setNotifications(
                data.notifications
            );

        } catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        fetchNotifications();

        const interval = setInterval(() => {

            fetchNotifications();

        }, 5000);

        return () => clearInterval(interval);

    }, []);

    const unreadCount =
        notifications.filter(
            (n) => !n.isRead
        ).length;

    return (

        <div className="relative">

            <button
                onClick={() => setOpen(!open)}
                className="relative text-2xl"
            >

                <FaBell />

                {
                    unreadCount > 0 && (

                        <span
                            className="
                                absolute
                                -top-2
                                -right-2
                                bg-red-500
                                text-white
                                text-xs
                                w-5
                                h-5
                                rounded-full
                                flex
                                items-center
                                justify-center
                            "
                        >

                            {unreadCount}

                        </span>

                    )
                }

            </button>

            {
                open && (

                    <div
                        className="
                            absolute
                            right-0
                            mt-3
                            w-80
                            bg-white
                            shadow-xl
                            rounded-xl
                            z-50
                            max-h-[400px]
                            overflow-y-auto
                        "
                    >

                        <div className="p-4 border-b font-bold">

                            Notifications

                        </div>

                        {
                            notifications.length === 0 ? (

                                <div className="p-4">

                                    No notifications

                                </div>

                            ) : (

                                notifications.map(
                                    (notification) => (

                                        <div
                                            key={notification.id}
                                            className={`
                                                p-4 border-b hover:bg-gray-50
                                                ${!notification.isRead
                                                    ? 'bg-blue-50'
                                                    : ''}
                                            `}
                                        >

                                            <h3 className="font-bold">

                                                {getNotificationIcon(notification.type)} {notification.title}

                                            </h3>

                                            <p className="text-sm text-gray-600">

                                                {notification.message}

                                            </p>

                                        </div>

                                    )
                                )

                            )
                        }

                    </div>

                )
            }

        </div>

    );

};

export default NotificationBell;