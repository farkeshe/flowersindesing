<?php
class Usuario extends DataMapper {
	var $table = 'Usuario';
	var $has_many = array(
		'Pedidos',
		'Assoc_Restricciones'
	);
	var $has_one = array(
		'Perfil_Usuario',
		'Sucursal'
	);
	
}
?>