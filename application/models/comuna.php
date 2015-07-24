<?php
class Comuna extends DataMapper {
	var $table = 'Comuna';
	var $has_one = array(
		'Provincia'
	);
}
?>