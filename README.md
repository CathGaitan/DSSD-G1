<a id="readme-top"></a>
[![React][React.js]][React-url]
[![Python][Python.py]][Python-url]
[![FastAPI][FastAPI.api]][FastAPI-url]
[![PostgreSQL][PostgreSQL.db]][PostgreSQL-url]
[![Bonita][Bonita.bpm]][Bonita-url]
[![Java][Java.java]][Java-url]
[![Docker][Docker.container]][Docker-url]

  <h1 align="center">Project Planning</h1>

  <p align="center">
    Grupo 1 - Conti Augusto, Gaitan Catalina, Garcia Camila. Desarrollo de Software de Sistemas Distribuidos UNLP.
    <br />
    <a href="https://dssd-g1.onrender.com">API cloud (Render)</a>
    &middot;
  </p>
</div>


<!-- ABOUT THE PROJECT -->
## Acerca del projecto

![Product Name Screen Shot][product-screenshot]

Project planning es una solucion de software para ayudar a multiples ONGs a encontrar colaboradores para sus proyectos o gestionar sus propias tareas.
Funcionalidades:
* Registro y login de usuarios
* Crear un proyecto con sus respectivas tareas, aclarando necesidades, tiempos de ejecucion, responsables. 
* Envio y visualizaciòn de las tareas que requieran colaboracion de otras organizaciones
* Permitir a organizaciones enviar sus compromisos de ayuda a las tareas colaborativas
* Permitir decidir a las ONGs encargadas que compromisos aceptan para sus proyectos

## Estructura y arquitectura
```
.
├── backend
│   ├── app
│   ├── Dockerfile
│   └── requirements.txt
├── cloud
│   ├── app
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   └── react-app
├── modelado
│   ├── modelo_bonita.bos
│   ├── ...
├── package.json
├── package-lock.json
└── README.md
```

<!-- GETTING STARTED -->
## Getting Started

A continuacion se proporcionaran las instrucciones para poder correr localmente el backend local, el frontend y las bases de datos.

### Pre-requisitos
Tener instalado [Docker](https://www.docker.com/) y [Bonita Software](https://www.bonitasoft.com/es)

### Installation
1. Clonar el repositorio
   ```sh
   git clone https://github.com/CathGaitan/DSSD-G1
   ```
2. Crear en la raiz del proyecto el .env con las siguientes variables de entorno (rellenar con los datos proporcionados)
    ```env
    POSTGRES_USER=...
    POSTGRES_PASSWORD=...
    POSTGRES_DB=...
    DATABASE_URL=...
    BONITA_URL=...
    DATABASE_CLOUD_URL=...
    SECRET_KEY_CLOUD=...
    SECRET_KEY_LOCAL=...
    USERS_PASSWORD=...
    ```
3. Ubicarse en la raiz del proyecto, y ejecutar:
   ```sh
   docker compose up
   ```
5. Abrir Bonita software, importar el modelo (archivo con extension .bos) y el proceso "Gestion de Proyectos" (RUN)
6. Si quiere ejecutar los respectivos seeds:
   ```sh
   # Para el contenedor de backend local
   docker exec fastapi_backend python /app/app/seeds/seeds.py
   # Para el contenedor de backend cloud (testing)
   docker exec fastapi_cloud python /app/app/seeds/seeds.py
   ```
   

<p align="right">(<a href="#readme-top">Volver arriba</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Python.py]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/
[FastAPI.api]: https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white
[FastAPI-url]: https://fastapi.tiangolo.com/
[PostgreSQL.db]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Bonita.bpm]: https://img.shields.io/badge/Bonita-DD1F26?style=for-the-badge
[Bonita-url]: https://www.bonitasoft.com/
[Java.java]: https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white
[Java-url]: https://www.java.com/
[Docker.container]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[product-screenshot]: https://github.com/user-attachments/assets/149c2c65-e62b-4f2e-8e12-d54a4d69bff7
