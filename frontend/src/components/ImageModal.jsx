// ImageModal.jsx
import React from "react";

const ImageModal = ({ src, onClose }) => {
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        >
            <img
                src={src}
                alt="Imagen ampliada"
                className="max-w-full max-h-full rounded"
                onClick={(e) => e.stopPropagation()} // Evita que el clic sobre la imagen cierre el modal
            />
        </div>
    );
};

export default ImageModal;
