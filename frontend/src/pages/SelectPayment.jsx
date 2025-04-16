import { useLocation, useNavigate } from "react-router-dom";

const SelectPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const plan = location.state;

    const handleUploadPayment = () => {
        navigate("/payment-form", { state: plan });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-10">
                    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
                        Métodos de Pago
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                        Selecciona un método para completar tu pago.
                    </p>
                    <div>
                        <button
                            onClick={handleUploadPayment}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md cursor-pointer text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Subir comprobante de pago
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectPayment;
