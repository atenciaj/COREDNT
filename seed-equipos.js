/**
 * seed-equipos.js — Poblar datos de ejemplo para Equipos, Mecanismos y Partes
 * Ejecutar en consola del navegador: cargar script o copiar/pegar
 */
(async function seedEquipos() {
  'use strict';
  if (!window.NDT?.db) { console.error('NDT.db no disponible'); return; }
  await window.NDT.db.initDB();
  const db = window.NDT.db;

  // ======= EQUIPOS =======
  const equipos = [
    { codigo: 'EQ-UT-01', nombre: 'OmniScan MX2', tipo: 'UT', marca: 'Olympus', modelo: 'MX2', serie: 'OM-2022-001', estado: 'ACTIVO', ubicacion: 'Almacén Lima', fecha_calibracion: '2025-11-15', fecha_vencimiento: '2026-11-15', intervalo_meses: 12, ownership_type: 'Empresa' },
    { codigo: 'EQ-UT-02', nombre: 'DMS Go+', tipo: 'UT', marca: 'Olympus', modelo: 'DMS Go+', serie: 'OM-2023-002', estado: 'CALIBRADO', ubicacion: 'Campo Talara', fecha_calibracion: '2026-02-01', fecha_vencimiento: '2026-08-01', intervalo_meses: 6, ownership_type: 'Empresa' },
    { codigo: 'EQ-MT-01', nombre: 'Yugo Magnaflux Y-2', tipo: 'MT', marca: 'Magnaflux', modelo: 'Y-2', serie: 'MF-2021-010', estado: 'ACTIVO', ubicacion: 'Almacén Lima', fecha_calibracion: '2025-09-10', fecha_vencimiento: '2026-09-10', intervalo_meses: 12, ownership_type: 'Empresa' },
    { codigo: 'EQ-MT-02', nombre: 'Bachmann BW-2', tipo: 'MT', marca: 'Bachmann', modelo: 'BW-2', serie: 'BH-2022-005', estado: 'ACTIVO', ubicacion: 'Campo Camisea', fecha_calibracion: '2026-01-20', fecha_vencimiento: '2026-12-20', intervalo_meses: 12, ownership_type: 'Cliente', customer_id: 'PETROPERU' },
    { codigo: 'EQ-PT-01', nombre: 'Kit PT Magnaflux', tipo: 'PT', marca: 'Magnaflux', modelo: 'SK-500', serie: 'MF-2022-008', estado: 'ACTIVO', ubicacion: 'Almacén Lima', fecha_calibracion: '2025-10-05', fecha_vencimiento: '2026-10-05', intervalo_meses: 12, ownership_type: 'Empresa' },
    { codigo: 'EQ-PT-02', nombre: 'Lámpara UV Solar 400', tipo: 'PT', marca: 'Magnaflux', modelo: 'Solar 400', serie: 'MF-2023-003', estado: 'CALIBRADO', ubicacion: 'Campo Talara', fecha_calibracion: '2026-03-01', fecha_vencimiento: '2026-09-01', intervalo_meses: 6, ownership_type: 'Empresa' },
    { codigo: 'EQ-VT-01', nombre: 'Videoscopio IPLEX', tipo: 'VT', marca: 'Olympus', modelo: 'IPLEX GX', serie: 'OM-2021-004', estado: 'MANTENIMIENTO', ubicacion: 'Taller', fecha_calibracion: '2025-06-15', fecha_vencimiento: '2025-12-15', intervalo_meses: 12, ownership_type: 'Empresa' },
    { codigo: 'EQ-VT-02', nombre: 'Endoscopio Viking V5', tipo: 'VT', marca: 'Eddyfi', modelo: 'V5', serie: 'ED-2022-002', estado: 'ACTIVO', ubicacion: 'Almacén Lima', fecha_calibracion: '2025-12-01', fecha_vencimiento: '2026-12-01', intervalo_meses: 12, ownership_type: 'Cliente', customer_id: 'REPSOL' },
    { codigo: 'EQ-OT-01', nombre: 'Medidor Espesor DMS', tipo: 'OTRO', marca: 'Olympus', modelo: '38DL PLUS', serie: 'OM-2020-006', estado: 'ACTIVO', ubicacion: 'Almacén Lima', fecha_calibracion: '2026-01-01', fecha_vencimiento: '2027-01-01', intervalo_meses: 12, ownership_type: 'Empresa' },
  ];

  for (const eq of equipos) {
    eq.created_at = new Date().toISOString();
    eq.updated_at = eq.created_at;
    await db.saveSwellItem('swell_equipos', eq);
  }
  console.log(`✅ ${equipos.length} equipos creados`);

  // ======= MECANISMOS =======
  const mecanismos = [
    { nombre: 'Cabezal Rotatorio', tipo: 'BOMBA', id_equipo: 1, serie: 'CR-2023-001', descripcion: 'Cabezal para escaneo automático UT' },
    { nombre: 'Intercambiador E-101', tipo: 'INTERCAMBIADOR', id_equipo: 4, serie: 'IC-2020-050', descripcion: 'Intercambiador de calor casco y tubo' },
    { nombre: 'Tanque T-200', tipo: 'TANQUE', id_equipo: 4, serie: 'TK-2019-100', descripcion: 'Tanque de almacenamiento de crudo' },
    { nombre: 'Válvula de Seguridad', tipo: 'VALVULA', id_equipo: 8, serie: 'VS-2021-030', descripcion: 'Válvula de alivio de presión' },
    { nombre: 'Torre Destilación T-01', tipo: 'TORRE', id_equipo: 4, serie: 'TD-2018-001', descripcion: 'Torre fraccionadora principal' },
    { nombre: 'Compresor C-101', tipo: 'COMPRESOR', id_equipo: 1, serie: 'CP-2022-010', descripcion: 'Compresor de aire para instrumentos' },
    { nombre: 'Bomba Booster P-01', tipo: 'BOMBA', id_equipo: 8, serie: 'BP-2023-005', descripcion: 'Bomba centrífuga booster' },
  ];

  const mecanismoIds = [];
  for (const m of mecanismos) {
    m.created_at = new Date().toISOString();
    m.updated_at = m.created_at;
    const result = await db.saveSwellItem('swell_mecanismos', m);
    mecanismoIds.push(result.id || result);
  }
  console.log(`✅ ${mecanismos.length} mecanismos creados`);

  // ======= PARTES =======
  const partes = [
    { nombre: 'Haz de Tubos', nivel: 1, id_mecanismo: mecanismoIds[1], descripcion: 'Haz de tubos del intercambiador', cantidad_total: 200 },
    { nombre: 'Casco', nivel: 1, id_mecanismo: mecanismoIds[1], descripcion: 'Casco del intercambiador', cantidad_total: 1 },
    { nombre: 'Placa Tubular', nivel: 2, id_mecanismo: mecanismoIds[1], descripcion: 'Placa de soporte de tubos', cantidad_total: 2 },
    { nombre: 'Cuerpo del Tanque', nivel: 1, id_mecanismo: mecanismoIds[2], descripcion: 'Cuerpo cilíndrico', cantidad_total: 1 },
    { nombre: 'Tapa Superior', nivel: 1, id_mecanismo: mecanismoIds[2], descripcion: 'Tapa semiesférica', cantidad_total: 1 },
    { nombre: 'Boquilla de Entrada', nivel: 2, id_mecanismo: mecanismoIds[2], descripcion: 'Conexión de entrada 12"', cantidad_total: 1 },
    { nombre: 'Cuerpo Válvula', nivel: 1, id_mecanismo: mecanismoIds[3], descripcion: 'Cuerpo principal', cantidad_total: 1 },
    { nombre: 'Resorte', nivel: 2, id_mecanismo: mecanismoIds[3], descripcion: 'Resorte de calibración', cantidad_total: 1 },
    { nombre: 'Secciones Torre', nivel: 1, id_mecanismo: mecanismoIds[4], descripcion: 'Secciones de torre', cantidad_total: 5 },
    { nombre: 'Platos/Bandejas', nivel: 2, id_mecanismo: mecanismoIds[4], descripcion: 'Bandejas de fraccionamiento', cantidad_total: 30 },
    { nombre: 'Carcasa Compresor', nivel: 1, id_mecanismo: mecanismoIds[5], descripcion: 'Carcasa de baja presión', cantidad_total: 1 },
  ];

  for (const p of partes) {
    p.created_at = new Date().toISOString();
    p.updated_at = p.created_at;
    await db.saveSwellItem('swell_partes', p);
  }
  console.log(`✅ ${partes.length} partes creadas`);

  // ======= ACTIVIDADES =======
  const actividades = [
    { tipo: 'UT', descripcion: 'Medición de espesores en haz de tubos', porcentaje: 100, prioridad: 'ALTA', avance: 50, estado: 'EN_PROGRESO', responsable: 'Carlos Mendoza', fecha: '2026-06-15' },
    { tipo: 'UT', descripcion: 'Inspección de soldaduras en cuerpo de tanque', porcentaje: 75, prioridad: 'ALTA', avance: 0, estado: 'PENDIENTE', responsable: 'María López', fecha: '2026-06-20' },
    { tipo: 'MT', descripcion: 'Detección de grietas en carcasa de compresor', porcentaje: 50, prioridad: 'MEDIA', avance: 100, estado: 'COMPLETADA', responsable: 'Juan Pérez' },
    { tipo: 'PT', descripcion: 'Verificación de porosidad en placa tubular', porcentaje: 30, prioridad: 'MEDIA', avance: 25, estado: 'EN_PROGRESO', responsable: 'Ana García', fecha: '2026-07-01' },
    { tipo: 'VT', descripcion: 'Inspección visual de boquillas y conexiones', porcentaje: 100, prioridad: 'BAJA', avance: 0, estado: 'PENDIENTE', responsable: 'Pedro Sánchez' },
    { tipo: 'UT', descripcion: 'Scanning phased array en soldaduras críticas', porcentaje: 100, prioridad: 'ALTA', avance: 80, estado: 'EN_PROGRESO', responsable: 'Carlos Mendoza', fecha: '2026-05-30' },
    { tipo: 'MT', descripcion: 'Verificación de resortes de válvula', porcentaje: 20, prioridad: 'BAJA', avance: 100, estado: 'COMPLETADA', responsable: 'Luis Torres' },
  ];

  const actividadIds = [];
  for (const a of actividades) {
    a.created_at = new Date().toISOString();
    a.updated_at = a.created_at;
    const result = await db.saveSwellItem('swell_actividades', a);
    actividadIds.push(result.id || result);
  }
  console.log(`✅ ${actividades.length} actividades creadas`);

  // ======= RELACIONES =======
  // Actividad 1 (UT espesores) → Mecanismo 2 (Intercambiador) + Parte 1 (Haz de Tubos)
  await db.saveSwellItem('swell_actividad_mecanismo', { actividadId: actividadIds[0], mecanismoId: mecanismoIds[1] });
  await db.saveSwellItem('swell_actividad_parte', { actividadId: actividadIds[0], parteId: 1 });

  // Actividad 2 (UT soldaduras tanque) → Mecanismo 3 (Tanque)
  await db.saveSwellItem('swell_actividad_mecanismo', { actividadId: actividadIds[1], mecanismoId: mecanismoIds[2] });

  // Actividad 3 (MT carcasa) → Mecanismo 6 (Compresor)
  await db.saveSwellItem('swell_actividad_mecanismo', { actividadId: actividadIds[2], mecanismoId: mecanismoIds[5] });

  // Actividad 4 (PT placa) → Parte 3 (Placa Tubular)
  await db.saveSwellItem('swell_actividad_parte', { actividadId: actividadIds[3], parteId: 3 });

  // Actividad 5 (VT boquillas) → Mecanismo 3 (Tanque) + Parte 6 (Boquilla)
  await db.saveSwellItem('swell_actividad_mecanismo', { actividadId: actividadIds[4], mecanismoId: mecanismoIds[2] });
  await db.saveSwellItem('swell_actividad_parte', { actividadId: actividadIds[4], parteId: 6 });

  // Actividad 6 (UT phased array) → Mecanismo 1 (Cabezal)
  await db.saveSwellItem('swell_actividad_mecanismo', { actividadId: actividadIds[5], mecanismoId: mecanismoIds[0] });

  console.log(`✅ Relaciones creadas`);
  console.log(`🎉 POBLACIÓN COMPLETADA: ${equipos.length} equipos, ${mecanismos.length} mecanismos, ${partes.length} partes, ${actividades.length} actividades`);
})();
