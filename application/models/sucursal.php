<?php
class Sucursal extends DataMapper {
	var $table = 'Sucursal';
	var $has_many = array(
		'Usuario'
	);
}
?>