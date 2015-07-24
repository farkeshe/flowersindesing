<?php
class Assoc_Screen extends DataMapper {
	var $table = 'Assoc_Screen';
	var $has_one = array(
		'Screen',
		'Perfil_Usuario'
	);
}
?>