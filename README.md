# RiwiMediCare Plus - Medical Supply Request Management API

RESTful API developed with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **Sequelize ORM** for managing medical supply requests between clinics and warehouses. It includes **JWT** authentication, Role-Based Access Control (**RBAC**), business rule validations, database seeders, and interactive documentation via **Swagger (OpenAPI 3.0)**.

---

## 📋 Table of Contents

1. [Developer Information](#-developer-information)
2. [Technologies Used](#-technologies-used)
3. [Prerequisites](#-prerequisites)
4. [Installation Guide](#-installation-guide)
   - [Environment Variables](#environment-variables)
   - [Dependencies Installation](#dependencies-installation)
5. [Project Execution](#-project-execution)
   - [Docker Execution (Recommended)](#docker-execution-recommended)
   - [Local Execution](#local-execution)
6. [Seeders Execution (Test Data)](#-seeders-execution-test-data)
7. [Swagger Documentation](#-swagger-documentation)
8. [GitHub Repository](#-github-repository)

---

## 👤 Developer Information

- **Name:** yesid david palacio leal
- **Clan:** magdalena

---

## 🛠 Technologies Used

- **Language:** Node.js (v20+) & TypeScript
- **Web Framework:** Express.js 5.x
- **Relational Database:** PostgreSQL 15
- **ORM:** Sequelize 6.x
- **Security:** JSON Web Tokens (`jsonwebtoken`), password hashing (`bcrypt`)
- **Containers:** Docker & Docker Compose
- **Documentation:** Swagger UI Express & Swagger JSDoc

---

## 📦 Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for containerized execution).
- [Node.js](https://nodejs.org/) v18+ and npm (for local execution).
- [PostgreSQL](https://www.postgresql.org/) (if running locally without Docker).

---

## ⚙ Installation Guide

### Environment Variables

Create a `.env` file in the root of the project with the following configuration:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=docker_password
DB_NAME=test_db
JWT_SECRET=supersecretjwtkey
```

> **Note:** When using Docker Compose, the database environment variables automatically connect to the `db` service.

### Dependencies Installation

```bash
npm install
```

---

## 🚀 Project Execution

### Docker Execution (Recommended)

Start all services (PostgreSQL Database + Backend Server with live-reload):

```bash
docker-compose up --build
```

- **Backend API:** `http://localhost:3000`
- **Swagger Docs:** `http://localhost:3000/api-docs`
- **PostgreSQL Port:** `5434` (mapped to internal `5432`)

To stop the containers:
```bash
docker-compose down
```

---

### Local Execution

1. Ensure you have an active PostgreSQL database matching your `.env` credentials.
2. Compile the TypeScript code:
   ```bash
   npm run build
   ```
3. Start the server in development mode:
   ```bash
   npm run dev
   ```

---

## 🌱 Seeders Execution (Test Data)

The application automatically seeds the database on startup using `src/seeders/seed.ts`.

### 1. Manual Execution Example
To manually execute the seeders and load the JSON test data:
```bash
npm run seed
```

### 🔑 Initial Test Data

#### Users:
| Role | Username | Password |
| :--- | :--- | :--- |
| **`ADMIN`** | `admin` | `password123` |
| **`REQUEST_MANAGER`** | `manager1` | `password123` |

---

## 📖 Swagger Documentation

Access the interactive Swagger UI to explore and test all available endpoints:

🔗 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---

## 🔗 GitHub Repository

The public repository containing the full GitFlow history and all feature branches can be found here:

**[https://github.com/Hakus16/desempe-o-prueba](https://github.com/Hakus16/desempe-o-prueba)**
