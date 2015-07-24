<?php
class Lugar extends DataMapper {
	var $table = 'Lugar';
	var $has_many = array(
		'Destino'
	);
	var $has_one = array(
		'Sector',
		'Tipo',
	);
}
?>