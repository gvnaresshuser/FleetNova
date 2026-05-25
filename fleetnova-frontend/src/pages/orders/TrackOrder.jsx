import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import {

    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
} from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../../services/api';
import Loader from '../../components/common/Loader';
import PageTransition from '../../components/common/PageTransition';
import { io } from 'socket.io-client';

//const socket = io('http://localhost:5000');
const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    'http://localhost:5000';

const socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
});
const vehicleIcon = new L.Icon({
    iconUrl:
        'https://cdn-icons-png.flaticon.com/512/744/744465.png',

    iconSize: [40, 40],
});

const TrackOrder = ({ startLoading }) => {
    const [locationAddress, setLocationAddress] = useState('');
    const [pathCoordinates, setPathCoordinates] = useState([]);
    const [liveLocation, setLiveLocation] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const currentPosition = [
        liveLocation?.latitude ??
        order?.vehicle?.latitude ??
        17.6868,
        liveLocation?.longitude ??
        order?.vehicle?.longitude ??
        83.2185,
    ];
    const fetchAddress = async (
        lat,
        lng
    ) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data =
                await response.json();
            setLocationAddress(
                data.display_name
            );
            console.log('data.display_name :: ' + data.display_name);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOrder = async () => {
        try {
            const { data } = await API.get(
                `/order-tracking/${id}`
            );
            console.log(data);
            setOrder(data.order);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        startLoading();
        fetchOrder();
    }, []);


    /*  useEffect(() => {
         //socket.on('receive-location', (data) => {
         socket.on('receive-vehicles', (vehicles) => {
             if (
                 data?.latitude &&
                 data?.longitude
             ) {
                 setLiveLocation(data);
                 fetchAddress(
                     data.latitude,
                     data.longitude
                 );
                 setPathCoordinates((prev) => [
                     ...prev,
                     [
                         data.latitude,
                         data.longitude
                     ]
                 ]);
             }
         });
         return () => {
             socket.off('receive-location');
         };
     }, []); */
    useEffect(() => {
        socket.on(
            'receive-vehicles',
            (vehicles) => {
                console.log(
                    'Vehicles ::',
                    vehicles
                );
                const currentVehicle =
                    vehicles.find(
                        (vehicle) =>
                            vehicle.vehicleId ===
                            order?.vehicleId
                    );
                console.log(
                    'Current Vehicle ::',
                    currentVehicle
                );
                if (
                    currentVehicle?.latitude &&
                    currentVehicle?.longitude
                ) {
                    setLiveLocation(
                        currentVehicle
                    );
                    fetchAddress(
                        currentVehicle.latitude,
                        currentVehicle.longitude
                    );
                    setPathCoordinates(
                        (prev) => [
                            ...prev,
                            [
                                currentVehicle.latitude,
                                currentVehicle.longitude
                            ]
                        ]
                    );
                }
            }
        );
        return () => {
            socket.off(
                'receive-vehicles'
            );
        };
    }, [order]);

    if (loading) {
        return <Loader />;
    }
    if (!order) {
        return (
            <div className="text-center py-20">
                Order not found
            </div>
        );
    }
    if (
        !currentPosition ||
        !currentPosition[0] ||
        !currentPosition[1]
    ) {
        return (
            <div className="text-center py-20">
                Fetching live tracking...
            </div>
        );
    }
    return (
        <PageTransition>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-6">
                    Live Order Tracking
                </h1>
                {/* ORDER INFO */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold mb-4">
                            Order Details
                        </h2>
                        <p>
                            <strong>Order:</strong>
                            {' '}
                            {order?.orderNumber}
                        </p>
                        <p>
                            <strong>Customer:</strong>
                            {' '}
                            {order?.customerName}
                        </p>
                        <p>
                            <strong>Pickup:</strong>
                            {' '}
                            {order?.pickupLocation}
                        </p>
                        <p>
                            <strong>Drop:</strong>
                            {' '}
                            {order?.dropLocation}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold mb-4">
                            Driver & Vehicle
                        </h2>
                        <p>
                            <strong>Driver:</strong>
                            {' '}
                            {order?.driver?.name}
                        </p>
                        <p>
                            <strong>Vehicle:</strong>
                            {' '}
                            {order?.vehicle?.vehicleNumber}
                        </p>
                        <p>
                            <strong>Vehicle Type:</strong>
                            {' '}
                            {order?.vehicle?.vehicleType}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold mb-4">
                            Delivery Status
                        </h2>
                        <p className="mb-3">
                            <span
                                className="
                                   bg-orange-500
                                   text-white
                                   px-4 py-2
                                   rounded-full
                               "
                            >
                                {order?.status}
                            </span>
                        </p>
                        <p>
                            <strong>ETA:</strong>
                            {' '}
                            {order?.estimatedDeliveryTime}
                        </p>
                    </div>
                </div>
                {/* LIVE MAP */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <MapContainer
                        center={currentPosition}
                        zoom={13}
                        style={{
                            height: '500px',
                            width: '100%',
                        }}
                        className="z-10"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Polyline
                            positions={pathCoordinates}
                            pathOptions={{
                                color: 'green',
                                weight: 5,
                            }}
                        />
                        <Marker
                            position={currentPosition}
                            icon={vehicleIcon}
                        >
                            <Popup>
                                <div className="text-[12px] leading-[0.15] min-w-[170px]">
                                    <p className="m-0 font-bold text-blue-900">
                                        🚚 FleetNova Vehicle
                                    </p>
                                    <hr className="my-1" />
                                    <p className="m-0">
                                        Vehicle: {order?.vehicle?.vehicleNumber}
                                    </p>
                                    <p className="m-0">
                                        Type: {order?.vehicle?.vehicleType}
                                    </p>
                                    <p className="m-0">
                                        Driver: {order?.driver?.name}
                                    </p>
                                    <hr className="my-1" />
                                    <p className="m-0">
                                        Order: {order?.orderNumber}
                                    </p>
                                    <p className="m-0">
                                        Customer: {order?.customerName}
                                    </p>
                                    <p className="m-0">
                                        Status:
                                        {' '}
                                        <span className="text-orange-500 font-bold">
                                            {order?.status}
                                        </span>
                                    </p>
                                    <hr className="my-1" />
                                    <p className="m-0">
                                        ETA:
                                        {' '}
                                        {order?.estimatedDeliveryTime || 'Updating...'}
                                    </p>
                                    <p className="m-0">
                                        Lat:
                                        {' '}
                                        {currentPosition[0].toFixed(4)}
                                    </p>
                                    <p className="m-0">
                                        Lng:
                                        {' '}
                                        {currentPosition[1].toFixed(4)}
                                    </p>
                                    <p className="m-0 leading-4">
                                        Address:
                                        {' '}
                                        <span className="text-gray-700">
                                            {locationAddress ||
                                                'Fetching location...'}
                                        </span>
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </PageTransition>
    );
};
export default TrackOrder;