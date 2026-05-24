import {

    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,

} from 'recharts';

const data = [

    { month: 'Jan', revenue: 40000 },

    { month: 'Feb', revenue: 55000 },

    { month: 'Mar', revenue: 70000 },

    { month: 'Apr', revenue: 85000 },

    { month: 'May', revenue: 100000 },

];

const RevenueChart = () => {

    return (

        <div className="bg-white rounded-xl shadow p-5 h-[400px]">

            <h2 className="text-xl font-bold mb-4">
                Revenue Analytics
            </h2>

            <ResponsiveContainer width="100%" height="100%">

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563EB"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

};

export default RevenueChart;