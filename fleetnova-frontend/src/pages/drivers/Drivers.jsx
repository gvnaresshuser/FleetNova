import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import Swal from 'sweetalert2';

import {
    FaEdit,
} from 'react-icons/fa';

import API from '../../services/api';
import PageTransition from '../../components/common/PageTransition';

const Drivers = ({ startLoading }) => {

    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        licenseNumber: '',
        experience: '',
        status: 'ACTIVE',
        vehicleId: '',
    });

    const fetchDrivers = async () => {

        try {
            const { data } = await API.get('/drivers');
            setDrivers(data.drivers);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const fetchVehicles = async () => {
        try {
            const { data } = await API.get('/vehicles');
            setVehicles(data.vehicles);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDrivers();
        fetchVehicles();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post(
                '/drivers',
                formData
            );

            // ASSIGN VEHICLE

            if (formData.vehicleId) {
                await API.put(
                    '/vehicles/assign-driver',
                    {
                        vehicleId: Number(formData.vehicleId),
                        driverId: data.driver.id,
                    }
                );

            }

            toast.success('Driver added successfully');

            setFormData({
                name: '',
                email: '',
                mobile: '',
                licenseNumber: '',
                experience: '',
                status: 'ACTIVE',
                vehicleId: '',
            });
            fetchDrivers();
        } catch (error) {
            console.log(error);
            toast.error('Failed to add driver');
        }
    };

    const deleteDriver = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Driver will be deleted permanently',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563EB',
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Yes, delete it',
        });

        if (result.isConfirmed) {
            try {
                await API.delete(`/drivers/${id}`);
                toast.success('Driver deleted successfully');
                fetchDrivers();
            } catch (error) {
                console.log(error);
                toast.error('Delete failed');
            }
        }
    };

    const openEditModal = (driver) => {
        setSelectedDriver({
            ...driver,
        });
        setEditModal(true);
    };

    const handleEditChange = (e) => {
        setSelectedDriver({
            ...selectedDriver,
            [e.target.name]: e.target.value,
        });
    };

    const updateDriver = async (e) => {
        e.preventDefault();
        try {
            await API.put(
                `/drivers/${selectedDriver.id}`,
                selectedDriver
            );
            toast.success('Driver updated successfully');
            setEditModal(false);
            fetchDrivers();
        } catch (error) {
            console.log(error);
            toast.error('Update failed');
        }
    };

    useEffect(() => {
        startLoading();
    }, []);

    return (
        <PageTransition>
            <div>

                <h1 className="text-2xl md:text-3xl font-bold mb-6">

                    Drivers

                </h1>

                {/* ADD DRIVER */}

                <div className="bg-white rounded-xl shadow p-6 mb-8">

                    <h2 className="text-xl font-bold mb-4">

                        Add Driver

                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >

                        <input
                            type="text"
                            name="name"
                            placeholder="Driver Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                        <input
                            type="text"
                            name="mobile"
                            placeholder="Mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                        <input
                            type="text"
                            name="licenseNumber"
                            placeholder="License Number"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                        <input
                            type="number"
                            name="experience"
                            placeholder="Experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                        <select
                            name="vehicleId"
                            value={formData.vehicleId}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                        >

                            <option value="">
                                Assign Vehicle
                            </option>

                            {
                                vehicles
                                    .filter(
                                        (vehicle) => !vehicle.driverId
                                    )
                                    .map((vehicle) => (

                                        <option
                                            key={vehicle.id}
                                            value={vehicle.id}
                                        >

                                            {vehicle.vehicleNumber}

                                        </option>

                                    ))
                            }

                        </select>

                        <button
                            type="submit"
                            className="bg-blue-900 hover:bg-blue-800 text-white rounded-lg p-3 font-bold"
                        >

                            Add Driver

                        </button>

                    </form>

                </div>

                {/* DRIVERS TABLE */}

                <div className="bg-white rounded-xl shadow overflow-x-auto">

                    {
                        loading ? (

                            <div className="p-6 text-center">

                                Loading drivers...

                            </div>

                        ) : (

                            <table className="min-w-full">

                                <thead className="bg-blue-900 text-white">

                                    <tr>

                                        <th className="p-4 text-left">
                                            Name
                                        </th>

                                        <th className="p-4 text-left">
                                            Email
                                        </th>

                                        <th className="p-4 text-left">
                                            Experience
                                        </th>

                                        <th className="p-4 text-left">
                                            Vehicle
                                        </th>

                                        <th className="p-4 text-left">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        drivers.map((driver) => (

                                            <tr
                                                key={driver.id}
                                                className="border-b hover:bg-gray-50"
                                            >

                                                <td className="p-4">
                                                    {driver.name}
                                                </td>

                                                <td className="p-4">
                                                    {driver.email}
                                                </td>

                                                <td className="p-4">
                                                    {driver.experience} Years
                                                </td>

                                                <td className="p-4">

                                                    {
                                                        driver.vehicle
                                                            ? driver.vehicle.vehicleNumber
                                                            : 'Not Assigned'
                                                    }

                                                </td>

                                                <td className="p-4 flex gap-2">

                                                    <button
                                                        onClick={() => openEditModal(driver)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                                                    >

                                                        <FaEdit />

                                                    </button>

                                                    <button
                                                        onClick={() => deleteDriver(driver.id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                                    >

                                                        Delete

                                                    </button>

                                                </td>

                                            </tr>

                                        ))
                                    }

                                </tbody>

                            </table>

                        )
                    }

                </div>

            </div>
            {
                editModal && selectedDriver && (

                    <div
                        className="
                fixed inset-0
                bg-black/50
                flex items-center
                justify-center
                z-50
            "
                    >

                        <div
                            className="
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    p-6
                    w-full
                    max-w-lg
                "
                        >

                            <div className="flex justify-between items-center mb-6">

                                <h2 className="text-2xl font-bold text-blue-900">

                                    Edit Driver

                                </h2>

                                <button
                                    onClick={() => setEditModal(false)}
                                    className="
                            text-red-500
                            text-xl
                            font-bold
                        "
                                >

                                    ✕

                                </button>

                            </div>

                            <form
                                onSubmit={updateDriver}
                                className="space-y-4"
                            >

                                <input
                                    type="text"
                                    name="name"
                                    value={selectedDriver.name}
                                    onChange={handleEditChange}
                                    placeholder="Driver Name"
                                    className="
                            w-full
                            border
                            rounded-lg
                            p-3
                        "
                                />

                                <input
                                    type="email"
                                    name="email"
                                    value={selectedDriver.email}
                                    onChange={handleEditChange}
                                    placeholder="Email"
                                    className="
                            w-full
                            border
                            rounded-lg
                            p-3
                        "
                                />

                                <input
                                    type="text"
                                    name="mobile"
                                    value={selectedDriver.mobile}
                                    onChange={handleEditChange}
                                    placeholder="Mobile"
                                    className="
                            w-full
                            border
                            rounded-lg
                            p-3
                        "
                                />

                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={selectedDriver.licenseNumber}
                                    onChange={handleEditChange}
                                    placeholder="License Number"
                                    className="
                            w-full
                            border
                            rounded-lg
                            p-3
                        "
                                />

                                <input
                                    type="number"
                                    name="experience"
                                    value={selectedDriver.experience}
                                    onChange={handleEditChange}
                                    placeholder="Experience"
                                    className="
                            w-full
                            border
                            rounded-lg
                            p-3
                        "
                                />

                                <select
                                    name="status"
                                    value={selectedDriver.status}
                                    onChange={handleEditChange}
                                    className="
                            w-full
                            border
                            rounded-lg
                            p-3
                        "
                                >

                                    <option value="ACTIVE">
                                        ACTIVE
                                    </option>

                                    <option value="INACTIVE">
                                        INACTIVE
                                    </option>

                                </select>

                                <div className="flex gap-4">

                                    <button
                                        type="submit"
                                        className="
                                flex-1
                                bg-blue-900
                                hover:bg-blue-800
                                text-white
                                rounded-lg
                                p-3
                                font-bold
                            "
                                    >

                                        Update Driver

                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setEditModal(false)}
                                        className="
                                flex-1
                                bg-gray-300
                                hover:bg-gray-400
                                rounded-lg
                                p-3
                                font-bold
                            "
                                    >

                                        Cancel

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )
            }
        </PageTransition>
    );

};

export default Drivers;