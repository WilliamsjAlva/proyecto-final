const PrimaryButton = ({ text, onClick, type = "button", className = "", ...props }) => {
    return (
        <button
            type={type}
            className={`w-full bg-[#2f58e0] text-white py-2 px-4 rounded-full hover:bg-[#3c55b0] active:bg-[#273151] cursor-pointer transition ${className}`}
            onClick={onClick}
            {...props}
        >
            {text}
        </button>
    );
};

export default PrimaryButton;
