# MedLoc

**Medicamentos a tu disposición.**
Plataforma web para localizar medicamentos esenciales en droguerías y farmacias cercanas, consultar su disponibilidad y reservarlos antes de salir de casa.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![Estado](https://img.shields.io/badge/estado-interfaces_(sin_backend)-orange)

---

## Tabla de contenidos

- [Descripción](#descripción)
- [Estado del proyecto](#estado-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Inicio rápido](#inicio-rápido)
- [Cuentas de prueba](#cuentas-de-prueba)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Hoja de ruta](#hoja-de-ruta)
- [Contribución](#contribución)
- [Equipo](#equipo)

---

## Descripción

En Colombia es frecuente que un paciente deba recorrer varias droguerías para encontrar un medicamento específico, por desabastecimientos puntuales o fallas en la cadena de suministro. La información de inventario está fragmentada y no es visible para quien la necesita con urgencia.

**MedLoc** centraliza el inventario de droguerías independientes en una sola plataforma. El usuario busca un medicamento, ve qué droguerías cercanas lo tienen, compara distancia, precio y calificación, y lo aparta por un tiempo limitado.

**Piloto:** red de droguerías independientes de Calarcá, Armenia y municipios cercanos del Quindío.

## Estado del proyecto

Este repositorio contiene actualmente el **frontend** de MedLoc: todas las interfaces están construidas y funcionan con **datos de ejemplo** (archivos `.js` dentro de cada página). Aún **no hay backend ni base de datos**: la autenticación, el inventario y las reservas se simulan en memoria y se pierden al recargar la página.

## Funcionalidades

### Público (sin cuenta)
- Búsqueda por nombre comercial o principio activo.
- Resultados ordenados por cercanía o por calificación, con radio configurable (2, 5 o 10 km).
- Visualización en **lista** o en **mapa** (OpenStreetMap).
- Detalle de cada droguería: dirección, horario, servicios y reseñas.

### Paciente
- Registro e inicio de sesión.
- Reserva de medicamentos con código de retiro y tiempo límite de 2 horas.
- **Mis reservas**: reservas activas e historial, cancelación y calificación de la droguería.
- **Favoritos y alertas**: aviso cuando un medicamento vuelva a estar disponible.
- Edición de perfil y preferencias de notificación.

### Administrador de farmacia
- **Dashboard** con ventas, reservas pendientes, alertas de stock y calificación.
- **Inventario**: búsqueda, filtros por categoría y estado de stock (disponible, bajo, agotado).
- **Punto de venta**: catálogo, carrito y cobro.
- **Reservas**: verificación del código de retiro y confirmación de entrega.
- **Calificaciones**: promedio, distribución por estrellas y respuesta a reseñas.
- Perfil de la droguería: datos, horario, ubicación y servicio a domicilio.

### Transversal
- Rutas protegidas por rol (paciente / administrador).
- Menú lateral y notificaciones según el rol.
- Diseño adaptable a pantallas pequeñas.

## Tecnologías

| Área | Herramienta |
| --- | --- |
| Interfaz | React 19 |
| Empaquetado | Vite 8 |
| Estilos | CSS por componente + Tailwind CSS 4 |
| Mapas | Leaflet + OpenStreetMap |
| Calidad | ESLint |
| Contenedores | Docker y Docker Compose |

## Inicio rápido

### Requisitos

- [Node.js](https://nodejs.org/) 20.19 o superior (recomendado 22)
- [Git](https://git-scm.com/)
- Opcional: [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Opción A: con Node

```bash
git clone <url-del-repositorio>
cd MedLoc
npm install
npm run dev
```

Abre `http://localhost:5173`.

### Opción B: con Docker

No necesitas instalar Node.

```bash
git clone <url-del-repositorio>
cd MedLoc
docker compose up --build
```

Abre `http://localhost:5173`. Los cambios en el código se reflejan automáticamente.

Para probar la versión de producción (compilada y servida con nginx):

```bash
docker compose --profile prod up --build medloc-prod
```

Abre `http://localhost:8080`.

### Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación para producción |
| `npm run preview` | Vista previa de la compilación |
| `npm run lint` | Revisión de código con ESLint |

## Cuentas de prueba

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador de farmacia | `admin@medloc.com` | `Admin123` |
| Paciente | `paciente@medloc.com` | `Paciente123` |

> Para ver resultados en el buscador usa **"Ubicación de ejemplo (Armenia)"**: los datos de prueba están en el Quindío.

## Estructura del proyecto

```
src/
├── components/        Componentes reutilizables
│   ├── badge/         Etiquetas de estado
│   ├── button/        Botones
│   ├── formfield/     Campos de formulario
│   ├── header/        Cabecera con perfil y notificaciones
│   ├── medmap/        Mapa de droguerías
│   ├── modal/         Ventanas emergentes
│   ├── notifications/ Campana de notificaciones
│   ├── searchbar/     Barra de búsqueda
│   ├── sidebar/       Menú lateral por rol
│   ├── starrating/    Calificación con estrellas
│   ├── statcard/      Tarjetas de indicadores
│   ├── tabs/          Pestañas
│   └── toggle/        Interruptores
├── hooks/             Hooks compartidos (rutas)
├── pages/             Una carpeta por página (.jsx, .css y .js con sus datos)
│   ├── landing/       Página inicial: búsqueda, login y registro
│   ├── dashboard/     Panel del administrador
│   ├── inventory/     Inventario
│   ├── sales/         Punto de venta
│   ├── reservations/  Reservas recibidas (administrador)
│   ├── reviews/       Calificaciones recibidas (administrador)
│   ├── myreservations/ Mis reservas (paciente)
│   ├── favorites/     Favoritos y alertas (paciente)
│   └── profile/       Perfil
├── services/          Utilidades y datos de ejemplo
├── App.jsx            Rutas y control de acceso por rol
└── main.jsx           Punto de entrada
```

Cada página sigue la misma convención: `Pagina.jsx` (vista), `Pagina.css` (estilos) y `usePagina.js` (datos de ejemplo y estado de la interfaz).

## Hoja de ruta

El plan completo está en la documentación del proyecto. Resumen de lo que sigue:

- [x] **Fase 0:** interfaces del frontend con datos de ejemplo.
- [ ] **Fase 1:** autenticación real (JWT), roles y base de datos relacional en PostgreSQL.
- [ ] **Fase 2:** catálogo de medicamentos (vademécum) y búsqueda geoespacial.
- [ ] **Fase 3:** gestión de inventarios con actualización asíncrona (RabbitMQ).
- [ ] **Fase 4:** reservas reales, pruebas de calidad y despliegue en AWS.

**Arquitectura prevista del backend:** microservicios con Java y Spring Boot, PostgreSQL, RabbitMQ, contenedores Docker, CI/CD con Jenkins o GitHub Actions, y análisis de calidad con SonarQube y JaCoCo.

## Contribución

1. Crea una rama desde `main`: `git checkout -b feature/nombre-de-la-mejora`
2. Haz tus cambios y revisa el código con `npm run lint`.
3. Haz commit con un mensaje claro y sube la rama.
4. Abre un Pull Request para que otro integrante lo revise antes de unirlo a `main`.

## Equipo

Proyecto desarrollado por el equipo de MedLoc para la asignatura de Administración de Proyectos (semestre 2026-2).

| Rol | Integrante |
| --- | --- |
| Project Manager / Scrum Master | _por completar_ |
| Arquitecto Backend / Líder Técnico | _por completar_ |
| Desarrollador Frontend / QA | _por completar_ |
| Ingeniero Cloud / DevOps | _por completar_ |
