# Checklist - EXPENSE MANAGER

## DASHBOARD

- [x] Al pagar/registrar cobro no se actualiza la fecha del ultimo pago
- [ ] hacer verificacion de entidad duplicada por nombre
- [ ] mejorar la ui del dashboard
- [x] posibilidad de desplegar/achicar las entidades
- [x] el filtrado no tiene en cuenta los nombres de las entidades
- [ ] que el dashboard no tenga en cuenta la moneda de preferencia para el filtrado, que por defecto sea "todos"
- [ ] hacer verificacion de vinculacion duplicada, si ya tenes un mail vinculado a una entidad no se puede usar en otra

- [ ] posibilidad de marcar entidades como privadas y que al querer ver datos de la misma haya que poner una contraseña
- [ ] modo daltonismo
- [ ] lugar de ingreso de sueldo, y en el balance mensual ver el resumen en contraste
- [ ] un lugar para agregar aumentos
- [ ] modo hacer cuentas: modo de checkbox temporales en los que cada vez que pagas una entidad se marque automaticamente/manual el checbox de pagado en esta sesion, y hay que ver la manera de evitar que se pierda la informacion cuando navegas a la entidad o al gasto
- [ ] para el modo hacer cuentas es necesario hacer que tenga limite de tiempo esa info guardada, por defecto 4h, pero que tambien sea editable
- [ ] boton exportar que tome toda la informacion del modo hacer cuentas
- [ ] grafico de gastos por categoria
- [ ] metricas por categoria en relacion al sueldo, por ej, cuanto gasto de suscripciones en relacion al sueldo (11%)
- [ ] como hacemos para explicarle al usuario como usar el sistema
- [ ] sacar balance general del dashboard
- [ ] al activar boton hacer cuentas que aparezca un boton terminar, que guarde los datos resumen para posteriores metricas,
- [ ] el grafico del dashboard debe tener en cuenta si el usuario ya hizo las cuentas este mes, para saber en que mes empieza el grafico
- [ ] en los graficos hay que eliminar el ultimo punto y en el anteultimo hay que ponerle que se termina, para que no quede un punto de cuota 0, y en la de cuota 1 diga ULTIMA
- [ ] el orden del dashboard tiene que venir ordenado por, cada entidad tiene un ultimo gasto, y las entidades se ordenan por quien tiene el gasto mas actual, y dentro de la entidad por gastos mas actuales
- [ ] pago con entidad
- [ ] checkbox de entra el mes siguiente

## ENTIDADES FINANCIERAS

- [ ] MISMO orden que en dashboard
- [ ] sacar la flechita en el listado, porque se oculta
- [ ] al crear entidad se pueda vincular a un usuario
- [ ] modo grid
- [ ] pantalla de entidades eliminadas y boton para restaurar
- [ ] visibilizar a quien esta vinculada

## Detalle entidad financiera

- [ ] sacar del dialog de editar la vinculacion
- [ ] crear boton para vincular, que se alterne con un desvincular, con dialog de alerta.
- [ ] boton ver graficos
- [ ] que las cards de gastos sean iguales a las del dashboard
- [ ] boton copiar
- [ ] boton pagar/registrar cobro
- [ ] en el historial debe ir, cuando se creo, cuando se vinculo y con quien, cuando se desvinculo de quien, cuando se elimino, cuando se restauro, cuando se creo una compra como sellama esa compra, cuando se edito el nombre de una compra, y cuando se elimino/ restauro esa compra
- [ ] boton para ver gastos eliminados y poder restaurarlos
- [ ] filtro de rango de fechas en el historial
- [ ] visibilizar a quien esta vinculada

## Detalle gasto

- [ ] si es egreso que diga pagar cuota, si es ingreso que diga cobrar
- [ ] historial, debe tener cambio de nombre, cualquier edicion, y que se edito en lo posible, eliminado y restaurado, creado pagos de cuota o reembolsos, y para la ultima cuota pagada debe decir finalizado.
- [ ] en gastos fijos debe aparecer cuando hiciste cada pago, con la posibilidad de reembolsarlo

## Perfil

- [ ] configurar cuanto tiempo dura el modo hacer cuentas. por defecto 4hs

## Metricas

- [ ] egreso ingreso por categoria y cuanto de el sueldo ingresado representa

## Adicionales

- [ ] imagenes para entidades y para gastos
- [ ] integrar mp mediante link
