import {

    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,

} from 'recharts';

const RevenueByDriverChart = ({ data }) => {

    return (

        <div className="bg-white rounded-xl shadow p-5 h-[400px]">

            <h2 className="text-xl font-bold mb-4">

                Revenue By Driver

            </h2>

            <ResponsiveContainer width="100%" height="100%">

                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="revenue"
                        fill="#2563EB"
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

};

export default RevenueByDriverChart;