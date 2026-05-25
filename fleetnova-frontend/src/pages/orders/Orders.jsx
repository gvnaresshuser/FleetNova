import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import API from '../../services/api';
import Loader from '../../components/common/Loader';
import PageTransition from '../../components/common/PageTransition';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
const Orders = ({ startLoading }) => {

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [formData, setFormData] = useState({
        orderNumber: '',
        customerName: '',
        pickupLocation: '',
        dropLocation: '',
        amount: '',
        status: 'PENDING',
        vehicleId: '',
        driverId: '',
    });
    const [editModal, setEditModal] =
        useState(false);

    const [selectedOrder, setSelectedOrder] =
        useState(null);
    const fetchOrders = async () => {

        try {

            const { data } = await API.get('/orders');
            console.log(data);

            setOrders(data.orders);

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

    const fetchDrivers = async () => {

        try {

            const { data } = await API.get('/drivers');

            setDrivers(data.drivers);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        startLoading();

        fetchOrders();

        fetchVehicles();

        fetchDrivers();

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

            await API.post('/orders', {

                ...formData,

                amount: parseFloat(formData.amount),

                vehicleId: Number(formData.vehicleId),

                driverId: Number(formData.driverId),

            });

            toast.success('Order created successfully');

            setFormData({

                orderNumber: '',

                customerName: '',

                pickupLocation: '',

                dropLocation: '',

                amount: '',

                status: 'PENDING',

                vehicleId: '',

                driverId: '',

            });

            fetchOrders();

        } catch (error) {

            console.log(error);

            toast.error('Failed to create order');

        }

    };
    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                'Are you sure you want to delete this order?'
            );

        if (!confirmDelete) return;

        try {

            await API.delete(`/orders/${id}`);

            toast.success('Order deleted successfully');

            fetchOrders();

        } catch (error) {

            console.log(error);

            toast.error('Failed to delete order');

        }

    };
    const openEditModal = (order) => {

        setSelectedOrder({

            ...order,

            vehicleId:
                order.vehicleId || '',

            driverId:
                order.driverId || '',

        });

        setEditModal(true);

    };
    const handleEditChange = (e) => {

        setSelectedOrder({

            ...selectedOrder,

            [e.target.name]:
                e.target.value,

        });

    };
    const updateOrder = async (e) => {

        e.preventDefault();

        try {

            await API.put(

                `/orders/${selectedOrder.id}`,

                {

                    ...selectedOrder,

                    amount: parseFloat(
                        selectedOrder.amount
                    ),

                    vehicleId: Number(
                        selectedOrder.vehicleId
                    ),

                    driverId: Number(
                        selectedOrder.driverId
                    ),

                }

            );

            toast.success(
                'Order updated successfully'
            );

            setEditModal(false);

            fetchOrders();

        } catch (error) {

            console.log(error);

            toast.error(
                'Failed to update order'
            );

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <PageTransition>

            <div>

                <h1 className="text-2xl md:text-3xl font-bold mb-6">

                    Orders Management

                </h1>

                {/* ADD ORDER FORM */}

                <div className="bg-white rounded-xl shadow p-6 mb-8">

                    <h2 className="text-xl font-bold mb-4">

                        Create Order

                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >

                        <input
                            type="text"
                            name="orderNumber"
                            placeholder="Order Number"
                            value={formData.orderNumber}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                        <input
                            type="text"
                            name="customerName"
                            placeholder="Customer Name"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                        <input
                            type="text"
                            name="pickupLocation"
                            placeholder="Pickup Location"
                            value={formData.pickupLocation}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                        <input
                            type="text"
                            name="dropLocation"
                            placeholder="Drop Location"
                            value={formData.dropLocation}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        />

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                        >

                            <option value="PENDING">
                                PENDING
                            </option>

                            <option value="IN_PROGRESS">
                                IN_PROGRESS
                            </option>

                            <option value="COMPLETED">
                                COMPLETED
                            </option>

                        </select>

                        <select
                            name="vehicleId"
                            value={formData.vehicleId}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        >

                            <option value="">
                                Select Vehicle
                            </option>

                            {
                                vehicles.map((vehicle) => (

                                    <option
                                        key={vehicle.id}
                                        value={vehicle.id}
                                    >

                                        {vehicle.vehicleNumber}

                                    </option>

                                ))
                            }

                        </select>

                        <select
                            name="driverId"
                            value={formData.driverId}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            required
                        >

                            <option value="">
                                Select Driver
                            </option>

                            {
                                drivers.map((driver) => (

                                    <option
                                        key={driver.id}
                                        value={driver.id}
                                    >

                                        {driver.name}

                                    </option>

                                ))
                            }

                        </select>

                        <button
                            type="submit"
                            className="bg-blue-900 hover:bg-blue-800 text-white rounded-lg p-3 font-bold"
                        >

                            Create Order

                        </button>

                    </form>

                </div>

                {/* ORDERS TABLE */}

                <div className="bg-white rounded-xl shadow overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-blue-900 text-white">

                            <tr>

                                <th className="p-4 text-left">
                                    Order No
                                </th>

                                <th className="p-4 text-left">
                                    Customer
                                </th>

                                <th className="p-4 text-left">
                                    Pickup
                                </th>

                                <th className="p-4 text-left">
                                    Drop
                                </th>

                                <th className="p-4 text-left">
                                    Amount
                                </th>

                                <th className="p-4 text-left">
                                    Vehicle
                                </th>

                                <th className="p-4 text-left">
                                    Driver
                                </th>

                                <th className="p-4 text-left">
                                    Status
                                </th>
                                {/* <th className="p-4 text-left">
                                    Tracking
                                </th> */}
                                <th className="p-4 text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                orders.map((order) => (

                                    <tr
                                        key={order.id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="p-4">
                                            {order.orderNumber}
                                        </td>

                                        <td className="p-4">
                                            {order.customerName}
                                        </td>

                                        <td className="p-4">
                                            {order.pickupLocation}
                                        </td>

                                        <td className="p-4">
                                            {order.dropLocation}
                                        </td>

                                        <td className="p-4">
                                            ₹{order.amount}
                                        </td>

                                        <td className="p-4">

                                            {
                                                order.vehicle?.vehicleNumber
                                            }

                                        </td>

                                        <td className="p-4">

                                            {
                                                order.driver?.name
                                            }

                                        </td>

                                        <td className="p-4">

                                            <span
                                                className={`
                                                    px-3 py-1 rounded-full text-white text-sm
                                                    ${order.status === 'COMPLETED'
                                                        ? 'bg-green-500'
                                                        : order.status === 'IN_PROGRESS'
                                                            ? 'bg-orange-500'
                                                            : 'bg-blue-500'}
                                                `}
                                            >

                                                {order.status}

                                            </span>

                                        </td>


                                        <td className="p-4">

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(order)
                                                    }
                                                    className="
                                            bg-orange-500
                                            hover:bg-orange-600
                                            text-white
                                            px-3 py-2
                                            rounded-lg
                                            text-sm
                                            ">
                                                    <FaEdit />
                                                </button>

                                                <Link
                                                    to={`/track-order/${order.id}`}
                                                    className="
                                                    bg-blue-900
                                                    hover:bg-blue-800
                                                    text-white
                                                    px-4 py-2
                                                    rounded-lg
                                                    text-sm">
                                                    Track
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(order.id)
                                                    }
                                                    className="
                                                    bg-red-500
                                                    hover:bg-red-600
                                                    text-white
                                                    px-4 py-2
                                                    rounded-lg
                                                    text-sm">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>

                </div>

            </div>
            {
                editModal &&
                selectedOrder && (

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
                    max-w-2xl
                "
                        >

                            <div className="flex justify-between mb-6">
                                <h2 className="text-2xl font-bold text-blue-900">
                                    Edit Order
                                </h2>
                                <button
                                    onClick={() =>
                                        setEditModal(false)
                                    }
                                    className="
                            text-red-500
                            text-xl
                            font-bold">
                                    ✕
                                </button>
                            </div>
                            <form
                                onSubmit={updateOrder}
                                className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-4">
                                <input
                                    type="text"
                                    name="orderNumber"
                                    value={selectedOrder.orderNumber}
                                    onChange={handleEditChange}
                                    placeholder="Order Number"
                                    className="border rounded-lg p-3"
                                />

                                <input
                                    type="text"
                                    name="customerName"
                                    value={selectedOrder.customerName}
                                    onChange={handleEditChange}
                                    placeholder="Customer Name"
                                    className="border rounded-lg p-3"
                                />

                                <input
                                    type="text"
                                    name="pickupLocation"
                                    value={selectedOrder.pickupLocation}
                                    onChange={handleEditChange}
                                    placeholder="Pickup Location"
                                    className="border rounded-lg p-3"
                                />

                                <input
                                    type="text"
                                    name="dropLocation"
                                    value={selectedOrder.dropLocation}
                                    onChange={handleEditChange}
                                    placeholder="Drop Location"
                                    className="border rounded-lg p-3"
                                />

                                <input
                                    type="number"
                                    name="amount"
                                    value={selectedOrder.amount}
                                    onChange={handleEditChange}
                                    placeholder="Amount"
                                    className="border rounded-lg p-3"
                                />

                                <select
                                    name="status"
                                    value={selectedOrder.status}
                                    onChange={handleEditChange}
                                    className="border rounded-lg p-3"
                                >

                                    <option value="PENDING">
                                        PENDING
                                    </option>

                                    <option value="IN_PROGRESS">
                                        IN_PROGRESS
                                    </option>

                                    <option value="COMPLETED">
                                        COMPLETED
                                    </option>

                                </select>

                                <select
                                    name="vehicleId"
                                    value={selectedOrder.vehicleId}
                                    onChange={handleEditChange}
                                    className="border rounded-lg p-3"
                                >

                                    {
                                        vehicles.map((vehicle) => (

                                            <option
                                                key={vehicle.id}
                                                value={vehicle.id}
                                            >

                                                {vehicle.vehicleNumber}

                                            </option>

                                        ))
                                    }

                                </select>

                                <select
                                    name="driverId"
                                    value={selectedOrder.driverId}
                                    onChange={handleEditChange}
                                    className="border rounded-lg p-3"
                                >

                                    {
                                        drivers.map((driver) => (

                                            <option
                                                key={driver.id}
                                                value={driver.id}
                                            >

                                                {driver.name}

                                            </option>

                                        ))
                                    }

                                </select>

                                <button
                                    type="submit"
                                    className="
                            md:col-span-2
                            bg-blue-900
                            hover:bg-blue-800
                            text-white
                            p-3
                            rounded-lg
                            font-bold
                        "
                                >

                                    Update Order

                                </button>

                            </form>

                        </div>

                    </div>

                )
            }
        </PageTransition>

    );

};

export default Orders;