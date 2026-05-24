import { useEffect, useState } from 'react';

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import PageTransition from '../../components/common/PageTransition';
import API from '../../services/api';
const socket = io('http://localhost:5000');

const markerIcon = new L.Icon({

    iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

    iconSize: [25, 41],

});
const getMarkerIcon = (status) => {

    let iconUrl =
        'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';

    if (status === 'ACTIVE') {

        iconUrl =
            'https://maps.google.com/mapfiles/ms/icons/green-dot.png';

    }

    if (status === 'IN_TRANSIT') {

        iconUrl =
            'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';

    }

    if (
        status === 'REACHED_DESTINATION'
    ) {

        iconUrl =
            'https://maps.google.com/mapfiles/ms/icons/red-dot.png';

    }

    if (status === 'IDLE') {

        iconUrl =
            'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';

    }

    return new L.Icon({

        iconUrl,

        iconSize: [40, 40],

    });

};

const LiveTracking = ({ startLoading }) => {
    const [currentVehicleId,
        setCurrentVehicleId] =
        useState(null);

    const [vehicles, setVehicles] =
        useState([]);

    useEffect(() => {
        startLoading();
    }, []);

    useEffect(() => {

        const fetchAssignedVehicle =
            async () => {

                try {

                    const user =
                        JSON.parse(
                            localStorage.getItem(
                                'user'
                            )
                        );

                    if (!user) return;

                    const { data } =
                        await API.get(
                            '/drivers'
                        );

                    // FIND DRIVER BY EMAIL

                    const currentDriver =
                        data.drivers.find(
                            (driver) =>
                                driver.email ===
                                user.email
                        );

                    if (
                        currentDriver?.vehicle?.id
                    ) {

                        setCurrentVehicleId(
                            currentDriver.vehicle.id
                        );

                    }

                } catch (error) {

                    console.log(error);

                }

            };

        fetchAssignedVehicle();

        const fetchLiveVehicles = async () => {
            try {
                const response = await API.get('/order-tracking/live-vehicles');
                setVehicles(response.data.vehicles);
            } catch (error) {
                console.error('Error fetching live vehicles:', error);
            }
        };

        fetchLiveVehicles();

        const interval = setInterval(() => {

            fetchLiveVehicles();

        }, 5000);

        return () => clearInterval(interval);
    }, []);

    //REPLACE WITH REAL GPS 🚀
    useEffect(() => {

        socket.on(
            'receive-vehicles',
            (data) => {

                setVehicles(data);

            }
        );

        // REAL GPS TRACKING

        if (navigator.geolocation) {

            const watchId =
                navigator.geolocation.watchPosition(

                    async (position) => {

                        if (!currentVehicleId)
                            return;

                        const latitude =
                            position.coords.latitude;

                        const longitude =
                            position.coords.longitude;

                        console.log(
                            'Live GPS:',
                            latitude,
                            longitude
                        );

                        try {

                            // UPDATE VEHICLE LOCATION IN DB

                            await API.put(
                                '/vehicles/update-location',
                                {

                                    vehicleId: currentVehicleId,

                                    latitude,

                                    longitude,

                                }
                            );

                            // SEND SOCKET UPDATE

                            socket.emit(
                                'send-location',
                                {

                                    vehicleId: currentVehicleId,

                                    latitude,

                                    longitude,

                                    status: 'ACTIVE',

                                }
                            );

                        } catch (error) {

                            console.log(error);

                        }

                    },

                    (error) => {

                        console.log(error);

                    },

                    {

                        enableHighAccuracy: true,

                        maximumAge: 0,

                        timeout: 5000,

                    }

                );

            return () => {

                navigator.geolocation.clearWatch(
                    watchId
                );

                socket.off('receive-vehicles');

            };

        }

    }, []);

    return (
<PageTransition>
        <div>

            <h1 className="text-2xl md:text-3xl font-bold mb-6">

                Live Vehicle Tracking

            </h1>

            <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow relative z-10">

                <MapContainer
                        center={[17.6868, 83.2185]}
                    zoom={13}
                    className="h-full w-full"
                >

                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                        {
                            vehicles
                                .filter(
                                    (vehicle) =>
                                        vehicle.latitude &&
                                        vehicle.longitude
                                )
                                .map((vehicle) => (

                                <Marker
                                    key={vehicle.id}
                                    position={[
                                        vehicle.latitude,
                                        vehicle.longitude,
                                    ]}
                                    icon={
                                        getMarkerIcon(
                                            vehicle.status
                                        )
                                    }
                                >

                                        <Popup>

                                            <div className="text-xs leading-1 min-w-[190px]">

                                                <p className="m-0 font-bold text-blue-900">

                                                    🚚 {vehicle.vehicleNumber}

                                                </p>

                                                <p className="m-0">

                                                    Type:
                                                    {' '}
                                                    {vehicle.vehicleType}

                                                </p>

                                                <p className="m-0">

                                                    Fuel:
                                                    {' '}
                                                    {vehicle.fuelType}

                                                </p>

                                                <p className="m-0">

                                                    Driver:
                                                    {' '}
                                                    {vehicle.driver?.name || 'Unassigned'}

                                                </p>

                                                <p className="m-0">

                                                    Mobile:
                                                    {' '}
                                                    {vehicle.driver?.mobile || 'N/A'}

                                                </p>

                                                <hr className="my-1" />

                                                <p className="m-0">

                                                    Order:
                                                    {' '}
                                                    {vehicle.orders?.[0]?.orderNumber || 'N/A'}

                                                </p>

                                                <p className="m-0">

                                                    Customer:
                                                    {' '}
                                                    {vehicle.orders?.[0]?.customerName || 'N/A'}

                                                </p>

                                                <p className="m-0">

                                                    Pickup:
                                                    {' '}
                                                    {vehicle.orders?.[0]?.pickupLocation || 'N/A'}

                                                </p>

                                                <p className="m-0">

                                                    Destination:
                                                    {' '}
                                                    {vehicle.orders?.[0]?.dropLocation || 'N/A'}

                                                </p>

                                                <hr className="my-1" />

                                                <p className="m-0">

                                                    Status:
                                                    {' '}

                                                    <span className="font-bold">

                                                        {vehicle.status}

                                                    </span>

                                                </p>

                                                <p className="m-0">

                                                    ETA:
                                                    {' '}
                                                    {
                                                        vehicle.orders?.[0]
                                                            ?.estimatedDeliveryTime ||
                                                        'Updating...'
                                                    }

                                                </p>

                                                <p className="m-0">

                                                    Lat:
                                                    {' '}
                                                    {vehicle.latitude?.toFixed(4)}

                                                </p>

                                                <p className="m-0">

                                                    Lng:
                                                    {' '}
                                                    {vehicle.longitude?.toFixed(4)}

                                                </p>

                                            </div>

                                        </Popup>

                                </Marker>

                            ))
                        }

                </MapContainer>

            </div>

        </div>
    </PageTransition>
    );

};

export default LiveTracking;