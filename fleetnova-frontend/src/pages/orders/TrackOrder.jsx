import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import {

    MapContainer,
    TileLayer,
    Marker,
    Popup,

} from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../../services/api';
import Loader from '../../components/common/Loader';
import PageTransition from '../../components/common/PageTransition';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');
const vehicleIcon = new L.Icon({

    iconUrl:
        'https://cdn-icons-png.flaticon.com/512/744/744465.png',

    iconSize: [40, 40],

});

const TrackOrder = ({ startLoading }) => {

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

    const fetchOrder = async () => {

        try {

            /*  const { data } = await API.get(
                 `/tracking/${id}`
             ); */
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

    /*  useEffect(() => {
         startLoading();
         fetchOrder();        
     }, []); */
    useEffect(() => {

        startLoading();

        fetchOrder();

    }, []);

   
  /*   useEffect(() => {

        socket.on('receive-location', (data) => {

            if (
                data?.latitude &&
                data?.longitude
            ) {

                setLiveLocation(data);

            }

        });

        if (order) {

            const interval = setInterval(() => {

                const newLat =
                    Number(order.vehicle?.latitude) +
                    (Math.random() * 0.001);

                const newLng =
                    Number(order.vehicle?.longitude) +
                    (Math.random() * 0.001);

                socket.emit('send-location', {

                    latitude: newLat,

                    longitude: newLng,

                });

            }, 5000);

            return () => {

                clearInterval(interval);

                socket.off('receive-location');

            };

        }

    }, [order]); */
    useEffect(() => {

        socket.on('receive-location', (data) => {

            if (
                data?.latitude &&
                data?.longitude
            ) {

                setLiveLocation(data);

            }

        });

        return () => {

            socket.off('receive-location');

        };

    }, []);

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

                {/*   <div className="bg-white rounded-xl shadow overflow-hidden">

                    <MapContainer
                        center={[

                            liveLocation?.latitude ||
                            order.currentLatitude,

                            liveLocation?.longitude ||
                            order.currentLongitude,

                        ]}
                        zoom={13}
                        style={{
                            height: '500px',
                            width: '100%',
                        }}
                    >

                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker
                            position={[

                                liveLocation?.latitude ||
                                order.currentLatitude,

                                liveLocation?.longitude ||
                                order.currentLongitude,

                            ]}
                            icon={vehicleIcon}
                        >

                            <Popup>

                                {order?.vehicle?.vehicleNumber}

                            </Popup>

                        </Marker>

                    </MapContainer>

                </div> */}
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