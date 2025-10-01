import React from "react";

const proyectos = [
  {
    id: 1,
    titulo: "Programa de Educación Rural",
    img: "/images/img1.jpeg",
  },
  {
    id: 2,
    titulo: "Acceso a Agua Potable",
    img: "/images/img2.png",
  },
  {
    id: 3,
    titulo: "Construcción de Viviendas",
    img: "/images/img3.jpg",
  },
  {
    id: 4,
    titulo: "Huertas Comunitarias",
    img: "/images/img4.png",
  },
];

const Home: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a Project Planning
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Una plataforma para que ONGs gestionen proyectos comunitarios, 
          colaboren entre sí y generen impacto en barrios vulnerables.
        </p>
      </div>

      {/* Sección de proyectos */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-violet-700 flex items-center gap-2">
            <span>🏆</span>
            Últimos Proyectos Ejecutados
          </h2>
        </div>

        {/* Grid de proyectos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {proyectos.map((proyecto) => (
            <div
              key={proyecto.id}
              className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={proyecto.img}
                alt={proyecto.titulo}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg drop-shadow-lg">
                  {proyecto.titulo}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-xl p-8 mt-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          ¿Tienes un proyecto en mente?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Comienza a planificar tu próximo proyecto comunitario hoy mismo
        </p>
        <a
          href="/create-project"
          className="inline-block bg-white text-violet-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          ➕ Crear Nuevo Proyecto
        </a>
      </div>
    </div>
  );
};

export default Home;