<?php
class OpcionesAnulacion extends DataMapper {
	var $table = 'OpcionesAnulacion';
	var $has_many = array(
		'Tracking_Anulada' 
	);
}
?>