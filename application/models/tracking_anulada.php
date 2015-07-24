<?php
class Tracking_Anulada extends DataMapper {
	var $table = 'Tracking_Anulada';
	var $has_one = array(
		'OpcionesAnulacion'
	);
}
?>