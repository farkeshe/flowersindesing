<?php
class Categoria extends DataMapper {
	var $table = 'Categoria';
	var $has_many = array(
		'Productos'
	);
}
?>