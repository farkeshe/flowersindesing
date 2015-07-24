<?php
class Lista_Precio extends DataMapper {
	var $table = 'Lista_Precio';
	var $has_one = array(
		'Moneda'
	);
}
?>