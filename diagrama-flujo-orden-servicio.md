# Diagrama de Flujo — Orden de Servicio SoliWel NDT

```mermaid
flowchart TB
    %% Estilos
    classDef startEnd fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    classDef process fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef decision fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef reject fill:#fce4ec,stroke:#d32f2f,stroke-width:2px
    classDef approval fill:#e8eaf6,stroke:#283593,stroke-width:2px

    %% Nodos
    A([Inicio]):::startEnd
    B[Crear Orden de Servicio]:::process
    C[Asignar Personal y Recursos]:::process
    D[Ejecutar Ensayos NDT]:::process
    E[Generar Reporte Técnico]:::process
    F{Revisar Reporte}:::decision
    G[Aprobar Reporte]:::decision
    H[Reporte Aprobado]:::approval
    I[Cerrar Orden de Servicio]:::process
    J([Fin]):::startEnd
    K[Solicitar Correcciones]:::reject
    L[Repetir Ensayos]:::process
    M[Corregir Reporte]:::process
    N{¿Requiere re-ejecución?}:::decision

    %% Flujo principal
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F

    %% Revisión — rechazo
    F -->|Rechazado| K
    K --> N
    N -->|Sí| L
    N -->|No| M
    L --> D
    M --> E

    %% Revisión — aprobado
    F -->|Aprobado| G

    %% Aprobación — rechazo
    G -->|Rechazado| K

    %% Aprobación — aprobado
    G -->|Aprobado| H
    H --> I
    I --> J
```

## Descripción de Estados

| Estado | Descripción |
|--------|-------------|
| **Creación** | Se registra la orden con datos del cliente, proyecto, alcance y método NDT. |
| **Asignación** | Se asignan técnicos, equipos, instrumentos y recursos necesarios. |
| **Ejecución** | Se realizan los ensayos NDT (PT, MT, UT, VT, UTPA) in-situ o en laboratorio. |
| **Reporte** | Se genera el reporte técnico con resultados, cálculos y conclusiones. |
| **Revisión** | Un inspector/revisor verifica la calidad y completitud del reporte. |
| **Aprobación** | El supervisor o cliente final aprueba el reporte para entrega. |
| **Cierre** | Se archiva la orden, se actualiza el inventario y se factura si aplica. |

## Bucles de Corrección

- **Rechazo en Revisión**: Si el reporte tiene errores, se devuelve para corrección menor (**Corregir Reporte**) o para re-ejecución completa (**Repetir Ensayos**) si los datos son insuficientes.
- **Rechazo en Aprobación**: Similar al anterior, cualquier rechazo en aprobación dispara el subflujo de correcciones.
