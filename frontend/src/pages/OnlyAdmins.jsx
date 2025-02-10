const OnlyAdmins = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Página de Administradores</h1>
            <p>Esta página es accesible solo para usuarios con rol <strong>admin</strong>.</p>
        </div>
    );
};

export default OnlyAdmins;
