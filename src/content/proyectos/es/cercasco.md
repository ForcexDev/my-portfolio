---
titulo: 'Cercasco'
resumen: 'Seguridad vial para ciclistas: sensores en un módulo impreso en 3D que avisan con vibración cuando algo se acerca por detrás.'
area: 'iot'
estado: 'desplegado'
anio: 2025
rol: 'Prototipo en equipo'
stack:
  - 'ESP32'
  - 'Arduino'
  - 'Flutter'
  - 'Firebase'
  - 'Diseño 3D'
imagen: '../../../assets/img/portadas/cercasco.png'
imagenAlt: 'Portada del proyecto Cercasco'
enlaces:
  demo: 'https://cercasco.vercel.app/'
orden: 4
---

Un prototipo para que un ciclista sepa que un vehículo se le acerca por detrás sin
tener que girar la cabeza.

## Por qué vibración y no sonido

En la calle un pitido compite con el tráfico, el viento y los audífonos. La
vibración no compite con nada: llega al casco y ya está. Por eso las alertas son
**hápticas y en tiempo real**, no sonoras.

## Las piezas

- **ESP32 y sensores.** Miden la distancia por detrás y disparan la alerta cuando
  algo entra en el rango de riesgo.
- **Módulo impreso en 3D.** La carcasa la diseñamos e imprimimos nosotros: tenía que
  aguantar el bote de la calle y montarse en un casco real sin estorbar.
- **App en Flutter.** Configuración, historial y estado del dispositivo, en Android e
  iOS con la misma base de código.
- **Firebase** como backend: sincronización y almacenamiento sin montar servidor.

Más información en [cercasco.vercel.app](https://cercasco.vercel.app/).
