import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ScreenshotViewer = () => {
    const { imageUrl } = useParams();
    const navigate = useNavigate();

    const decodedUrl = decodeURIComponent(imageUrl);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
                Volver
            </button>
            <div className="border border-gray-600 rounded-lg overflow-hidden shadow-lg bg-white">
                {decodedUrl ? (
                    <img
                        src={decodedUrl}
                        alt="Comprobante de pago"
                        className="max-w-full max-h-screen object-contain"
                        onError={(e) => e.target.src = "https://dummyimage.com/600x400/ccc/000.png&text=Image+Not+Found"}
                    />
                ) : (
                    <p className="text-white">No se pudo cargar la imagen</p>
                )}
            </div>
        </div>
    );
};

export default ScreenshotViewer;