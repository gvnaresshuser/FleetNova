import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import API from '../../services/api';
import { FaEdit } from 'react-icons/fa';
import PageTransition from '../../components/common/PageTransition';
const Vehicles = ({ startLoading }) => {
    const [editModal, setEditModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({

        vehicleNumber: '',
        vehicleType: '',
        fuelType: '',
        latitude: '',
        longitude: '',
        status: 'ACTIVE',

    });

    const fetchVehicles = async () => {

        try {

            const { data } = await API.get('/vehicles');

            setVehicles(data.vehicles);

            setLoading(false);

        } catch (error) {

            console.log(error);

            setLoading(false);

        }

    };
    useEffect(() => {
        startLoading();
    }, []);

    useEffect(() => {

        fetchVehicles();

    }, []);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,

        });

    };

    const openEditModal = (vehicle) => {

        setSelectedVehicle({

            ...vehicle,

            latitude: vehicle.latitude || '',

            longitude: vehicle.longitude || '',

        });

        setEditModal(true);

    };
    const handleEditChange = (e) => {

        setSelectedVehicle({

            ...selectedVehicle,

            [e.target.name]: e.target.value,

        });

    };
    const updateVehicle = async (e) => {

        e.preventDefault();

        try {

            const payload = {

                ...selectedVehicle,

                latitude: selectedVehicle.latitude
                    ? parseFloat(selectedVehicle.latitude)
                    : null,

                longitude: selectedVehicle.longitude
                    ? parseFloat(selectedVehicle.longitude)
                    : null,

            };

            await API.put(

                `/vehicles/${selectedVehicle.id}`,

                payload

            );

            toast.success('Vehicle updated successfully');

            setEditModal(false);

            fetchVehicles();

        } catch (error) {

            console.log(error);

            toast.error('Update failed');

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const payload = {

                ...formData,

                latitude: formData.latitude
                    ? parseFloat(formData.latitude)
                    : null,

                longitude: formData.longitude
                    ? parseFloat(formData.longitude)
                    : null,

            };

            await API.post('/vehicles', payload);

            toast.success('Vehicle added successfully');

            setFormData({

                vehicleNumber: '',
                vehicleType: '',
                fuelType: '',
                latitude: '',
                longitude: '',
                status: 'ACTIVE',

            });

            fetchVehicles();

        } catch (error) {

            console.log(error);

            toast.error('Failed to add vehicle');

        }

    };

    const deleteVehicle = async (id) => {

        const result = await Swal.fire({

            title: 'Are you sure?',

            text: 'Vehicle will be deleted permanently',

            icon: 'warning',

            showCancelButton: true,

            confirmButtonColor: '#2563EB',

            cancelButtonColor: '#EF4444',

            confirmButtonText: 'Yes, delete it',

        });

        if (result.isConfirmed) {

            try {

                await API.delete(`/vehicles/${id}`);

                toast.success('Vehicle deleted successfully');

                fetchVehicles();

            } catch (error) {

                console.log(error);

                toast.error('Delete failed');

            }

        }

    };

    return (
<PageTransition>
        <div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <h1 className="text-2xl md:text-3xl font-bold">

                    Vehicles

                </h1>

            </div>

            {/* Add Vehicle Form */}

            <div className="bg-white rounded-xl shadow p-6 mb-8">

                <h2 className="text-xl font-bold mb-4">

                    Add Vehicle

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >

                    <input
                        type="text"
                        name="vehicleNumber"
                        placeholder="Vehicle Number"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                        required
                    />

                    <input
                        type="text"
                        name="vehicleType"
                        placeholder="Vehicle Type"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                        required
                    />

                    <input
                        type="text"
                        name="fuelType"
                        placeholder="Fuel Type"
                        value={formData.fuelType}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                        required
                    />

                    <input
                        type="number"
                        step="any"
                        name="latitude"
                        placeholder="Latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                    />

                    <input
                        type="number"
                        step="any"
                        name="longitude"
                        placeholder="Longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                    />

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                    >

                        <option value="ACTIVE">
                            ACTIVE
                        </option>

                        <option value="INACTIVE">
                            INACTIVE
                        </option>

                    </select>

                    <button
                        type="submit"
                        className="bg-blue-900 hover:bg-blue-800 text-white rounded-lg p-3 font-bold"
                    >

                        Add Vehicle

                    </button>

                </form>

            </div>

            {/* Vehicles Table */}

            <div className="bg-white rounded-xl shadow overflow-x-auto">

                {
                    loading ? (

                        <div className="p-6 text-center">

                            Loading vehicles...

                        </div>

                    ) : (

                        <table className="min-w-full">

                            <thead className="bg-blue-900 text-white">

                                <tr>

                                    <th className="p-4 text-left">
                                        Vehicle No
                                    </th>

                                    <th className="p-4 text-left">
                                        Type
                                    </th>

                                    <th className="p-4 text-left">
                                        Fuel
                                    </th>

                                    <th className="p-4 text-left">
                                        Status
                                    </th>

                                    <th className="p-4 text-left">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    vehicles.map((vehicle) => (

                                        <tr
                                            key={vehicle.id}
                                            className="border-b hover:bg-gray-50"
                                        >

                                            <td className="p-4">
                                                {vehicle.vehicleNumber}
                                            </td>

                                            <td className="p-4">
                                                {vehicle.vehicleType}
                                            </td>

                                            <td className="p-4">
                                                {vehicle.fuelType}
                                            </td>

                                            <td className="p-4">

                                                <span
                                                    className={`
                                                        px-3 py-1 rounded-full text-white text-sm
                                                        ${vehicle.status === 'ACTIVE'
                                                            ? 'bg-green-500'
                                                            : 'bg-red-500'}
                                                    `}
                                                >

                                                    {vehicle.status}

                                                </span>

                                            </td>

                                            <td className="p-4 flex gap-2">

                                                <button
                                                    onClick={() => openEditModal(vehicle)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                                                >

                                                    <FaEdit />

                                                </button>

                                                <button
                                                    onClick={() => deleteVehicle(vehicle.id)}
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
                {
                    editModal && (

                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">

                                <div className="flex justify-between items-center mb-6">

                                    <h2 className="text-2xl font-bold">

                                        Edit Vehicle

                                    </h2>

                                    <button
                                        onClick={() => setEditModal(false)}
                                        className="text-2xl"
                                    >

                                        ×

                                    </button>

                                </div>

                                <form
                                    onSubmit={updateVehicle}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >

                                    <input
                                        type="text"
                                        name="vehicleNumber"
                                        value={selectedVehicle.vehicleNumber}
                                        onChange={handleEditChange}
                                        className="border rounded-lg p-3"
                                        placeholder="Vehicle Number"
                                    />

                                    <input
                                        type="text"
                                        name="vehicleType"
                                        value={selectedVehicle.vehicleType}
                                        onChange={handleEditChange}
                                        className="border rounded-lg p-3"
                                        placeholder="Vehicle Type"
                                    />

                                    <input
                                        type="text"
                                        name="fuelType"
                                        value={selectedVehicle.fuelType}
                                        onChange={handleEditChange}
                                        className="border rounded-lg p-3"
                                        placeholder="Fuel Type"
                                    />

                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={selectedVehicle.latitude}
                                        onChange={handleEditChange}
                                        className="border rounded-lg p-3"
                                        placeholder="Latitude"
                                    />

                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={selectedVehicle.longitude}
                                        onChange={handleEditChange}
                                        className="border rounded-lg p-3"
                                        placeholder="Longitude"
                                    />

                                    <select
                                        name="status"
                                        value={selectedVehicle.status}
                                        onChange={handleEditChange}
                                        className="border rounded-lg p-3"
                                    >

                                        <option value="ACTIVE">
                                            ACTIVE
                                        </option>

                                        <option value="INACTIVE">
                                            INACTIVE
                                        </option>

                                    </select>

                                    <button
                                        type="submit"
                                        className="bg-blue-900 hover:bg-blue-800 text-white rounded-lg p-3 font-bold"
                                    >

                                        Update Vehicle

                                    </button>

                                </form>

                            </div>

                        </div>

                    )
                }

            </div>

        </div>
        </PageTransition>
    );

};

export default Vehicles;