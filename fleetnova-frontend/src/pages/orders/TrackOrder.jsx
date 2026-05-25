import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import {

    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap
} from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../../services/api';
import Loader from '../../components/common/Loader';
import PageTransition from '../../components/common/PageTransition';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
import 'animate.css';

const pickupIcon = new L.Icon({
    iconUrl:
        'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 35],
});
const destinationIcon =
    new L.Icon({
        iconUrl:
            'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
        iconSize: [35, 35],
    });
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
//----------------------------
const RecenterMap = ({
    position
}) => {

    const map = useMap();

    useEffect(() => {

        map.setView(
            position
        );

    }, [position]);

    return null;

};
//----------------------------

const TrackOrder = ({ startLoading }) => {
    console.log(
        'TrackOrder Component Loaded'
    );
    const [simulationMode, setSimulationMode] = useState(true);
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
            console.log(
                'Fetched Order ::',
                data.order
            );
            console.log(data);
            setOrder(data.order);
            setPathCoordinates([]);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    //------------------------------------------------------------------
    const handleReachedDestination =
        async () => {
            try {
                /* alert(
                    '🚚 Vehicle Reached Destination'
                ); */
               /*  Swal.fire({

                    title:
                        'Destination Reached',

                    text:
                        '🚚 Vehicle has successfully reached the destination.',

                    icon: 'success',

                    confirmButtonText:
                        'Awesome',

                    background: '#ffffff',

                    color: '#1e293b',

                    confirmButtonColor:
                        '#16a34a',

                    timer: 4000,

                    timerProgressBar: true,

                }); */
                Swal.fire({

                    title:
                        '🚚 Delivery Completed',

                    html: `

        <div style="font-size:16px">

            <p>

                Vehicle successfully reached destination.

            </p>

            <br/>

            <b>
                Order:
            </b>

            ${order?.orderNumber}

            <br/>

            <b>
                Customer:
            </b>

            ${order?.customerName}

        </div>

    `,

                    icon: 'success',

                    confirmButtonColor:
                        '#16a34a',

                    background: '#f8fafc',

                    timer: 5000,

                    timerProgressBar: true,

                    showClass: {

                        popup:
                            'animate__animated animate__zoomIn'

                    },

                    hideClass: {

                        popup:
                            'animate__animated animate__zoomOut'

                    }

                });
                await API.put(
                    `/orders/${order.id}`,
                    {

                        orderNumber:
                            order?.orderNumber,

                        customerName:
                            order?.customerName,

                        pickupLocation:
                            order?.pickupLocation,

                        dropLocation:
                            order?.dropLocation,

                        amount:
                            order?.amount,

                        vehicleId:
                            order?.vehicleId,

                        driverId:
                            order?.driverId,

                        status:
                            'COMPLETED',

                    }
                );
                fetchOrder();
            } catch (error) {
                console.log(error);
            }
        };
    //------------------------------------------------------------------

    useEffect(() => {
        startLoading();
        fetchOrder();
    }, []);


    useEffect(() => {
        socket.on(
            'receive-vehicles',
            (vehicles) => {
                console.log(
                    'Received Vehicles ::',
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
                    const distanceLat =
                        Math.abs(
                            currentVehicle.latitude -
                            order?.dropLatitude
                        );

                    const distanceLng =
                        Math.abs(
                            currentVehicle.longitude -
                            order?.dropLongitude
                        );

                    if (
                        distanceLat < 0.0005 &&
                        distanceLng < 0.0005
                    ) {

                        handleReachedDestination();

                    }
                    fetchAddress(
                        currentVehicle.latitude,
                        currentVehicle.longitude
                    );
                    /*  setPathCoordinates(
                         (prev) => [
                             ...prev,
                             [
                                 currentVehicle.latitude,
                                 currentVehicle.longitude
                             ]
                         ]
                     ); */
                    setPathCoordinates((prev) => {

                        const newPoint = [
                            currentVehicle.latitude,
                            currentVehicle.longitude
                        ];

                        const lastPoint =
                            prev[prev.length - 1];

                        if (
                            lastPoint &&
                            lastPoint[0] === newPoint[0] &&
                            lastPoint[1] === newPoint[1]
                        ) {

                            return prev;

                        }

                        return [
                            ...prev,
                            newPoint
                        ];

                    });
                }
            }
        );
        return () => {
            socket.off(
                'receive-vehicles'
            );
        };
    }, [order]);
    //---------------------- SIMULATION -------------------------------
    useEffect(() => {
        if (
            !simulationMode ||
            !order?.dropLatitude ||
            !order?.dropLongitude ||
            order?.status ===
            'COMPLETED'
        ) {
            return;
        }

        let latitude =
            order?.pickupLatitude ||
            17.7332;

        let longitude =
            order?.pickupLongitude ||
            83.3262;

        const interval =
            setInterval(() => {

                const targetLat =
                    order.dropLatitude;

                const targetLng =
                    order.dropLongitude;

                const step = 0.0005;

                // MOVE TOWARDS DESTINATION

                if (
                    latitude < targetLat
                ) {
                    latitude += step;
                } else {
                    latitude -= step;
                }

                if (
                    longitude < targetLng
                ) {
                    longitude += step;
                } else {
                    longitude -= step;
                }

                console.log(
                    '🚚 Simulated Movement ::',
                    latitude,
                    longitude
                );

                socket.emit(
                    'send-location',
                    {

                        vehicleId:
                            order?.vehicleId,

                        latitude,

                        longitude,

                        status:
                            'ACTIVE',

                        vehicleNumber:
                            order?.vehicle
                                ?.vehicleNumber,

                        vehicleType:
                            order?.vehicle
                                ?.vehicleType,

                        driver:
                            order?.driver
                                ?.name,

                        destination:
                            order?.dropLocation,

                        eta:
                            'Updating...',

                    }
                );

                // DESTINATION REACHED

                const distanceLat =
                    Math.abs(
                        latitude -
                        targetLat
                    );

                const distanceLng =
                    Math.abs(
                        longitude -
                        targetLng
                    );

                if (
                    distanceLat <
                    0.0005 &&
                    distanceLng <
                    0.0005
                ) {

                    console.log(
                        '✅ Destination Reached'
                    );

                    clearInterval(
                        interval
                    );

                }

            }, 3000);

        return () =>
            clearInterval(
                interval
            );

    }, [order, simulationMode]);
    //---------------------- SIMULATION -------------------------------
    useEffect(() => {

        if (
            simulationMode ||
            !order?.vehicleId
        ) {

            return;

        }

        if (
            !navigator.geolocation
        ) {

            alert(
                'Geolocation not supported'
            );

            return;

        }

        const watchId =
            navigator.geolocation.watchPosition(

                (position) => {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;

                    console.log(
                        '📡 Live GPS ::',
                        latitude,
                        longitude
                    );

                    socket.emit(
                        'send-location',
                        {

                            vehicleId:
                                order?.vehicleId,

                            latitude,

                            longitude,

                            status:
                                'ACTIVE',

                            vehicleNumber:
                                order?.vehicle
                                    ?.vehicleNumber,

                            vehicleType:
                                order?.vehicle
                                    ?.vehicleType,

                            driver:
                                order?.driver
                                    ?.name,

                            destination:
                                order?.dropLocation,

                            eta:
                                'Updating...',

                        }
                    );

                },

                (error) => {

                    console.log(error);

                },

                {

                    enableHighAccuracy:
                        true,

                    maximumAge: 0,

                    timeout: 5000,

                }

            );

        return () => {

            navigator.geolocation
                .clearWatch(
                    watchId
                );

        };

    }, [
        simulationMode,
        order
    ]);
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
            <div className="
flex
flex-col
md:flex-row
md:items-center
md:justify-between
gap-4
mb-6
">

                <h1 className="
    text-2xl
    md:text-3xl
    font-bold
    ">

                    Live Order Tracking

                </h1>

                <div className="
    flex
    items-center
    gap-3
    ">

                    <span className="font-semibold">

                        {
                            simulationMode
                                ? '🟢 Simulator Mode'
                                : '📡 Live GPS Mode'
                        }

                    </span>

                    <button

                        onClick={() =>
                            setSimulationMode(
                                !simulationMode
                            )
                        }

                        className={`
            px-4 py-2
            rounded-full
            text-white
            font-bold
            transition-all

            ${simulationMode
                                ? 'bg-orange-500'
                                : 'bg-green-600'
                            }
        `}
                    >

                        {
                            simulationMode
                                ? 'Switch To Live'
                                : 'Switch To Simulator'
                        }

                    </button>

                </div>

            </div>
            <div className="space-y-6">
                {/* ORDER INFO */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="
                                bg-white
                                rounded-2xl
                                shadow-md
                                hover:shadow-xl
                                transition-all
                                duration-300
                                p-5
                                border
                                ">
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
                                className={`
                                        text-white
                                        px-4 py-2
                                        rounded-full
                                        font-semibold

                                        ${order?.status === 'COMPLETED'
                                        ? 'bg-green-600'
                                        : order?.status === 'ACTIVE'
                                            ? 'bg-blue-600'
                                            : 'bg-orange-500'
                                    }
                                        `}
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
                <div className="
                            bg-white
                            rounded-2xl
                            shadow-lg
                            overflow-hidden
                            border
                            ">

                    <MapContainer
                        center={currentPosition}
                        zoom={13}
                        style={{
                            height: '75vh',
                            width: '100%',
                        }}
                        className="z-10"
                    >
                        <RecenterMap
                            position={currentPosition}
                        />
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
                            position={[
                                order?.pickupLatitude,
                                order?.pickupLongitude
                            ]}
                            icon={pickupIcon}
                        >
                            <Popup>
                                📍 Pickup Location
                                <br />
                                {order?.pickupLocation}
                            </Popup>
                        </Marker>
                        <Marker
                            position={[
                                order?.dropLatitude,
                                order?.dropLongitude
                            ]}
                            icon={destinationIcon}
                        >
                            <Popup>
                                🏁 Destination
                                <br />
                                {order?.dropLocation}
                            </Popup>
                        </Marker>
                        <Marker
                            position={currentPosition}
                            icon={vehicleIcon}
                        >
                            <Popup>
                                <div className="text-xs leading-1 min-w-[220px]">

                                    <p className="font-bold text-blue-900">
                                        🚚 FleetNova Vehicle
                                    </p>

                                    <hr className="my-1" />

                                    <p>
                                        Vehicle:
                                        {' '}
                                        {order?.vehicle?.vehicleNumber}
                                    </p>

                                    <p>
                                        Type:
                                        {' '}
                                        {order?.vehicle?.vehicleType}
                                    </p>

                                    <p>
                                        Driver:
                                        {' '}
                                        {order?.driver?.name}
                                    </p>

                                    <hr className="my-1" />

                                    <p>
                                        Order:
                                        {' '}
                                        {order?.orderNumber}
                                    </p>

                                    <p>
                                        Customer:
                                        {' '}
                                        {order?.customerName}
                                    </p>

                                    <p>
                                        Status:
                                        {' '}

                                        <span
                                            className={`
            font-bold

            ${order?.status ===
                                                    'COMPLETED'

                                                    ? 'text-green-600'

                                                    : 'text-orange-500'
                                                }
        `}
                                        >

                                            {order?.status}

                                        </span>

                                    </p>

                                    <hr className="my-1" />

                                    <p>
                                        ETA:
                                        {' '}
                                        {
                                            order?.estimatedDeliveryTime ||
                                            'Updating...'
                                        }
                                    </p>

                                    <p>
                                        Lat:
                                        {' '}
                                        {currentPosition[0].toFixed(4)}
                                    </p>

                                    <p>
                                        Lng:
                                        {' '}
                                        {currentPosition[1].toFixed(4)}
                                    </p>

                                    <p className="text-gray-700 leading-4">

                                        📍
                                        {' '}

                                        {
                                            locationAddress ||
                                            'Fetching location...'
                                        }

                                    </p>

                                    {
                                        order?.status ===
                                        'COMPLETED' && (

                                            <p className="text-green-600 font-bold mt-1">

                                                ✅ Reached Destination

                                            </p>

                                        )
                                    }

                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-4
                    mt-6
                    ">

                    <div className="
                    bg-green-50
                    border
                    rounded-xl
                    p-4
                    ">

                        <h3 className="font-bold">
                            📍 Pickup
                        </h3>

                        <p className="text-sm mt-1">
                            {order?.pickupLocation}
                        </p>

                    </div>

                    <div className="
                    bg-blue-50
                    border
                    rounded-xl
                    p-4
                    ">

                        <h3 className="font-bold">
                            🚚 Live Vehicle
                        </h3>

                        <p className="text-sm mt-1">
                            {locationAddress}
                        </p>

                    </div>

                    <div className="
                    bg-red-50
                    border
                    rounded-xl
                    p-4
                    ">

                        <h3 className="font-bold">
                            🏁 Destination
                        </h3>

                        <p className="text-sm mt-1">
                            {order?.dropLocation}
                        </p>

                    </div>

                </div>
            </div>
        </PageTransition>
    );
};
export default TrackOrder;