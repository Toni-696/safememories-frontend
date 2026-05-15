# SafeMemories - Frontend React

## Descripción del proyecto

SafeMemories es una aplicación web orientada al almacenamiento, organización y compartición privada de imágenes y vídeos.  
El frontend de la aplicación ha sido desarrollado utilizando React y Vite, permitiendo crear una interfaz moderna, dinámica y desacoplada del backend.

La aplicación consume una API REST desarrollada con Spring Boot, encargándose de gestionar la interacción del usuario con el sistema mediante peticiones HTTP seguras utilizando autenticación basada en JWT.

El objetivo principal de SafeMemories es ofrecer un sistema donde los usuarios puedan compartir recuerdos digitales manteniendo el control sobre quién puede visualizar y descargar el contenido multimedia.

A diferencia de otras plataformas similares, compartir una carpeta no implica automáticamente permitir la descarga de los archivos. El propietario mantiene el control sobre los permisos de descarga mediante un sistema de solicitudes y autorizaciones.

---

# Tecnologías utilizadas

## React

React se ha utilizado como librería principal para construir toda la interfaz de usuario mediante componentes reutilizables.  
Gracias al uso de React, la aplicación funciona de manera dinámica sin necesidad de recargar continuamente la página, mejorando la experiencia de usuario.

---

## Vite

Vite se ha utilizado como entorno de desarrollo y compilación del proyecto React.  
Permite iniciar el entorno frontend de forma rápida y optimizada, facilitando el desarrollo y las pruebas durante la implementación.

---

## JavaScript

JavaScript ha sido el lenguaje principal utilizado para desarrollar toda la lógica del frontend, gestionar estados, llamadas al backend y control de interacción de la aplicación.

---

## HTML5

HTML5 se ha utilizado para estructurar los distintos componentes visuales y formularios de la aplicación.

---

## CSS3

CSS3 se ha utilizado para diseñar la apariencia visual del proyecto, incluyendo layouts, botones, tarjetas, galerías de imágenes, formularios y efectos visuales.

---

## Fetch API

La comunicación con el backend se realiza mediante Fetch API, enviando peticiones HTTP al servidor Spring Boot y procesando las respuestas JSON recibidas.

---

# Arquitectura del frontend

El frontend se encuentra estructurado mediante componentes independientes y reutilizables, facilitando la organización del código y el mantenimiento de la aplicación.

El componente principal es:


App.jsx

---
---

# Estructura y componentes del frontend

## App.jsx

Es el componente principal de la aplicación y actúa como núcleo central del frontend.  
Gestiona el estado global de la sesión del usuario, el almacenamiento del token JWT, la comunicación principal con el backend y el control general de carpetas, archivos, permisos y solicitudes. También se encarga de mostrar dinámicamente los distintos componentes según el estado de la aplicación.

---

## Login.jsx

Componente encargado del inicio de sesión de usuarios.  
Recoge las credenciales introducidas por el usuario y realiza la petición al backend para autenticarlo mediante JWT.

---

## Registro.jsx

Gestiona el registro de nuevos usuarios en la plataforma.  
Permite introducir nombre, email y contraseña, enviando los datos al backend para crear la nueva cuenta.

---

## Carpetas.jsx

Muestra y administra las carpetas propias del usuario autenticado.  
Permite crear, renombrar, eliminar y compartir carpetas, además de acceder a los archivos contenidos en ellas.

---

## Archivos.jsx

Componente encargado de visualizar y gestionar los archivos multimedia del usuario.  
Incluye funcionalidades para subir archivos, descargarlos, renombrarlos, eliminarlos, moverlos entre carpetas y compartirlos.

---

## ImagenProtegida.jsx

Componente especializado en mostrar imágenes protegidas mediante autenticación JWT.  
Realiza una petición fetch al backend enviando el token de autorización, recibe el archivo como blob y genera una URL temporal para poder visualizar la imagen de forma segura.

---

## CarpetasCompartidas.jsx

Muestra las carpetas que otros usuarios han compartido con el usuario autenticado.  
Permite acceder a los archivos compartidos y visualizar su contenido.

---

## ArchivosCarpetaCompartida.jsx

Visualiza los archivos pertenecientes a carpetas compartidas.  
El usuario puede visualizar las imágenes y seleccionar archivos para solicitar permisos de descarga al propietario.

---

## SolicitudesRecibidas.jsx

Componente utilizado por el propietario de los archivos para gestionar solicitudes de descarga recibidas.  
Permite aceptar o rechazar solicitudes realizadas por otros usuarios.

---

## SolicitudesEnviadas.jsx

Muestra al usuario las solicitudes de descarga que ha enviado.  
Permite consultar el estado de cada solicitud y descargar archivos cuando los permisos han sido aceptados.

---

## Perfil / menú de usuario

Zona de la aplicación donde el usuario puede modificar sus datos personales, cambiar la contraseña y desactivar su cuenta.