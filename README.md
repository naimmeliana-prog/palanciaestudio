# Palancia Estudio & Glam — CEIP Palancia (Algimia de Alfara)

Plataforma web educativa e interactiva diseñada para acompañar a una alumna desde **4º de Primaria hasta 6º de Primaria** en el **CEIP Palancia (Algimia de Alfara, València)**. Combina el aprendizaje estructurado del currículo oficial con una **aplicación de Maquillaje y Belleza en Realidad Aumentada (AR)** desbloqueable mediante un sistema de recompensas gestionado por su madre.

---

## Características Principales

1. **Temario Completo de 4º a 6º de Primaria (CEIP Palancia)**:
   - Asignaturas incluidas: **Matemáticas**, **Castellano: Lengua y Literatura**, **Valencià: Llengua i Literatura**, **Coneixement del Medi Natural, Social i Cultural**, **Inglés (English)** y **Educació Artística i Música**.
   - Cada asignatura incluye:
     - **Resumen y Apuntes Clave** adaptados a Primaria.
     - **Fórmulas Importantes** y **Trucos Mnemotécnicos** para memorizar fácilmente.
     - **Preguntas Trampa en Exámenes** con explicación del fallo común y cómo evitarlo.
     - **Preguntas Difíciles Recurrentes** explicadas paso a paso.
     - **Reto Rápido Autoevaluable** que otorga minutos extra de estudio al acertar.

2. **Sistema de Recompensas y Control Parental ("Zona Madre")**:
   - Fórmula matemática en tiempo real:
     $$\text{Tiempo de Juego} = (\text{Tiempo de Estudio} \times X) + \text{Bonificaciones} - \text{Tiempo Consumido}$$
   - **Acceso Seguro con Usuario y Contraseña**:
     - **Usuario por defecto**: `madre`
     - **Contraseña por defecto**: `palancia2026`
     - *(Personalizable desde el propio Panel Parental).*
   - La madre puede ajustar el factor multiplicador **X** (`0.25x` a `3.0x`), otorgar minutos extra, fijar un tope diario o activar el **Bloqueo Instantáneo**.
   - **Avisos Automáticos Pre-Bloqueo**: Notificaciones a los `5 min`, `2 min`, `1 min` y `15 s` antes de que la aplicación de maquillaje se bloquee automáticamente al llegar a `00:00`.
   - **Lanzador de Plataformas Escolares**: Acceso directo a **Aules GVA**, **ITACA Web Família 2.0**, **Google Classroom** y **PortalEdu CEIP Palancia**.

3. **Calendario Interactivo y Exportación a Google Calendar**:
   - Organización diaria de **Deberes**, **Exámenes**, **Proyectos** y **Sesiones de Estudio**.
   - Exportación directa mediante archivo estándar `.ics` (**Google Calendar / Apple Calendar / Outlook**) y enlaces rápidos individuales a Google Calendar.
   - Sistema de notificaciones push del navegador para recordar entregas pendientes.

4. **Estudio de Maquillaje y Belleza en Realidad Aumentada ("Palancia Glam Studio")**:
   - **3 Modos Integrados sin abrir páginas externas**:
     1. **Modelo Estudio HD**: Rostro vectorial multicapa con tonos de piel personalizables.
     2. **Cámara Selfie AR en Vivo**: Usa la cámara del dispositivo en tiempo real (`WebRTC`) para superponer el maquillaje AR y capturar selfies.
     3. **Usar Foto Mía**: Permite subir cualquier fotografía propia y ajustar los puntos faciales AR (ojos, pómulos, labios y escala).
   - **Tutoriales de Belleza AR Paso a Paso**: Guías interactivas integradas que aplican y resaltan cada zona facial en tiempo real.
   - **Galería Personal y Enlaces Directos para Redes Sociales**: Guarda combinaciones favoritas y compártelas por **WhatsApp**, **Telegram**, **Pinterest**, **X** o mediante enlace directo codificado (`?look=...`).

5. **Sincronización en Tiempo Real mediante Webhooks**:
   - Actualización instantánea de temarios, nuevas preguntas trampa o fechas de exámenes desde **Aules GVA / ITACA Web Família** sin recargar la aplicación.

---

## Estructura del Proyecto

```text
├── public/
│   └── favicon.svg                 # Favicon vectorial sin fondo a espacio completo
├── src/
│   ├── __tests__/
│   │   └── rewardEngine.test.ts    # Pruebas unitarias con Vitest
│   ├── components/
│   │   ├── CalendarPlanner.tsx     # Calendario interactivo + Exportación Google Calendar
│   │   ├── MakeupStudio.tsx        # Estudio de Maquillaje AR + Cámara + Tutoriales + Galería
│   │   ├── Navbar.tsx              # Navegación responsiva
│   │   ├── NotificationCenter.tsx  # Avisos push y alertas de tiempo restante
│   │   ├── ParentPortal.tsx        # Autenticación Madre + Factor X + Plataformas GVA + Webhooks
│   │   └── StudyHub.tsx            # Temario 4º-6º + Cronómetro + Preguntas Trampa y Difíciles
│   ├── data/
│   │   └── curriculumData.ts       # Contenidos completos de 4º a 6º de Primaria y tutoriales AR
│   ├── services/
│   │   └── webhookService.ts       # Servicio de sincronización en tiempo real por Webhooks
│   ├── types/
│   │   └── index.ts                # Tipado estricto TypeScript
│   ├── utils/
│   │   ├── calendarExport.ts       # Generador RFC 5545 (.ics) y URLs de Google Calendar
│   │   ├── rewardEngine.ts         # Motor matemático Estudio × Factor X y bloqueo
│   │   └── shareLook.ts            # Codificación URL y enlaces directos a redes sociales
│   ├── App.tsx                     # Estado global y coordinación de módulos
│   ├── index.css                   # Estilos globales con Tailwind CSS
│   └── main.tsx                    # Punto de entrada React 19 + Vite
├── vercel.json                     # Configuración lista para desplegar en Vercel
└── package.json
```

---

## Instalación, Ejecución y Pruebas Unitarias

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo (puerto 3000)
npm run dev

# 3. Ejecutar pruebas unitarias con Vitest
npm run test

# 4. Verificar tipado estricto TypeScript
npm run lint

# 5. Compilar para producción (GitHub / Vercel)
npm run build
```

---

## Despliegue en GitHub y Vercel

1. Sube este repositorio a **GitHub**.
2. Importa el repositorio en **[Vercel](https://vercel.com/new)**.
3. Vercel detectará automáticamente **Vite** (`Build Command: npm run build`, `Output Directory: dist`) y aplicará las reglas SPA definidas en `vercel.json`.
