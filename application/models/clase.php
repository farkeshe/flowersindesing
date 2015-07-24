<?php
class Clase extends DataMapper {
	var $table = 'Clase';
	var $has_many = array(
		'Pedidos'
	);
}
?>