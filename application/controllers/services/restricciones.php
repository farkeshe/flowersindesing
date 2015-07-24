<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class Restricciones extends REST_Controller 
{
	//restricciones de quien puede emitir
	    public function restriccionEmitir_get()
    {
        $idUsuario = $this->get('id');
        try
        {
            $this->load->model('Assoc_Restricciones');
            $a = new Assoc_Restricciones();
            $a->where(array('Id_Restricciones'=> '1','Id_Usuario'=>$idUsuario));
            $a->get();
            $this->response($a->all_to_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }


    //restriccion de quien puede editar el precio
    public function restriccionEditarPrecio_get()
    {
        $id = $this->get('id');
        try
        {
            $this->load->model('Assoc_Restricciones');
            $ar= new Assoc_Restricciones();
            $ar->where(array('Id_Restricciones'=>'2','Id_Usuario'=>$id));
            $ar->get();
            $this->response($ar->all_to_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    //restriccion de centro de negocio
    public function buscarProducto_get()
    {
    	$nombre = $this->get('nombre');
        //$idUsuario = $this->get('idUsuario');

    	try
    	{
    	 if($nombre != ""){
           $sql = "SELECT Producto.Id_Producto, Producto.Nombre, Producto_Lista.Precio 
            FROM Producto, Producto_Lista, Lista_Precio 
            WHERE
            Producto.Estado = 'Activo' AND 
            Producto.Id_Producto = Producto_Lista.Id_Producto AND
            Producto_Lista.Id_ListaPrecio = Lista_Precio.Id_ListaPrecio AND
            Producto_Lista.Estado = 1 AND
            Lista_Precio.Estado = 1 AND Producto.Nombre LIKE '%".$nombre."%'";

            $query = $this->db->query($sql);
            $this->response($query->result_array());
         }
         else{
         $sql = "SELECT Producto.Id_Producto, Producto.Nombre, Producto_Lista.Precio 
            FROM Producto, Producto_Lista, Lista_Precio 
            WHERE
            Producto.Estado = 'Activo' AND 
            Producto.Id_Producto = Producto_Lista.Id_Producto AND
            Producto_Lista.Id_ListaPrecio = Lista_Precio.Id_ListaPrecio AND
            Producto_Lista.Estado = 1 AND
            Lista_Precio.Estado = 1";

            $query = $this->db->query($sql);
            $this->response($query->result_array());
        }

    	}
	 	catch(Exception $e)
	 	{
        	$this->response(array('error'=>$e->getMessage()),404);
      	}
    }

    //restriccion por listas de precios
    public function buscarListaPrecio_get()
    {
     
        $idUsuario = $this->get('idUsuario');
        $idAssocArticulo = $this->get('idAssocArticulo');
        $idSubgerencia = $this->get('idSubgerencia');
        $idPerfil = $this->get('idPerfil');
        try
        {

            $sql =  "SELECT Lista_Precio.Nombre, Lista_Precio.Tipo, Lista_Precio.Estado, Assoc_Lista.Precio, Subgerencia.Nombre AS Subgerencia, Subgerencia.Id_Subgerencia";
            $sql .= " FROM Assoc_Lista";
            $sql .= " INNER JOIN Lista_Precio ON Assoc_Lista.Id_ListaPrecio = Lista_Precio.Id_ListaPrecio";
            $sql .= " INNER JOIN Subgerencia ON Subgerencia.Id_Subgerencia = Lista_Precio.Id_Subgerencia";
            $sql .= " WHERE Lista_Precio.Estado = 'Activa'";
            $sql .= " AND Assoc_Lista.Id_AssocArticulo ='".$idAssocArticulo."'"; 
            if($idPerfil != '2')
            {
                $sql .= " AND Lista_Precio.Id_Subgerencia ='".$idSubgerencia."'";
            }
            $sql .= " AND Lista_Precio.Tipo NOT IN(SELECT Assoc_Restricciones.Valor FROM Assoc_Restricciones 
                      WHERE Assoc_Restricciones.Id_Restricciones = '6' AND
                      Assoc_Restricciones.Id_Usuario = '".$idUsuario."')";

            $query = $this->db->query($sql);
            $this->response($query->result_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    // cuenta las cotizaciones que ha realizado el usuario en el mes actual
    public function cantidadCotizaciones_get()
    {
        $idUsuario = $this->get('idUsuario');

        try 
        {
            $sql =  "SELECT Count(Pedidos.Id_Pedidos) AS CantidadCotizacion";
            $sql .= " FROM Pedidos";
            $sql .= " WHERE Pedidos.Id_Usuario = '".$idUsuario."'";
            $sql .= " AND MONTH(Pedidos.Fecha_Cot) = MONTH('".date("Y-m-d H:i:s")."')";

            $query = $this->db->query($sql);
            $this->response($query->result_array());

        } 
        catch (Exception $e) 
        {
            
        }
    }

    // busca la cantidad de cotizaciones que tiene asignado el usuario
    public function maximoCotizaciones_get()
    {
        $idUsuario = $this->get('idUsuario');

        try 
        {
            $sql =  "SELECT Valor";
            $sql .= " FROM Assoc_Restricciones";
            $sql .= " WHERE Assoc_Restricciones.Id_Usuario = '".$idUsuario."'";
            $sql .= " AND Id_Restricciones = '3'";

            $query = $this->db->query($sql);
            $this->response($query->result_array());

        } 
        catch (Exception $e) 
        {
            
        }
    }

    //restriccion por valor neto
    public function maximoneto_get()
    {
         $idUsuario = $this->get('idUsuario');

        try 
        {
            $sql =  "SELECT Valor";
            $sql .= " FROM Assoc_Restricciones";
            $sql .= " WHERE Assoc_Restricciones.Id_Usuario = '".$idUsuario."'";
            $sql .= " AND Id_Restricciones = '4'";

            $query = $this->db->query($sql);
            $this->response($query->result_array());

        } 
        catch (Exception $e) 
        {
            
        }
    }

}
?>
