<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class Exportar extends REST_Controller 
{

    public function __construct()
    {
        parent::__construct();

        //cargamos la libreria para crear una variable de session
        $this->load->library('session');
        //cargamos la libreria para exportar a excel
        $this->load->library('Excel');
        //cargamos la libreria para exportar a pdf
        $this->load->library('mpdf');
        //cargamos el modulo para los item del pedido
        $this->load->model('item_pedido');

        $this->load->library('bitauth');

        //if(!$this->bitauth->logged_in()) 
        //{
         //  $this->response('Session Terminada',302);
        //}


    }


     public function exportarExcelListadoCotizacion_get()
    {
        //Instanciamos el objeto 
        $excel = new Excel; 
        //creamos la cabecera
        $header= array('Nº de Cot.','Fecha','Clase','Responsable','Vendedor','Cliente','Valor Flete','Valor Neto','Valor Total');
        //traemos el resultado de la consulta generada anteriormente y la cual fue guardada en una variable de session
        $resultset= $this->session->userdata('data');
        //Convertimos los datos y la cabecera a Excel: 
        $excel->WriteListadoCotizacion($resultset,$header); 
        //Hacemos que sea descargable: 
        $excel->Download("ArchivoExcel"); 
    }

    public function exportarPDFListadoCotizacion_get()
    {
        ini_set("memory_limit","-1");

        $tabla='<table class="tablageneral" border="0" cellpadding="10">';
        $tabla.='<thead>';
        $tabla.='<tr>';
        $tabla.='<th style="width: 11.1%;">Nº Cot.</th>';
        $tabla.='<th style="width: 11.1%;">Fecha</th>';
        $tabla.='<th style="width: 11.1%;">Clase</th>';
        $tabla.='<th style="width: 11.1%;">Responsable</th>';
        $tabla.='<th style="width: 11.1%;">Vendedor</th>';
        $tabla.='<th style="width: 11.1%;">Cliente</th>';
        $tabla.='<th style="width: 11.1%;">Valor Flete</th>';
        $tabla.='<th style="width: 11.1%;">Valor Neto</th>';
        $tabla.='<th style="width: 11.1%;">Valor Total</th>';
        $tabla.='</tr>';
        $tabla.='</thead>';
        $tabla.='<tbody>';
        
        foreach($this->session->userdata('data') as $row) 
        {
            $tabla.='<tr>';
            $tabla.= '<td style="width: 11.1%;">'.$row['Id_Pedidos'].'</td>';
            $tabla.= '<td style="width: 11.1%;">'.date("d/m/Y", strtotime($row['Fecha_Cot'])).'</td>';
            $tabla.= '<td style="width: 11.1%;">'.$row['Clase'].'</td>';
            $tabla.= '<td style="width: 11.1%;">'.$row['Responsable'].'</td>';
            $tabla.= '<td style="width: 11.1%;">'.$row['Vendedor'].'</td>';
            $tabla.= '<td style="width: 11.1%;">'.$row['Cliente'].'</td>';
            $tabla.= '<td style="width: 11.1%;" align="right">'.number_format($row['Total_Flete'],0,'.', '.').'</td>';
            $tabla.= '<td style="width: 11.1%;" align="right">'.number_format($row['Valor_Neto'],0,'.', '.').'</td>';
            $tabla.= '<td style="width: 11.1%;" align="right">'.number_format($row['Total'],0,'.', '.').'</td>';
            $tabla.='</tr>';
        }
        $tabla.='</tbody>';
        $tabla.='</table>';

        //se instancia el objeto
      // $mpdf=new mPDF('utf-8','A4');
         $mpdf=new mPDF('utf-8',  array(216,140),0,0,10.1,10.1,24,0,10,10);
        //deja la orientacion de la pagina en horizonal, ('p') es normal
        $mpdf->AddPage('P');
        //setea el app.path del mpdf
        $mpdf->setBasePath(base_url());
        //carga la hoja de estilos
        $stylesheet = file_get_contents('assets/css/style.css');
        //interpreta la hoja de estilos
        $mpdf->WriteHTML($stylesheet,1);
        //interpreta el codigo html
        $mpdf->WriteHTML($tabla,2);
        //imprime el pdf
        $mpdf->Output('ArchivoPDF.pdf','I');
    }

    //exportar a excel lista de precios
    public function exportarExcelListaPrecios_get()
    {
        //Instanciamos el objeto 
        $excel = new Excel; 
        //creamos la cabecera
        $header= array('Subgerencia','Nombre Lista','Tipo','Estado','Desde','Hasta');
        //traemos el resultado de la consulta generada anteriormente y la cual fue guardada en una variable de session
        $resultset= $this->session->userdata('data');
        //Convertimos los datos y la cabecera a Excel: 
        $excel->WriteListaPrecios($resultset,$header); 
        //Hacemos que sea descargable: 
        $excel->Download("ArchivoExcel"); 
    }
    //exporta pdf de cotizacion
    public function exportarcotPDF_get()
    {
        $idCotizacion='32';
        foreach ($this->session->userdata('pedido') as $row)
        {
            $Id_Pedidos= $row['Id_Pedidos'];
            //$Observaciones= $row['Observaciones'];
            $Observaciones_Despacho= $row['Observaciones_Despacho']; 
            $Observaciones_Fabricacion= $row['Observaciones_Fabricacion'];
           // $Total= $row['Total'];
           // $Iva= $row['Iva'];
           // $Descuento= $row['Descuento'];
           // $Valor_Neto= $row['Valor_Neto'];
           // $Total_Flete= $row['Total_Flete'];
            $nombreCliente= $row['nombreCliente'];
            $direcionCliente= $row['direcionCliente'];
            $telefonoCliente= $row['telefonoCliente'];
            $emailCliente= $row['emailCliente'];
            $rutCliente= $row['rutCliente'];
            $nombreDestino= $row['nombredestino'];
            $direccionDestino= $row['direcciondestino'];
            $telefonoDestino= $row['telefonodestino'];
            $Fecha_Cot= $row['Fecha_Cot'];
            $nombreVendedor= $row['nombreVendedor'];
            $emailVendedor= $row['emailVendedor'];
            $telefonoVendedor= $row['telefonoVendedor'];
            $celularVendedor= $row['celularVendedor'];
            $fechaDespacho= $row['fechaDespacho'];
            $horaDespacho= $row['horaDespacho'];
        }

        
        list($hr,$min,$seg) = split('[:.-]', $horaDespacho);
        //echo "$hr; $min; $seg;";
        

        //obtendremos el digito verificador del rut del cliente
        $rut=$rutCliente;
        $rut = strrev($rut);
        $aux = 1;
        for($i=0;$i<strlen($rut);$i++){
        $aux++;
        $s += intval($rut[$i])*$aux;
        if($aux == 7){ $aux=1; }
        }
        $digit = 11-$s%11;
        if($digit == 11){$d = 0;}elseif($digit == 10){$d = "K";}else{$d = $digit;}
        $digitov=$d;

      //  ini_set("memory_limit","-1");
/*
        $tabla.='<div class="general">';
        $tabla='<div class="identificadorcot">';
        $tabla.='<div class="tituloprincipal"> PEDIDO Nº '.$Id_Pedidos.'</div>';
        $tabla.='</div>';
*/

        //div datos del pedido
        $tabla.='<div class="datosencabezado">';
            $tabla.='<div class="titulos"> Datos </div>';
        
        $tabla.='<table>';    
            $tabla.='<tr>';
                $tabla.='<td align="left" style="padding-left: 11px;">';
                    //$tabla.='<div">';
                        $tabla.='<div class="texto"> Pedido Nº '.$Id_Pedidos.' </div>';
                      //  $tabla.='<div class="textoconsultado">'.$Id_Pedidos.'</div>';
                    //$tabla.='</div>';
                $tabla.='</td>';
                $tabla.='<td align="left" style="padding-left: 190px;">';    
                    //$tabla.='<div>';
                        $tabla.='<div class="texto">Fecha Entrega '.date("d/m/Y", strtotime($fechaDespacho)).' </div>';
                       // $tabla.='<div class="textoconsultado">'.date("d/m/Y", strtotime($fechaDespacho)).'</div> ';
                    //$tabla.='</div>';
                $tabla.='</td>';
                $tabla.='<td align="left" style="padding-left: 170px;">';
                    //$tabla.='<div>';
                        $tabla.='<div class="texto">Hora Entrega '.$hr.":".$min.'</div>';
                        //$tabla.='<div class="textoconsultado">'.$horaDespacho.'</div> ';
                    //$tabla.='</div>';
                $tabla.='</td>';
            $tabla.='</tr>';    
        $tabla.='</table>';

       // $tabla.='</div>';
        

        //div del cliente
        // $tabla.='<div class="datosencabezado">';
        // $tabla.='<div class="titulos"> Datos Cliente</div>';
        // $tabla.='<div class="izq">';
        // $tabla.='<div class="entradas-texto">';
        // $tabla.='<div class="texto">Cliente</div>';
        // $tabla.='<div class="textoconsultado">'.$nombreCliente.'</div> <BR>';
        // $tabla.='</div>';
        // $tabla.='<div class="entradas-texto">';
        // $tabla.='<div class="texto">Rut</div>';
        // $tabla.='<div class="textoconsultado">'.number_format($rutCliente,0,'.', '.').'-'.$digitov.'</div> <BR>';
        // $tabla.='</div>';
        // $tabla.='<div class="entradas-texto">';
        // $tabla.='<div class="texto">Email</div>';
        // $tabla.='<div class="textoconsultado">'.$emailCliente.'</div> <BR>';
        // $tabla.='</div>';
        // $tabla.='</div>';
        // $tabla.='<div class="right">';
        // $tabla.='<div class="entradas-texto">';
        // $tabla.='<div class="texto">Teléfono</div>';
        // $tabla.='<div class="textoconsultado">'.$telefonoCliente.'</div> <BR>';
        // $tabla.='</div>';
        // $tabla.='<div class="entradas-texto" id="ultimo">';
        // $tabla.='<div class="texto">Dirección</div>';
        // $tabla.='<div class="textoconsultado">'.$direcionCliente.'</div> <BR>';
        // $tabla.='</div>';
        // $tabla.='</div>';
        // $tabla.='</div>';

     //   $tabla.='<div class="datosencabezado">';
        $tabla.='<div class="titulos"> Datos Destinatario</div>';
        $tabla.='<div class="izq">';
        $tabla.='<div class="entradas-texto">';
        $tabla.='<div class="texto">Nombre</div>';
        $tabla.='<div class="textoconsultado">'.$nombreDestino.'</div> <BR>';
        $tabla.='</div>';
        $tabla.='<div class="entradas-texto">';
        $tabla.='<div class="texto">Dirección</div>';
        $tabla.='<div class="textoconsultado">'.$direccionDestino.'</div> <BR>';
        $tabla.='</div>';
        $tabla.='</div>';
        $tabla.='<div class="right">';
        $tabla.='<div class="entradas-texto">';
        $tabla.='<div class="texto">Observaciones Despacho</div>';
        $tabla.='<div class="textoconsultado">'.$Observaciones_Despacho.'</div> <BR>';
        $tabla.='</div>';
        $tabla.='</div>';
        $tabla.='</div>';


        //div de detalles de la cotizacion
        $tabla.='<div class="Detallescot">';
        $tabla.='<div class="titulos"> Detalles Pedido</div>';
        $tabla.='<div class="contenedortabla">';
        $tabla.='<table class="tabla" align="center">';
        $tabla.='<thead>';
        $tabla.='<tr>';
        $tabla.='<th class="encabezadotabla" style="width:33,3%;">Unidades</th>';
        $tabla.='<th class="encabezadotabla" style="width:33,3%;">Producto</th>';
       // $tabla.='<th class="encabezadotabla">Precio Unidad</th>';
        #$tabla.='<th class="encabezadotabla"></th>';
        $tabla.='<th class="encabezadotabla" style="width:33,4%;">Observaciones Fabricación</th>';
      //  $tabla.='<th class="encabezadotabla">'.$Observaciones_Fabricacion.'</td>';
        $tabla.='</tr>';
        $tabla.='</thead>';
        $tabla.='</table>';
        $tabla.='<div class="linea"><hr></div>';
        $tabla.='<table class="tabla tablageneral" align="center">';
        $tabla.='<tbody>';
        //trae todos los pedidos del item seleccionado
        $items = new Item_Pedido();
        $items->where('Id_Pedido', $idCotizacion);
        $items->get();
        $contador=1;
        //se imprime la tabla de los Items
        $i=0;
        foreach($this->session->userdata('items') as $item) 
        {    

            $Cantidad= $item['Cantidad'];
            $nombreproducto=$item['nombreproducto'];
        
            $tabla.='<tr>';
            $tabla.='<td class="datostabla" style="width:33,3%;">'.$Cantidad.'</td> ';
            $tabla.='<td class="datostabla" style="width:33,3%;">'.$nombreproducto.'</td> ';
            if($i==0){
            $tabla.='<td class="datostabla" style="width:33,3%;">'.$Observaciones_Fabricacion.'</td> ';
            }
            $i=+1;
            }
           // $tabla.='<td class="datostabla" style="width:33,3%;">'.$Observaciones_Fabricacion.'</td> ';
          //  $tabla.='<td class="datostabla">'.$item['Cantidad'].'</td>';
          //  $tabla.='<td class="datostabla">'.$item['nombreproducto'].'</td>';
            //$tabla.='<td class="datostabla">'.$item['Observaciones_Fabricacion'].'</td>';
          //  $tabla.='<td class="datostabla">'.number_format($item['Precio_Unitario'],0,'.', '.').'</td>';
          //  $tabla.='<td class="datostabla">'.number_format($item['Precio_Total'],0,'.', '.').'</td>';
            $tabla.='</tr>';
      //  }
       // $tabla.='<td class="datostabla">'.$item['Observaciones_Fabricacion'].'</td>';
        $tabla.='</tbody>';
        $tabla.='</table>';
        $tabla.='<div class="lineaabajo"><hr></div>';
        $tabla.='</div>';
        $tabla.='</div>';
        $tabla.='<BR>';
        $tabla.='<BR>';



        $tabla.='<div class="divclass2" >Nombre </div>';    
        $tabla.='<div class="divclass" >Rut</div>';
        $tabla.='<div class="divclass3" >Firma</div>';
        $tabla.='<div class="divclass3" >Hora Entrega</div>';


       /* //este es el div de los totales
        $tabla.='<div class="totales">';
        $tabla.='<div class="interiortotales">';
        $tabla.='<div class="entradas-total">';
        $tabla.='<div class="textototal">Total Flete</div>';
        $tabla.='<div class="textoconsultadototal">'.number_format($Total_Flete,0,'.', '.').'</div> <BR>';
        $tabla.='</div>';
        $tabla.='<div class="entradas-total">';
        $tabla.='<div class="textototal">Neto</div>';
        $tabla.='<div class="textoconsultadototal">'.number_format($Valor_Neto,0,'.', '.').'</div> <BR>';
        $tabla.='</div>';
        if ($Descuento!='0' && $Descuento!=null) {
            $tabla.='<div class="entradas-total">';
            $tabla.='<div class="textototal">Descuento %</div>';
            $tabla.='<div class="textoconsultadototal">'.number_format($Descuento,0,'.', '.').'</div> <BR>';
            $tabla.='</div>';
        }
        $tabla.='<div class="entradas-total">';
        $tabla.='<div class="textototal">% IVA</div>';
        $tabla.='<div class="textoconsultadototal">'.number_format($Iva,0,'.', '.').'</div> <BR>';
        $tabla.='</div>';
        $tabla.='<div class="entradas-total" id="ultimototal">';
        $tabla.='<div class="textototal">Total</div>';
        $tabla.='<div class="textoconsultadototal">'.number_format($Total,0,'.', '.').'</div>';
        $tabla.='</div>';
        $tabla.='</div>';
        $tabla.='</div>';
        $tabla.='</div>';
        */ 
        //se instancia el objeto tamaño carta
        //$mpdf=new mPDF('utf-8','L','Letter',0,0,10.1,10.1,32,29,13.2,13.2);
        $mpdf=new mPDF('utf-8',  array(216,279),0,0,10.1,10.1,24,0,10,10);
       // $mpdf=new mPDF('utf-8', array(216,140),0,0,10.1,10.1,24,0,10,10);
        //se carga el estilo CSS
        $stylesheet = file_get_contents('assets/css/style-pdf.css');
        $mpdf->WriteHTML($stylesheet,1);
        //Carga el header
        $mpdf->SetHTMLHeader('<div class="cabecera"> <IMG SRC="assets/img/header.png"></ div>');
        //Carga el contenido del HTML
        $mpdf-> WriteHTML ($tabla,2);
        //Carga el Footer
      //  $mpdf-> SetHTMLFooter('<div class="footer"> <IMG SRC="assets/img/footer.jpg"> </div>');
        $mpdf->Output('Pedido_'.$Id_Pedidos.'.pdf','I');

    }

}
?>