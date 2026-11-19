# IMG-F16 — lote para Claude

1. Adjuntar `comparativo-funcional-megaspec-unificado.md`.
2. Pegar prompt §1 de `comparativo-funcional-imagenes-F-PROMPT-CLAUDE.md`.
3. Pedir: **`Generá IMG-F16`**

**Título sugerido:** Atención, turnos y comunicaciones
**Subtítulo sugerido:** Reclamos, mail y contactos

## Tabla (texto literal — sin columna Ref.)

| Función | Hoy en ProCoop | Con CoopApps | Cambio | Por qué importa |
|---|---|---|---|---|---|
| Auditoría Logueo | En ProCoop: Auditoría login | Auditoría de ingresos y de cambios en datos sensibles. | Mejor | Trazabilidad ante auditoría. |
| Copia de Seguridad | En ProCoop: Manual usuario | Copias de seguridad automáticas y exportación completa de los datos de la cooperativa. | Modelo distinto | Sin depender de que alguien haga backup a mano. |
| Base de Datos | En ProCoop: Menú (a veces off) | Administración de base de datos: la realiza el proveedor de la nube (no es menú del usuario). | No aplica al usuario | La cooperativa no administra servidores SQL. |
| Actualizar | En ProCoop: Actualizar.exe | Actualizaciones continuas sin ejecutar instalador en cada PC. | Modelo distinto | Todos en la misma versión sin visitar cada PC. |
| Tablas del sistema | En ProCoop: Tablas dominio | Tablas maestras con aviso de «en uso por» antes de borrar. | Mejor | Evita borrar tablas que aún usa otro proceso. |
| Parámetros del Sistema | En ProCoop: Numéricos | Parámetros del sistema con nombre, tipo, vigencia e historial. | Mejor | Cambios de parámetro rastreables. |
| Parámetros Externos | En ProCoop: Parámetros ext. | Parámetros de integraciones externas en bóveda segura. | Mejor | Credenciales externas fuera del código fuente. |
| Autorización Operaciones | En ProCoop: Supervisor puntual | Circuitos de autorización por monto, doble firma y bandeja unificada. | Mejor | Aprobaciones escalables por monto y rol. |
