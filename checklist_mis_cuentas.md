# Checklist - Mis Cuentas App

## DASHBOARD

- [x] Al crear un gasto con cuotas pagas, las cuotas pagadas deben guardarse correctamente.
- [x] Los gastos fijos no deben aparecer como “Debo”.
- [x] En el modal de pagar cuotas, no se muestran los nombres de los gastos en la confirmación.

## ENTIDADES FINANCIERAS

- [ ] Agregar spinner de carga al obtener entidades.
- [ ] Al crear una entidad, volver a la lista.
- [ ] Corregir el layout de la lupa en el buscador.

## DETALLE DE ENTIDAD

- [x] Añadir loader mejorado al entrar.
- [x] Poner cursor pointer en gastos clickeables.
- [x] Quitar botón eliminar del modal actualizar.
- [x] Añadir zona de peligro igual que detalle de gasto.
- [x] Actualizar logs cuando se actualiza el nombre.
- [x] Click en StatCards cambia el tab.
- [x] En finalizados, mostrar fecha de finalización en lugar del valor por cuota.
- [x] Ordenar categorías.
- [x] Añadir botón “Agregar gasto”.
- [x] Añadir botón “Eliminar entidad”.

## DETALLE DE GASTO

- [x] Quitar breadcrumb.
- [ ] Editar no funciona → revisar.
- [x] Ocultar “Marcar cuota como pagada” si está finalizada.
- [x] Marcar cuota como pagada no funciona.
- [x] El tipo debe representarse por color.
- [x] Mostrar el nombre de la entidad, no la ID.
- [x] La moneda no debe ser ID.
- [x] Formatear montos en cuotas pagadas.
- [x] Si es gasto fijo, mostrar cuotas pagadas y no vencimiento.
- [x] Quitar botón “volver a debo”.

## CONFIGURACIÓN

- [ ] Traer foto, nombre, email del usuario.
- [ ] Manejar moneda de preferencia del usuario.

## GENERAL

- [ ] Manejo centralizado de errores.
- [ ] Añadir logs.
- [ ] Momentos de carga globales.
- [ ] Optimizar imágenes y fallbacks.
- [ ] Los horarios los toma 3h mas.
