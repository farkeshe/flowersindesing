<?php
class Region extends DataMapper {
	var $table = 'Region';
	var $has_many = array(
		'Provincia'
	);
?>