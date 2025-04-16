import { useNavigate } from "react-router-dom";

const PremiumPlans = () => {
    const navigate = useNavigate();

    const plans = [
        { label: "1 Mes", days: 30, amount: "999", price: "$9.99" },
        { label: "3 Meses", days: 90, amount: "2499", price: "$24.99" },
        { label: "6 Meses", days: 180, amount: "4499", price: "$44.99" },
        { label: "1 Año", days: 365, amount: "7999", price: "$79.99" },
    ];

    const handleSelectPlan = (plan) => {
        navigate("/selectpayment", { state: plan });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
                        Elige tu Plan Premium
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.label}
                                className="border border-[#CCCCCC] bg-[#FCFCFC] rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => handleSelectPlan(plan)}
                            >
                                <h3 className="text-xl font-semibold mb-2 text-center">{plan.label}</h3>
                                <p className="text-center text-gray-600">{plan.days} días de Premium</p>
                                <p className="text-center text-blue-600 font-bold mt-4">{plan.price} USD</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumPlans;