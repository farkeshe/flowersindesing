<?php
class Producto extends DataMapper {
	var $table = 'Producto';
	var $has_many = array(
		'Item_Pedido'
	);
	var $has_one = array(
		'Categoria'
	);
}
?>