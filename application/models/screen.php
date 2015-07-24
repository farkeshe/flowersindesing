<?php
class Screen extends DataMapper {
	var $table = 'Screen';
	var $has_many = array(
		'Assoc_Screen'
	);
	
	
}
?>