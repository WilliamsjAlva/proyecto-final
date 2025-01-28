const FormInput = ({ type = "text", placeholder = "", id, className = "", ...props }) => {
    return (
        <input
            type={type}
            id={id}
            placeholder={placeholder}
            className={`p-2 block w-full rounded-full border-[1px] border-gray-300 shadow-sm ${className}`}
            {...props} //para pasar cualquier otra prop, como onChange, value, etc.
        />
    );
};

export default FormInput;
