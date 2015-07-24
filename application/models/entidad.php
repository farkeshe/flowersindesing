<?php
class Entidad extends DataMapper {
	var $table = 'Entidad';
	var $has_many = array(
		'Destino'
	);
	var $has_one = array(
		'Clasificacion_Entidad'
	);
}
?>