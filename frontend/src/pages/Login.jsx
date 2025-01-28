import profileIcon from "../assets/profileIcon.png";
import PrimaryButton from "../components/PrimaryButton";
import FormInput from "../components/FormInput";

const Login = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
                {/* Ícono de perfil */}
                <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 flex items-center justify-center">
                        <img src={profileIcon} alt="profile" className="w-24 h-24 rounded-full" />
                    </div>
                </div>
                {/* Mensaje de bienvenida */}
                <h2 className="h2web text-center mb-2">¡Bienvenido de nuevo!</h2>
                <p className="text-sm text-gray-600 text-center mb-6">¡Ingresa tus datos!</p>
                {/* Formulario */}
                <form className="space-y-4">
                    {/* Campo de Nombre de Usuario */}
                    <FormInput
                        type="text"
                        id="username"
                        placeholder="Nombre de Usuario"
                    />
                    
                    {/* Campo de Contraseña */}
                    <FormInput
                        type="password"
                        id="password"
                        placeholder="Contraseña"
                    />
                    
                    {/* Recuérdame */}
                    <div className="flex items-center">
                        <input id="remember" type="checkbox" className="h-4 w-4 rounded-full" />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-700">Recuérdame</label>
                    </div>
                    
                    {/* Botón primario */}
                    <PrimaryButton text="Iniciar sesión" type="submit" />
                </form>
            </div>
        </div>
    );
};

export default Login;
