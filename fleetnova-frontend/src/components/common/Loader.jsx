const Loader = () => {

    return (

        <div className="flex items-center justify-center py-20">

            <div className="flex flex-col items-center gap-4">

                {/* Spinner */}

                <div
                    className="
                        w-16 h-16
                        border-4
                        border-blue-200
                        border-t-blue-900
                        rounded-full
                        animate-spin
                    "
                />

                {/* Text */}

                <p className="text-gray-600 text-lg font-medium">

                    Loading FleetNova...

                </p>

            </div>

        </div>

    );

};

export default Loader;