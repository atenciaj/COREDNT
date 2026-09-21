# CORENDT — Gestión END

Aplicación web local para la **gestión de ensayos no destructivos (END)** de CORENDT Colombia S.A.S.:
órdenes de servicio, equipos, clientes, tarifario y los formularios de inspección de campo.

Funciona **100 % sin conexión**: es una app de un solo usuario que guarda todo en el navegador
(IndexedDB) y no depende de CDN ni de servidores externos.

---

## Qué puedes hacer con la aplicación

- **Órdenes de servicio** — registro, flujo de estados y trazabilidad de cada orden.
- **Formularios de inspección** — captura de datos de campo y generación de reportes (entre ellos los de
  tintas penetrantes / PT y los de inspección visual / VT).
- **Equipos y clientes** — base de equipos inspeccionados y de clientes atendidos.
- **Tarifario** — cálculo de precios con la regla `Precio = MAX(Base, APU × (1 + AIU))`.
- **Reportes y respaldo** — impresión de formularios, exportación de información y base de datos semilla
  para arrancar la aplicación con datos de ejemplo.

## Tecnologías

| Capa | Detalle |
|---|---|
| Interfaz | HTML + JavaScript (Vanilla JS, módulos en `window.NDT.*`), Bootstrap 5 + Icons y Chart.js **vendorizados** |
| Datos | IndexedDB (sin servidor de base de datos) |
| Offline | Service worker + `manifest.json` (se puede instalar en el equipo como app) |
| Pruebas | Playwright (`@playwright/test`) |

## Cómo ejecutarlo

> Importante: no abrir `index.html` con doble clic (protocolo `file://`). Siempre con un servidor local.

```bash
# opción 1 — servidor simple de Python (puerto 8091)
python -m http.server 8091
# luego abrir http://127.0.0.1:8091/index.html

# opción 2 — servidor de Node
npm run dev      # levanta http-server en el puerto 8080
```

## Pruebas automatizadas

```bash
npm test         # ejecuta las pruebas de guardado/impresión, entrada de datos y formularios
```

## Contenido del repositorio

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Aplicación principal (dashboard y módulos) |
| `FORMULARIOS REPORTES.html` | Formularios de campo y generación de reportes |
| `seed-database.html`, `seed-equipos.js` | Semilla de base de datos y carga de equipos de ejemplo |
| Auditoría e integridad: `audit.js`, `audit-v2.js`, `run-test.js`, `test_runner.html`, `test-integridad.html`, `playwright.config.js` | Verificación de integridad, auditorías y pruebas de interfaz |
| `sw.js`, `manifest.json` | Funcionamiento sin conexión e instalación como aplicación |
| `dev-server.js`, `clear-db.js` | Utilidades de desarrollo (servidor local y limpieza de la base de datos) |
| `diagrama-entidad-relacion.html`, `diagrama-flujo-orden-servicio.md` | Modelo de datos y flujo de una orden de servicio |
| `AGENTS.md` | Guía técnica del proyecto: stack, mapa de módulos y reglas de trabajo |
| `IMPLEMENTACION-INTEGRIDAD.md`, `REGLAS_AUDITORIA.md`, `REPORTE_AUDITORIA_INTEGRIDAD.md`, `VERIFICACION_FLUJO_CANONICO.md` | Documentación de auditoría, integridad y flujo canónico |
| `simat.pdf`, `2079. SW-GT-PT-R-2079 ...pdf`, `SW-CORTEVA-813-08-21 ...pdf` | Insumos técnicos de referencia de trabajos reales |
| `revit_export_macro.cs` | Macro de exportación desde Revit |

> **Nota:** el repositorio no incluye todavía las carpetas `js/` y `tests/` que menciona `AGENTS.md`
> (módulos, base de datos y pruebas). Sin ellas la aplicación no arranca completa: es una copia parcial.

## Documentación técnica

Antes de modificar precios, códigos o datos semilla, leer `AGENTS.md` y la documentación de dominio del
proyecto. Regla de oro del equipo: servir siempre con servidor local y no alterar la semilla sin subir su
versión.

## Autor y uso

Proyecto interno de **CORENDT Colombia S.A.S.** Desarrollado y mantenido por José Alfredo García Atencia.
Licencia ISC.
