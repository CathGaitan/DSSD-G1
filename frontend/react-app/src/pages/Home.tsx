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

const Home = () => {
  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Bienvenido a Project Planning
      </h2>
      <p className="text-gray-700 mb-8">
        Una plataforma para que ONGs gestionen proyectos comunitarios, colaboren
        entre sí y generen impacto en barrios vulnerables.
      </p>

      <h3 className="text-xl font-semibold mb-4 text-blue-700">
        Últimos Proyectos Ejecutados
      </h3>

      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {proyectos.map((proyecto) => (
          <div
            key={proyecto.id}
            className="relative overflow-hidden rounded-lg shadow-md group"
          >
            <img
              src={proyecto.img}
              alt={proyecto.titulo}
              className="w-full h-56 object-cover transform transition duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white py-2 px-3 text-sm">
              {proyecto.titulo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
