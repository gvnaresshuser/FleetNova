import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await API.post(
                '/auth/login',
                formData
            );
            localStorage.setItem(
                'token',
                data.token
            );
            localStorage.setItem(
                'user',
                JSON.stringify(data.user)
            );
            toast.success('Login successful');
            navigate('/dashboard');
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message ||
                'Login failed'
            );
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
                    FleetNova Login
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="block mb-2 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-bold transition"
                    >
                        {
                            loading
                                ? 'Logging in...'
                                : 'Login'
                        }
                    </button>
                    <div
                        className="
        mt-2
        bg-blue-50
        border
        border-blue-200
        rounded-xl
        p-4
        shadow-sm">

                        <h2
                            className="
            text-blue-900
            font-bold
            mb-2
            text-sm">
                            🚀 Demo Login Account
                        </h2>
                        <div
                            className="
                            text-sm
                            text-gray-700
                            space-y-1">
                            <p>
                                <span className="font-semibold">
                                    Email:
                                </span>
                                {' '}
                                naresh@gmail.com
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Password:
                                </span>
                                {' '}
                                123456
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    email:
                                        'naresh@gmail.com',
                                    password:
                                        '123456',
                                });
                            }}
                            className="
                                mt-3
                                w-full
                                bg-green-900
                                hover:bg-green-800
                                text-white
                                py-2
                                rounded-lg
                                text-sm
                                font-semibold
                                transition">
                            Use Demo Account
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;