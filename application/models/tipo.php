<?php
class Tipo extends DataMapper {
	var $table = 'Tipo';
	var $has_many = array(
		'Lugar'
	);
}
?>