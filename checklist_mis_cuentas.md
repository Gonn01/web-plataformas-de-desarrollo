# Checklist - Mis Cuentas App

## DASHBOARD

- [ ] Al crear un gasto con cuotas pagas, las cuotas pagadas deben guardarse correctamente.
- [ ] Los gastos fijos no deben aparecer como “Debo”.
- [ ] En el modal de pagar cuotas, no se muestran los nombres de los gastos en la confirmación.

## ENTIDADES FINANCIERAS

- [ ] Agregar spinner de carga al obtener entidades.
- [ ] Al crear una entidad, volver a la lista.
- [ ] Corregir el layout de la lupa en el buscador.

## DETALLE DE ENTIDAD

- [ ] Añadir loader mejorado al entrar.
- [ ] Poner cursor pointer en gastos clickeables.
- [ ] Quitar botón eliminar del modal actualizar.
- [ ] Añadir zona de peligro igual que detalle de gasto.
- [ ] Actualizar logs cuando se actualiza el nombre.
- [ ] Click en StatCards cambia el tab.
- [ ] En finalizados, mostrar fecha de finalización en lugar del valor por cuota.
- [ ] Ordenar categorías.
- [ ] Añadir botón “Agregar gasto”.

## DETALLE DE GASTO

- [ ] Quitar breadcrumb.
- [ ] Editar no funciona → revisar.
- [ ] Ocultar “Marcar cuota como pagada” si está finalizada.
- [ ] Marcar cuota como pagada no funciona.
- [ ] El tipo debe representarse por color.
- [ ] Mostrar el nombre de la entidad, no la ID.
- [ ] La moneda no debe ser ID.
- [ ] Formatear montos en cuotas pagadas.
- [ ] Si es gasto fijo, mostrar cuotas pagadas y no vencimiento.
- [ ] Quitar botón “volver a debo”.

## CONFIGURACIÓN

- [ ] Traer foto, nombre, email del usuario.
- [ ] Manejar moneda de preferencia del usuario.

## GENERAL

- [ ] Manejo centralizado de errores.
- [ ] Añadir logs.
- [ ] Momentos de carga globales.
- [ ] Optimizar imágenes y fallbacks.
