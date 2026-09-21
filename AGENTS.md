# CORENDT — Gestión END (agentes)

App local de un solo usuario para CORENDT Colombia S.A.S. (Ensayos No Destructivos).
Detalle de dominio: `dominio-skill/SKILL.md` (leerlo antes de tocar precios, códigos o semilla).

## Stack y ejecución
- Vanilla JS (IIFE `window.NDT.*`), IndexedDB (`js/db.js`), Bootstrap 5 + Icons + Chart.js **vendorizados**. Sin CDN, 100% offline.
- Servir SIEMPRE con servidor local (nunca `file://`):
  `python -m http.server 8091` desde la raíz → `http://127.0.0.1:8091/index.html`
- Smoke: `node tests/smoke-baseline.js` (Playwright en `G:/aplicacion reportes/node_modules`). Debe quedar **45/45, 0 errores**.

## Mapa de módulos (`js/`)
| Módulo | Archivo | Notas |
|---|---|---|
| Orquestador | `app.js` | `init()` (initDB → semilla → inits), `navigate()` repinta sección; re-render final anti-carrera |
| BD | `db.js` | `saveSwellItem/getSwellItems/getSwellItem/deleteSwellItem`, `getSwellNextConsecutive`, `getDB` exportado. Stores `swell_*` |
| Semilla | `seed-correndt.js` | `SEED_KEY` versionada; solo rellena vacío + migraciones. **Subir versión al cambiar datos** |
| Tarifario/AIU | `gestion_tarifario.js` + `data/tarifario.json` | Precio = MAX(Base, APU×(1+AIU)); construye su propio HTML en `render()` |
| Propuestas | `gestion_propuestas.js` | Base editable por ítem, impuestos, PDF/imprimir, convertir a OT |
| Visitas | `gestion_visitas.js` | Kanban + lista, estados en `data/estados_visita.json` |
| Documentación | `gestion_procedimientos.js` | Se pinta en 2 secciones: vaciar la otra (`KNOWN_CONTAINERS`); Tipo derivado del código |
| Clientes/Equipos/Calibraciones/Órdenes/Reportes/Forms/Indicadores/Dashboard/Backup/pdf/utils | `gestion_*.js`, `pt|mt|ut|vt_form.js`, `dashboard.js`, `pdf.js` | Ver SKILL para reglas |

## Reglas (incumplirlas ya rompió la app antes)
1. **IDs únicos en todo el DOM**: un módulo en 2 secciones debe vaciar la inactiva.
2. **Selects cruzados siempre frescos**: recargar de BD en `render()` y al abrir el modal.
3. **Gráficos con `safeChart()`**, nunca `new Chart` directo.
4. **Navegación solo vía `App.navigate()`** (`NDT.router` no existe).
5. **Campos calculados**: `total_final` en propuestas, `total_cop` es legado (dashboard acepta ambos).
6. **Precios**: no inventar tarifas; nuevos servicios con base 0 hasta que el usuario los defina.
7. **Encoding**: archivos UTF-8 sin BOM; verificar balance de llaves en `css/styles.css` si el layout "desaparece" (hubo una llave sin cerrar en `.ndt-item`).
8. PowerShell 5.1: sin `&&` (usar `;`), rutas con espacios entre comillas.
9. No commits sin pedido explícito.
