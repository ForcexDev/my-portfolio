---
titulo: 'Cercasco'
resumen: 'Road safety for cyclists: sensors in a 3D-printed module that warn you with vibration when something comes up from behind.'
area: 'iot'
estado: 'desplegado'
anio: 2025
rol: 'Team prototype'
stack:
  - 'ESP32'
  - 'Arduino'
  - 'Flutter'
  - 'Firebase'
  - '3D design'
imagen: '../../../assets/img/portadas/cercasco.png'
imagenAlt: 'Cercasco project cover'
enlaces:
  demo: 'https://cercasco.vercel.app/'
orden: 4
---

A prototype that tells a cyclist a vehicle is coming up behind them, without having
to turn their head.

## Why vibration and not sound

On the street a beep competes with traffic, wind and headphones. Vibration competes
with nothing: it reaches the helmet and that is it. So the alerts are **haptic and
real-time**, not audible.

## The pieces

- **ESP32 and sensors.** They measure distance behind the rider and fire the alert
  when something enters the risk range.
- **3D-printed module.** We designed and printed the enclosure ourselves: it had to
  survive street vibration and mount on a real helmet without getting in the way.
- **Flutter app.** Settings, history and device status, on Android and iOS from one
  codebase.
- **Firebase** as the backend: sync and storage without standing up a server.

More at [cercasco.vercel.app](https://cercasco.vercel.app/).
