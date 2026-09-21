# Reglas de Auditoría y Modificaciones - Aplicación de Reportes

## 📋 Registro de Cambios

### 2025-04-14 - Eliminación de Nube de Puntos (Point Cloud)

**Decisión:** Se eliminó todo el módulo de "Nube de Puntos" de la aplicación por decisión arquitectónica.

**Elementos removidos:**
1. Dashboard card que enlazaba a herramientas de Point Cloud
2. Funciones JavaScript `showPointCloudTools()` y `hidePointCloudTools()` (marcadas como deprecated)
3. El panel HTML `#panel-pointcloud` permanece pero oculto para compatibilidad

**Archivos modificados:**
- `index.html` (líneas ~175-182, ~2062-2075)

**Razón:** La funcionalidad de exportación de puntos desde Revit/ReCap no era crítico y agregaba complejidad innecesaria a la aplicación.

---

## 📊 Resultados de Auditoría de Formularios

### vt_form.js (Visual Testing)
- **Líneas:** 846
- **Puntuación:** 62/100
- **Hallazgos críticos:**
  - XSS vulnerability en `addVTRow()` - sanitizar inputs
  - Error de sintaxis en línea 220
  - Validación insuficiente de campos requeridos

### pt_form.js (Penetrant Testing)
- **Líneas:** 286
- **Puntuación:** 68/100
- **Hallazgos críticos:**
  - Validación insuficiente (solo cliente)
  - Variables globales expuestas
  - Firmas hardcodeadas

### ut_form.js (Ultrasonic Testing)
- **Líneas:** 805
- **Puntuación:** 68/100
- **Hallazgos críticos:**
  - Referencia a `THICKNESS_TABLE` inexistente
  - Validación de campos incompleta
  - Variables globales expuestas

---

## ✅ Reglas Permanentes

1. **NO usar Point Cloud** - Eliminado de la aplicación
2. **Sanitizar todos los inputs** antes de insertar en innerHTML
3. **Validar campos requeridos** antes de guardar
4. **No hardcodear** datos sensibles en el código fuente
5. **Usar JSDoc** para documentar funciones públicas
6. **Manejo de errores** try-catch en funciones async