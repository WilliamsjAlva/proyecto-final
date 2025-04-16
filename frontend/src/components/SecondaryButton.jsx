/* eslint-disable */
const SecondaryButton = ({ text, onClick, type = "button", className = "", ...props }) => {
    return (
        <button
            type={type}
            className={`bg-transparent text-[#2f58e0] py-2 px-4 rounded-full border border-[#2f58e0] hover:border-[#3c55b0] active:border-[#273151] cursor-pointer transition ${className}`}
            onClick={onClick}
            {...props}
        >
            {text}
        </button>
    );
};

export default SecondaryButton;
