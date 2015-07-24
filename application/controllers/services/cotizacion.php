<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class Cotizacion extends REST_Controller 
{
     public function __construct()
    {
        parent::__construct();

        //cargamos la libreria para crear una variable de session
        $this->load->library('session');

        //cargamos los modelos
        $this->load->model('usuario');
        $this->load->model('job');
        $this->load->model('entidad');

        //cargamos la libreria bitauth
        $this->load->library('bitauth');

       // if(!$this->bitauth->logged_in()) 
        //{
          // $this->response('Session Terminada',302);
        //}


    }

	public function index_post()
	{
		$post = array(); 
        foreach($this->post() as $key => $value){
            $post[$key] = $value;
        }
		try
    	{      
	   		$e = new Entidad();
	   		$e->where(array('Tipo_Entidad'=>'Cliente','Estado'=>'1'))->like('Nombre', $post['palabra'], 'both');
	   		$e->get();
	 		$this->response($e->all_to_array());
	 	}
	 	catch(Exception $e)
	 	{
        	$this->response(array('error'=>$e->getMessage()),404);
      	}
	}

    public function buscarUsuario_get()
    {
    	$id = $this->get('id');
    	try
    	{
    		$u= new Usuario();
    		$u->where(array('Id_Usuario'=>$id,'Estado'=>'1'))->get();

            if(count($u->all_to_array())==0){
                $this->response(array('error'=>'202'),202);
            }else{
                $this->response($u->all_to_array());
            }
    	}
	 	catch(Exception $e)
	 	{
        	$this->response(array('error'=>$e->getMessage()),404);
      	}
    }

    public function buscardisponibilidad_get()
    {      
        $fecha = $this->get('fecha');
        $cond = " WHERE Pedidos.FechaHoraDespacho like '".$fecha."%'";
        try
        {
            $sql= "SELECT
            Count(Pedidos.Id_Pedidos),
            Lugar.Id_Sector,
            Pedidos.FechaHoraDespacho
            FROM
            Pedidos
            INNER JOIN Destino ON Destino.Id_Destino = Pedidos.Id_Destinatario
            INNER JOIN Lugar ON Destino.Id_Lugar = Lugar.Id_Lugar".$cond.
            "GROUP BY
            Lugar.Id_Sector,
            Pedidos.FechaHoraDespacho
            ORDER BY Pedidos.FechaHoraDespacho";
            $query = $this->db->query($sql);
            if (count($query->result_array())==0) {
                $this->response(array('error'=>'202'),202);
            }else{
                $this->response($query->result_array());
            }
        } 
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function buscarRut_get()
    {
    	$id = $this->get('id');
    	try
    	{
    		$e= new Entidad();
    		$e->where(array('Rut_Entidad'=>$id,'Estado'=>'1'));
    		$e->get();
    		$this->response($e->all_to_array());
    	}
	 	catch(Exception $e)
	 	{
        	$this->response(array('error'=>$e->getMessage()),404);
      	}
    }

    public function buscarDestinatario_get()
    {
        $id = $this->get('id');
        
        try
        {
            $c= new Destino();
            $c->where(array('Rut_Entidad'=>$id,'Estado'=>1));
            $c->get();
            if (count($c->all_to_array())==0) {
                $this->response(array('error'=>'202'),202);
            }else{
                $this->response($c->all_to_array());
            }
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),202);
        }
    }


    public function buscardatosDestinatario_get()
    {
        $id = $this->get('id');
        try
        {
            $cond = " WHERE Id_Destino =".$id;
            $sql= "SELECT
            Destino.Direccion,
            Destino.Telefono,
            Destino.Nombre_Contacto,
            Destino.Id_Destino,
            Lugar.Nombre AS nombrelugar,
            Sector.Nombre AS nombresector,
            Sector.PrecioFlete,
            Sector.Id_Sector
            FROM
            Destino
            INNER JOIN Lugar ON Destino.Id_Lugar = Lugar.Id_Lugar
            INNER JOIN Sector ON Lugar.Id_Sector = Sector.Id_Sector".$cond;
            $query = $this->db->query($sql);
            $this->response($query->result_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function valorIVA_get()
    {
         try
        { 
            $s= new Sistema();
            $s->where('Tipo','IVA');
            $s->get();
            $this->response($s->Valor);
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }

    }

    public function grabarCotizacion_post()
    {
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }
        try
        {
            $P= new Pedidos();
            $P->Id_Clase=$post["Id_Clase"];

            if ($post["Cliente"] !== '')
                $P->Cliente=$post["Cliente"];
            else
                $P->Cliente=null;

            if ($post["Rut_Entidad"] !== '')
                $P->Rut_Entidad=$post["Rut_Entidad"];
            else
                $P->Rut_Entidad=null;

            $P->Id_Destinatario=$post["Id_Destinatario"];
            $P->Id_Usuario=$post["Id_Vendedor"];
            $P->Fecha_Pedido=$post["Fecha_Ped"];
            $P->Id_Vendedor=$post["Id_Vendedor"];
            $P->Responsable=$post["Responsable"];
            $P->Total_Flete=$post["Total_Flete"];
            $P->Valor_Neto=$post["Valor_Neto"];
            $P->Descuento=$post["Descuento"];
            $P->Iva=$post["Iva"];
            $P->Total=$post["Total"];

            if ($post["Observaciones_Fabricacion"] !== '')
                $P->Observaciones_Fabricacion=$post["Observaciones_Fabricacion"];
            else
                $P->Observaciones_Fabricacion=null;

            if ($post["Observaciones_Despacho"] !== '')
                $P->Observaciones_Despacho=$post["Observaciones_Despacho"];
            else
                $P->Observaciones_Despacho=null;

            if ($post["Observaciones_Generales"] !== '')
                $P->Observaciones=$post["Observaciones_Generales"];
            else
                $P->Observaciones=null;

            $P->Id_Sucursal=$post["Id_Subgerencia"];

            $P->FechaHoraDespacho=$post["FechaHoraDespacho"];
            $P->save();

            $idPed= $this->db->insert_id();
            //Guardando Registro en el Tracking
            $T= new Tracking_Pedido();
            $T->Id_Pedido=$idPed;
            $T->Id_Clase=$post["Id_Clase"];
            $T->Id_Usuario=$post["Id_Vendedor"];
            $T->Fecha= date("Y-m-d H:i:s");
            $T->Tipo_Accion= 'Creación del Pedido';
            $T->save();
            
            $this->response($idPed);
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }

    }

    public function grabarItemTracking_post()
    {
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }

        try
        {
            //Guardando cada Item del Pedido
            $I= new Item_Pedido();
            $I->Id_Pedido=$post["Id_Pedido"];
            $I->Cantidad=$post["Cantidad"];
            $I->Id_Producto=$post["Id_Producto"];
            $I->Precio_Unitario=$post["Precio_Unitario"];
            $I->Precio_Total=$post["Precio_Total"];
            $Item= $I->save();

            if ($Item)
            {
                $this->response('true');
            }
            else
            {
                $this->response('false');
            }

        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function buscarCotizacion_get()
    {
        $idCotizacion = $this->get('idCotizacion');
        
        try
        {   
            $sql =  "SELECT Pedidos.Id_Sucursal, Pedidos.Responsable AS Id_Responsable, Pedidos.Id_Vendedor, Pedidos.Id_Usuario, Pedidos.Id_Pedidos, Pedidos.Id_Clase,Pedidos.Observaciones_Fabricacion, Pedidos.Observaciones_Despacho, Pedidos.Observaciones, Pedidos.Total, Pedidos.Iva, Pedidos.Descuento, Pedidos.Valor_Neto, Pedidos.Total_Flete, Entidad.Nombre AS nombreCliente, Entidad.Direccion AS direcionCliente, Entidad.Telefono AS telefonoCliente, Entidad.Email AS emailCliente, Entidad.Rut_Entidad AS rutCliente,Destino.Nombre_Contacto as nombredestino,Destino.Direccion as direcciondestino,Destino.Telefono as telefonodestino, Pedidos.Fecha_pedido, Vendedor.Nombre AS nombreVendedor,Vendedor.Email AS emailVendedor,Vendedor.Celular AS celularVendedor,Vendedor.Telefono AS telefonoVendedor,Responsable.Nombre AS Responsable, Sucursal.Nombre AS Sucursal, Pedidos.FechaHoraDespacho,Pedidos.Id_Destinatario,Date(FechaHoraDespacho) as fechaDespacho,Time(FechaHoraDespacho) as horaDespacho ";
            $sql .= " FROM Pedidos";
            $sql .= " LEFT JOIN Entidad ON Entidad.Rut_Entidad = Pedidos.Rut_Entidad";
            $sql .= " INNER JOIN Destino ON Destino.Id_Destino = Pedidos.Id_Destinatario";
            $sql .= " INNER JOIN Usuario AS Vendedor ON Vendedor.Id_Usuario = Pedidos.Id_Vendedor";
            $sql .= " INNER JOIN Usuario AS Responsable ON Responsable.Id_Usuario = Pedidos.Responsable";
            $sql .= " INNER JOIN Sucursal ON Sucursal.Id_Sucursal = Pedidos.Id_Sucursal";
            $sql .= " WHERE Pedidos.Id_Pedidos = '".$idCotizacion."'";

            $query = $this->db->query($sql);
            //guardamos el array de la consulta en una variable de session para ser exportada
            $this->session->set_userdata('pedido', $query->result_array());
            $this->response($query->result_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function buscarItems_get()
    {
        $idCotizacion = $this->get('idCotizacion');

        try 
        {
            $sql =  "SELECT Item_Pedido.Id_ItemPedido, Item_Pedido.Id_Pedido, Item_Pedido.Cantidad, Item_Pedido.Id_Producto, Item_Pedido.Precio_Total,Item_Pedido.Precio_Unitario,Producto.Nombre as nombreproducto, Producto.Estado as estadoproducto";
            $sql .= " FROM Item_Pedido";
            $sql .= " INNER JOIN Producto ON Item_Pedido.Id_Producto = Producto.Id_Producto";
            $sql .= " WHERE Id_Pedido = '".$idCotizacion."'";
            
            $query = $this->db->query($sql);    
            //guardamos el array de la consulta en una variable de session para ser exportada
            $this->session->set_userdata('items', $query->result_array());
            $this->response($query->result_array());
         
        } 
        catch (Exception $e) 
        {
                
        }    
    }


    public function actualizarCotizacion_post()
    {
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }

        try 
        {
            $sql =  "UPDATE Pedidos";
            $sql .= " SET Cliente='".$post["Cliente"]."', Id_Usuario='".$post["Id_Vendedor"]."',";

            if ($post["Rut_Entidad"] !== '')
                $sql .= " Rut_Entidad='".$post["Rut_Entidad"]."',";
            else
                $sql .= " Rut_Entidad=null,";

            $sql .= " Fecha_Pedido='".$post["Fecha_Ped"]."', Id_Vendedor='".$post["Id_Vendedor"]."',";
            $sql .= " Responsable='".$post["Responsable"]."',Total_Flete='".$post["Total_Flete"]."',";
            $sql .= " Valor_Neto='".$post["Valor_Neto"]."', Descuento='".$post["Descuento"]."', Iva='".$post["Iva"]."', Total='".$post["Total"]."',";
            $sql .= " Observaciones_Despacho='".$post["Observaciones_Despacho"]."', Observaciones_Fabricacion='".$post["Observaciones_Fabricacion"]."', Observaciones='".$post["Observaciones_Generales"]."',";
            $sql .= " Id_Sucursal='".$post["Id_Subgerencia"]."',FechaHoraDespacho='".$post["FechaHoraDespacho"]."', Id_Destinatario='".$post["Id_Destinatario"]."'";   
            $sql .= " WHERE Id_Pedidos='".$post["Id_Pedidos"]."'"; 
            $query = $this->db->query($sql); 

            // $idPed= $this->db->insert_id();
            //Guardando Registro en el Tracking
            $T= new Tracking_Pedido();
            $T->Id_Pedido= $post["Id_Pedidos"];
            $T->Id_Clase=$post["Id_Clase"];
            $T->Id_Usuario=$post["Id_Vendedor"];
            $T->Fecha= date("Y-m-d H:i:s");
            $T->Tipo_Accion= 'Creación de Pedido (Edición)';
            $Tracking = $T->save();  
            
            $this->response($query);
        } 
        catch (Exception $e)
        {
            
        }
    }

    public function actualizarItemTracking_post()
    {
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }

        try
        {
            if($post["Id_ItemPedido"]=='New')
            {
                //Guardando cada Item del Pedido
                $I= new Item_Pedido();
                $I->Id_Pedido=$post["Id_Pedido"];
                $I->Cantidad=$post["Cantidad"];
                $I->Id_Producto=$post["Id_Producto"];
                $I->Precio_Unitario=$post["Precio_Unitario"];
                $I->Precio_Total=$post["Precio_Total"];
                $Item= $I->save();

                if ($Item)
                {
                    $this->response('true');
                }
                else
                {
                    $this->response('false');
                }
            }
            else
            {
                //actualizamos los items del pedido
                $sql =  "Update Item_Pedido";
                $sql .= " SET Cantidad ='".$post["Cantidad"]."', Id_Producto='".$post["Id_Producto"]."',"; 
                $sql .= " Precio_Unitario='".$post["Precio_Unitario"]."', Precio_Total='".$post["Precio_Total"]."'";
                $sql .= " WHERE Id_ItemPedido = '".$post["Id_ItemPedido"]."'";
                $sql .= " AND Id_Pedido = '".$post["Id_Pedido"]."'";
                $query = $this->db->query($sql);

                if ($query)
                {
                    $this->response('true');
                }
                else
                {
                    $this->response('false');
                }
            }

        }
        catch (Exception $e) 
        {
            
        }

    }

    public function deleteRowItem_post()
    {
        $post = json_decode($_POST['jObject'], true);
        
        try 
        {
            for ( $i = 0 ; $i < count($post) ; $i ++) 
            {
                $sql =  "DELETE FROM Item_Pedido";
                $sql .= " WHERE Id_ItemPedido = '".$post[$i]."'";
                $this->db->query($sql);
            }
            
        } 
        catch (Exception $e) 
        {
            
        }
    }

    public function obtenerfechahora_get()
    {
        try 
        {
            $this->response(date("d/m/Y H-i-s")); 
        }  
        catch (Exception $e) 
        {
            
        }
    }
}
?>