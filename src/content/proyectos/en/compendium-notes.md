---
titulo: 'Compendium Notes'
resumen: 'Transcription and note-taking with privacy by design: everything runs in the browser, no backend, and API keys never leave your machine.'
area: 'full-stack'
estado: 'desplegado'
anio: 2025
rol: 'Personal project'
stack:
  - 'Astro'
  - 'React'
  - 'TypeScript'
  - 'Tailwind'
  - 'WebAssembly'
imagen: '../../../assets/img/portadas/compendium-notes.png'
imagenAlt: 'Compendium Notes project cover'
enlaces:
  demo: 'https://compendium-notes.vercel.app/'
orden: 2
---

An app that transcribes recordings and turns them into notes. One premise drove
the whole thing: **the recording must never leave the uploader's browser**.

## Privacy by design, not by policy

There is no backend. No database. No bucket where the audio ends up. Processing is
**100% client-side**, so the privacy promise doesn't rest on you trusting me — it
rests on there being nowhere to store it.

API keys follow a **BYOK** (bring your own key) scheme: the user supplies them,
they stay in the browser, and they never travel to a server of mine — because
there is no server of mine.

## The real problem: long files

Transcription APIs cap request size. A 90-minute lecture blows past it.

The fix was running **FFmpeg compiled to WebAssembly** inside the tab:

1. Split the audio into chunks that fit under the limit.
2. Compress each chunk, which cuts size a lot without losing intelligibility for
   spoken voice.
3. Transcribe them in order and stitch the results back together.

It's the same FFmpeg as always, running inside the browser. Nothing gets uploaded
just to be split.

Live at [compendium-notes.vercel.app](https://compendium-notes.vercel.app/).
