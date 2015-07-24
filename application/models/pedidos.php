<?php
class Pedidos extends DataMapper {
	var $table = 'Pedidos';
	var $has_many = array(
		'Item_Pedido'
	);
	var $has_one = array(
		'Usuario',
		'Clase'
	);
}
?>