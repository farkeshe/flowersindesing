<?php
class Assoc_Restricciones extends DataMapper {
	var $table = 'Assoc_Restricciones';
	var $has_one = array(
		'Restricciones',
		'Usuario'
	);
}
?>