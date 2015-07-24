<?php
class Clasificacion_Entidad extends DataMapper {
	var $table = 'Clasificacion_Entidad';
	var $has_many = array(
		'Entidad'
	);
}
?>