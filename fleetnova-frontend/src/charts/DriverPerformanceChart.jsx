import {

    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,

} from 'recharts';

const data = [

    {
        name: 'Ramesh',
        trips: 45,
    },

    {
        name: 'Suresh',
        trips: 32,
    },

    {
        name: 'Mahesh',
        trips: 50,
    },

];

const DriverPerformanceChart = () => {

    return (

        <div className="bg-white rounded-xl shadow p-5 h-[400px]">

            <h2 className="text-xl font-bold mb-4">
                Driver Performance
            </h2>

            <ResponsiveContainer width="100%" height="100%">

                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="trips"
                        fill="#10B981"
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

};

export default DriverPerformanceChart;