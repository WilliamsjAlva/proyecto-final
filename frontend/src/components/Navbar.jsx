import { useState } from "react";
import logo from "../assets/Logo.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <nav className="bg-white shadow-md fixed w-full z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <a href="#" className="flex items-center">
                        <img src={logo} alt="logo" className="w-32" />
                    </a>
                    <div className="hidden md:flex space-x-4">
                        <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
                        <a href="#" className="text-gray-700 hover:text-blue-600">Features</a>
                        <a href="#" className="text-gray-700 hover:text-blue-600">Pricing</a>
                        <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
                    </div>
                    <button
                        className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out md:hidden`}
            >
                <div className="bg-white w-64 h-full shadow-lg py-6 px-4">
                    <button
                        className="text-gray-700 hover:text-blue-600 focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <nav className="mt-8 space-y-4">
                        <a href="#" className="block text-gray-700 hover:text-blue-600">Home</a>
                        <a href="#" className="block text-gray-700 hover:text-blue-600">Features</a>
                        <a href="#" className="block text-gray-700 hover:text-blue-600">Pricing</a>
                        <a href="#" className="block text-gray-700 hover:text-blue-600">Contact</a>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
