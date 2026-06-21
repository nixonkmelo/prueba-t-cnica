# Prueba Técnica

## Sistema de Monitoreo y Telemetría de Flotas GPS

Es un prototipo funcional de un sistema de monitoreo y telemetría de flotas GPS, el cual recibe coordenadas de vehículos, calcula su estado en tiempo real y los muestra en una página web con un mapa interactivo.

**Repositorio** https://github.com/nixonkmelo/prueba-t-cnica.git

**Video** https://youtu.be/r9QTeRdDyUg

## ¿Cómo corre el proyecto?

Es un sistema que se divide en tres partes independientes y cada una corre en su propia terminal.

### Backend

El comando para ejecutar el Backend es:

```bash
node index.js
```

Después de estar dentro de la carpeta del Backend y haber instalado las dependencias.

Queda corriendo en el puerto **3000**.

### Frontend

El comando para ejecutar el Frontend es:

```bash
npm run dev
```

Después de estar dentro de la carpeta del Frontend y haber instalado las dependencias.

Queda corriendo en el puerto **5173**.

### Simulador

El comando para ejecutar el simulador es:

```bash
node simulador.js
```

Después de estar dentro de la carpeta del simulador y haber instalado las dependencias.

Envía las coordenadas automáticamente cada 4 segundos.

## Arquitectura

El proyecto sigue una arquitectura cliente-servidor de tres capas independientes, utilizando una API REST como medio de comunicación. El Backend expone los recursos mediante URLs y verbos HTTP como **POST**, **GET** y **DELETE**, respondiendo con sus respectivos códigos HTTP en formato JSON.

En el Backend se utilizaron herramientas como **Node.js** y **Express**, lo que permite utilizar JavaScript tanto en el Backend como en el Frontend. Express es uno de los frameworks más directos para construir una API REST sin configuraciones adicionales.

### ¿Por qué se almacenó la información en memoria utilizando un Map y no una base de datos?

* No requiere instalaciones ni configuración de infraestructura adicional, lo que redujo el tiempo necesario para desarrollar la prueba técnica.
* El alcance del proyecto es un prototipo de evaluación y no un sistema destinado a utilizarse en un entorno laboral o de producción, por lo que mantener los datos después de reiniciar el sistema no era un requisito obligatorio.
* El almacenamiento en memoria mediante un `Map` es más rápido que realizar operaciones sobre una base de datos.

Para el Frontend utilicé **React**, ya que es una de las tecnologías más utilizadas para construir interfaces interactivas y coincide con el stack tecnológico de la empresa.

Utilicé **Polling** para que el sistema se actualice automáticamente cada 5 segundos, ya que es una solución simple y confiable que permite visualizar las actualizaciones en pocos segundos.

### Alternativas como WebSockets o SSE

Estas tecnologías permiten enviar información al cliente de manera instantánea cuando ocurre un cambio. Aunque esto puede ser útil, también implica una implementación más compleja y requiere mantener una conexión permanente con el cliente.

Con **Polling**, si la conexión con el cliente se pierde, una vez que se restablece se vuelven a realizar las peticiones HTTP normalmente y las conexiones se cierran inmediatamente después de cada respuesta.

Utilicé **Leaflet** porque es gratuito, no requiere una API Key y se integra fácilmente con React.

En el simulador se utiliza un script que se ejecuta por separado y simula el comportamiento de tres vehículos que envían coordenadas reales al Backend. Decidí implementar el simulador como un componente independiente porque representa un escenario más cercano a la realidad, donde los vehículos envían su ubicación mediante GPS desde sistemas externos al Backend y al Frontend.

## Pregunta de reflexión

### Si en un sistema real existiera tanto un caché (Redis) como una base de datos persistente, ¿qué deberías garantizar al eliminar un vehículo para evitar inconsistencias entre ambos?

Se debe garantizar que la eliminación se realice de forma consistente en ambos sistemas. Lo ideal es eliminar primero el vehículo de la base de datos y posteriormente invalidar o actualizar el caché para evitar que Redis continúe devolviendo información que ya no existe en la fuente de datos principal. De esta manera, ambos sistemas mantienen el mismo estado y se evitan inconsistencias.

## Reporte de IA

### ¿Qué herramientas de IA usaste?

Como apoyo para desarrollar el proyecto utilicé **Claude**.

### ¿Para qué tareas específicas te apoyaste en la IA?

* Corrección de errores de sintaxis.
* Comprensión de conceptos nuevos como `useEffect` y **Leaflet**.
* Generación de fragmentos de código, como fórmulas matemáticas, implementación de Polling e importación de Leaflet para el mapa.

### ¿Qué error de la IA encontraste y cómo lo corregiste?

Durante la implementación del mapa, la IA importó `MapContainer` con una nomenclatura diferente a la utilizada en el código, lo que impedía que la aplicación mostrara el mapa correctamente.

La solución fue corregir el nombre para que coincidiera exactamente con el componente utilizado en la aplicación, permitiendo así que el mapa se renderizara de forma correcta.
