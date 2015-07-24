<!DOCTYPE html>
<html lang="es">
	<head>
		<meta charset="utf-8">
		<title>Portada de mi sitio</title>
		<link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>/assets/css/style.css" media="screen"/>
		<link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>/assets/css/print.css" media="print"/>
		<link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>/assets/css/jquery-ui-1.10.2.custom.css"/>	
		<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/lib/require.js"></script>
		<script type="text/javascript">
			require.config({
		    	baseUrl: "<?php echo base_url(); ?>"
		  	});
		</script>
		<script type="text/javascript" src="<?php echo base_url(); ?>assets/js/main.js"></script>

	</head>
	<body>
			
		<!-- Login de la aplicacion-->
		<div id="appLogin">
		</div>
		<!-- Fin Login -->		

		<!-- Menu de la aplicacion-->
		<div id="appMain">
		</div>
		<!-- Fin Menu -->

		<!-- Ventana modal de mensajes-->
		<div class="modal fade" id="modal">
		</div>
		<!-- Fin ventana modal de mensajes -->	

		<!-- exportar a excel -->
		<form method="get" id="ExportarExcel">
		</form>
		<!--fin exportar a excel-->	

		<!-- exportar a PDF -->
		<form method="get" id="ExportarPDF">
		</form>
		<!--fin exportar a PDF-->	

	</body>

	<script type="text/javascript">
			var base_url = "<?php echo base_url(); ?>";
			base_url = base_url.substring(0,base_url.length-1);
	</script>
</html>