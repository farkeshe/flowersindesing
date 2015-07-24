<?php
class Destino extends DataMapper {
	var $table = 'Destino';
	var $has_one = array(
		'Entidad',
		'Lugar',
	);
}
?>