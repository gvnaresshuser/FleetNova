import {

    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,

} from 'recharts';

const data = [

    {
        name: 'Active',
        value: 18,
    },

    {
        name: 'Inactive',
        value: 5,
    },

    {
        name: 'Maintenance',
        value: 7,
    },

];

const COLORS = [
    '#2563EB',
    '#F97316',
    '#10B981',
];

const VehicleStatusChart = () => {

    return (

        <div className="bg-white rounded-xl shadow p-5 h-[400px]">

            <h2 className="text-xl font-bold mb-4">
                Vehicle Status
            </h2>

            <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        outerRadius={120}
                        label
                    >

                        {data.map((entry, index) => (

                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />

                        ))}

                    </Pie>

                    <Tooltip />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

};

export default VehicleStatusChart;