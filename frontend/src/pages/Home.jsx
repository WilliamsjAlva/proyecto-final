import '../styles/text.css';
import { Link } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import ilu1 from "../assets/ilustration1.gif";
import ilu2 from "../assets/ilustration2.gif";
import ilu3 from "../assets/ilustration3.gif";

const Home = () => {
    return (
        <div className="grid grid-cols-1 gap-6 gap-y-16 p-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <div className="p-6 col-span-1">
                <h1 className="h1Web">Todas las respuestas a tus preguntas en un solo lugar</h1>
                <p className="pWeb mb-4">Encuentra todas las respuestas a tus preguntas. Gestiona problemas y soluciones de manera rápida y sencilla. ¡Empieza hoy!</p>
                <Link to="/feed" className="pWeb mr-1">
                    <PrimaryButton text="Empieza ya" />
                </Link>
            </div>
            <div className="col-span-1">
                <img src={ilu1} alt="ilu1" className="w-96" />
            </div>
            <div className="col-span-1">
                <img src={ilu2} alt="ilu2" className="w-96" />
            </div>
            <div className="col-span-1">
                <h2 className="h1Web mb-4">Gestión de tickets simplificada</h2>
                <p className="pweb mb-4">Registra y organiza tickets de manera eficiente. Los usuarios pueden registrar problemas y los administradores pueden revisar y gestionar esos tickets.</p>
            </div>
            <div className="col-span-1">
                <h2 className="h1Web mb-4">Privacidad a tu medida</h2>
                <p className="pweb mb-4">Decide si tu reporte es público, anónimo o privado. Tú tienes el control total sobre la visibilidad de tu información.</p>
            </div>
            <div className="col-span-1">
                <img src={ilu3} alt="ilu3" className="w-96" />
            </div>
        </div>
    );
};

export default Home;
