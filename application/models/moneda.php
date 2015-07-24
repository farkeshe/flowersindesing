<?php
class Moneda extends DataMapper {
	var $table = 'Moneda';
	var $has_many = array(
		'Lista_Precio'
	);
	
	
}
?>