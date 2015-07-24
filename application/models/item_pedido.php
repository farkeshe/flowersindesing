<?php
class Item_Pedido extends DataMapper {
	var $table = 'Item_Pedido';
	var $has_one = array(
		'Pedidos',
		'Producto'
	);
}
?>