<?php
class Perfil_Usuario extends DataMapper {
	var $table = 'Perfil_Usuario';
	
	var $has_many = array(
		'Usuario',
		'Assoc_Screen'

	);
	
	
}
?>