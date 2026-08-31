# Sistema de Gestión de Espacios de Trabajo y Reservas (Backend API)

API RESTful desarrollada con **Node.js**, **Express**, **TypeScript**, **PostgreSQL** y **Sequelize ORM** para la administración de usuarios, espacios de trabajo y reservaciones, incluyendo autenticación mediante **JWT**, control de acceso basado en roles (**RBAC**), validaciones de negocio, seeders y documentación interactiva con **Swagger (OpenAPI 3.0)**.

---

## 📋 Tabla de Contenidos

1. [Arquitectura y Tecnologías](#-arquitectura-y-tecnologías)
2. [Estructura de Ramas del Repositorio](#-estructura-de-ramas-del-repositorio)
3. [Requisitos Previos](#-requisitos-previos)
4. [Instalación y Configuración](#-instalación-y-configuración)
   - [Variables de Entorno](#variables-de-entorno)
   - [Instalación de Dependencias](#instalación-de-dependencias)
5. [Ejecución del Proyecto](#-ejecución-del-proyecto)
   - [Opción A: Ejecución con Docker (Recomendado)](#opción-a-ejecución-con-docker-recomendado)
   - [Opción B: Ejecución Local](#opción-b-ejecución-local)
6. [Ejecución de Seeders (Datos Iniciales)](#-ejecución-de-seeders-datos-iniciales)
7. [Documentación Swagger (API Docs)](#-documentación-swagger-api-docs)
8. [Roles y Permisos](#-roles-y-permisos)
9. [Resumen de Endpoints](#-resumen-de-endpoints)

---

## 🛠 Arquitectura y Tecnologías

- **Lenguaje / Entorno:** Node.js (v20+) & TypeScript
- **Framework Web:** Express.js 5.x
- **Base de Datos Relacional:** PostgreSQL 15
- **ORM:** Sequelize 6.x
- **Autenticación & Seguridad:** JSON Web Tokens (`jsonwebtoken`), encriptación de contraseñas con `bcrypt`
- **Contenedores:** Docker & Docker Compose
- **Documentación:** Swagger UI Express & Swagger JSDoc (OpenAPI 3.0)

---

## 🌿 Estructura de Ramas del Repositorio

El proyecto implementa el flujo de trabajo Git Flow con ramas independientes:

```text
main
│
develop
│
├── feature/authentication   --> Middlewares de autenticación JWT y autorización por roles
├── feature/users            --> CRUD completo de usuarios y validaciones
├── feature/workspaces       --> CRUD de espacios de trabajo y restricciones
├── feature/reservations     --> Gestión de reservas y validación de las 4 reglas de negocio
└── feature/seeders          --> Seeders de datos iniciales y script de ejecución
```

Todos los commits siguen el estándar **Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).

---

## 📦 Requisitos Previos

- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) instalados (para ejecución en contenedores).
- [Node.js](https://nodejs.org/) v18+ y npm (para ejecución en entorno local).
- [PostgreSQL](https://www.postgresql.org/) (opcional si se corre en entorno local sin Docker).

---

## ⚙ Instalación y Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (puedes tomar como base `.env.example`):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=docker_password
DB_NAME=test_db
JWT_SECRET=supersecretjwtkey
```

> **Nota:** Al usar Docker Compose, las variables de entorno de la base de datos se configuran automáticamente para conectar con el servicio `db` del contenedor.

### Instalación de Dependencias

```bash
npm install
```

---

## 🚀 Ejecución del Proyecto

### Opción A: Ejecución con Docker (Recomendado)

Inicia todos los servicios (Base de Datos PostgreSQL + Servidor Backend con live-reload):

```bash
docker-compose up --build
```

- **Backend API:** `http://localhost:3000`
- **Swagger Docs:** `http://localhost:3000/api-docs`
- **PostgreSQL Port:** `5433` (mapeado al `5432` interno)

Para detener los contenedores:
```bash
docker-compose down
```

---

### Opción B: Ejecución Local

1. Asegúrate de tener una base de datos PostgreSQL activa con los datos de tu `.env`.
2. Compila el código TypeScript:
   ```bash
   npm run build
   ```
3. Inicia el servidor en modo desarrollo (con recarga automática):
   ```bash
   npm run dev
   ```
4. O inicia en modo producción:
   ```bash
   npm start
   ```

---

## 🌱 Ejecución de Seeders (Datos Iniciales)

Los seeders cargan automáticamente datos esenciales para pruebas inmediatas.

### 1. Ejecución Automática
Al levantar el servidor con Docker o en desarrollo, Sequelize sincroniza los modelos y ejecuta `seedDatabase()` de forma transparente.

### 2. Ejecución Manual
Puedes ejecutar el seeder en cualquier momento con:
```bash
npm run seed
```

### 🔑 Credenciales y Datos Sembrados

#### Usuarios Iniciales:
| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| **`ADMIN`** | `admin@example.com` | `Admin123!` |
| **`USER`** | `user@example.com` | `User123!` |

#### Espacios de Trabajo Iniciales:
| ID | Nombre | Capacidad | Ubicación |
| :--- | :--- | :--- | :--- |
| **1** | Sala de Juntas Ejecutiva | 12 | Piso 2 - Edificio Principal |
| **2** | Oficina Privada 204 | 4 | Piso 2 - Ala Norte |
| **3** | Auditorio de Conferencias | 50 | Piso 1 - Zona Central |

---

## 📖 Documentación Swagger (API Docs)

Una vez iniciado el servidor, accede a la interfaz interactiva de Swagger:

🔗 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

Desde Swagger puedes:
1. Probar el endpoint `POST /api/users/login` con las credenciales de prueba.
2. Copiar el `token` JWT retornado.
3. Hacer clic en el botón **Authorize 🔓** en la parte superior derecha e ingresar el token como `Bearer <tu_token>`.
4. Probar todos los endpoints protegidos con permisos de `ADMIN` o `USER`.

---

## 🔒 Roles y Permisos

- **`ADMIN`:**
  - Gestión completa de Usuarios (crear, listar todos, obtener, modificar y eliminar).
  - Gestión completa de Espacios de Trabajo (crear, modificar y eliminar).
  - Visualización y gestión de todas las reservas del sistema.
- **`USER`:**
  - Consultar espacios de trabajo disponibles.
  - Crear reservas para sí mismo (el usuario se vincula mediante el token JWT autenticado).
  - Consultar sus propias reservas (`GET /api/reservations/my-reservations`).
  - Modificar o cancelar sus propias reservas.
  - Actualizar su propio perfil de usuario.

---

## 📌 Resumen de Endpoints

### 👤 Usuarios (`/api/users`)
- `POST /api/users` - Registrar nuevo usuario.
- `POST /api/users/login` - Iniciar sesión y obtener JWT.
- `GET /api/users` - Listar todos los usuarios *(Solo ADMIN)*.
- `GET /api/users/:id` - Obtener usuario por ID *(ADMIN o Propietario)*.
- `PUT /api/users/:id` - Actualizar usuario *(ADMIN o Propietario)*.
- `DELETE /api/users/:id` - Eliminar usuario *(Solo ADMIN)*.

### 🏢 Espacios de Trabajo (`/api/workspaces`)
- `GET /api/workspaces` - Listar espacios *(Autenticado)*.
- `GET /api/workspaces/:id` - Obtener espacio por ID *(Autenticado)*.
- `POST /api/workspaces` - Crear espacio *(Solo ADMIN)*.
- `PUT /api/workspaces/:id` - Actualizar espacio *(Solo ADMIN)*.
- `DELETE /api/workspaces/:id` - Eliminar espacio *(Solo ADMIN)*.

### 📅 Reservas (`/api/reservations`)
- `POST /api/reservations` - Crear reserva con validación de las 4 reglas de negocio *(Autenticado)*.
- `GET /api/reservations` - Listar todas las reservas *(Solo ADMIN)*.
- `GET /api/reservations/my-reservations` - Consultar mis reservas *(Autenticado)*.
- `GET /api/reservations/:id` - Obtener reserva por ID *(ADMIN o Propietario)*.
- `PUT /api/reservations/:id` - Modificar reserva *(ADMIN o Propietario)*.
- `DELETE /api/reservations/:id` - Eliminar reserva *(ADMIN o Propietario)*.
