import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Bienvenido a Project Planning </h2>
            <p className="text-gray-700">
                Una plataforma para que ONGs gestionen proyectos comunitarios, colaboren
                entre sí y generen impacto en barrios vulnerables.
            </p>
            {/* Me gustaria agregar un mockup de los ultimos proyectos ejecutados */}
        </div>
    );
};

export default Home;