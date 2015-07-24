<?php
class Provincia extends DataMapper {
	var $table = 'Provincia';
	var $has_many = array(
		'Comuna' 

	);
	var $has_one = array(
		'Region'
	);
}
?>