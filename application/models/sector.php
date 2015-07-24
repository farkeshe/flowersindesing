<?php
class Sector extends DataMapper {
	var $table = 'Sector';
	var $has_many = array(
		'Lugar'
	);
}
?>