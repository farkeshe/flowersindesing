<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class trackingPedido extends REST_Controller 
{
     public function __construct()
    {
        parent::__construct();

        //cargamos la libreria para crear una variable de session
        $this->load->library('session');

        //cargamos los modelos
        $this->load->model('Usuario');
        $this->load->model('Item_Pedido');
        $this->load->model('Tracking_Pedido');
        $this->load->model('Pedidos');

        //cargamos la libreria bitauth
        $this->load->library('bitauth');

        //if(!$this->bitauth->logged_in()) 
        //{
         //   $this->response('Session Terminada',302);
        //}

    }

    public function cargarPedidos_get()
    {
        $idUsuario = $this->get('idUsuario');
        $idPerfil = $this->get('idPerfil');
        try 
        {
            $P= new Pedidos();
              //si el perfil es vendedor(4) o vendedor exterior (5)
            if($idPerfil == '4' or $idPerfil == '5')
            {
                $P->where('Id_Vendedor',$idUsuario);
            }
            //si el perfil es supervisor (3)
            if($idPerfil == '3')
            {
                $P->where('Responsable',$idUsuario);
            }    
            //si el perfil es asistente (6)
            if($idPerfil == '6')
            {
                $P->where('Id_Usuario',$idUsuario);
            }
            $P->get();
            $this->response($P->all_to_array());  
        } 
        catch (Exception $e) 
        {
            
        }
    }

    public function cargarItems_get()
    {
        $id = $this->get('id');

        try 
        {
            $I= new Item_Pedido();
            $I->where('Id_Pedido',$id);
            $I->get();
            $this->response($I->all_to_array());  
        } 
        catch (Exception $e) 
        {
            
        }
    }

    public function cargarUsuarios_get()
    {
        try 
        {
            $U= new Usuario();
            $U->get();
            $this->response($U->all_to_array());  
        } 
        catch (Exception $e) 
        {
            
        }
    }

     public function filtrarTracking_post()
    {

        $sqlFiltros= '';
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }

        try 
        {
            $sql =  "SELECT Tracking_Pedido.Id_Pedido, Tracking_Pedido.Fecha, Tracking_Pedido.Tipo_Accion, Tracking_Pedido.Despachado, Tracking_Pedido.Entregado, Clase.Nombre AS Clase, Usuario.User";
            $sql .= " FROM Tracking_Pedido";
            $sql .= " INNER JOIN Clase ON Clase.Id_Clase = Tracking_Pedido.Id_Clase";
            $sql .= " INNER JOIN Usuario ON Usuario.Id_Usuario = Tracking_Pedido.Id_Usuario";
            $sql .= " INNER JOIN Pedidos ON Pedidos.Id_Pedidos = Tracking_Pedido.Id_Pedido";

             //si el perfil es vendedor(4) o vendedor exterior (5)
            if($post['idPerfil'] == '4' or $post['idPerfil'] == '5')
            {
                $sqlFiltros .= " WHERE Pedidos.Id_Vendedor = '".$post['idUsuario']."'";
            }
            //si el perfil es supervisor (3)
            if($post['idPerfil'] == '3')
            {
                $sqlFiltros .= " WHERE Pedidos.Responsable = '".$post['idUsuario']."'";
            }    
            //si el perfil es asistente (6)
            if($post['idPerfil'] == '6')
            {
                $sqlFiltros .= " WHERE Pedidos.Id_Usuario = '".$post['idUsuario']."'";
            }
           

            /*se muestran todas las cotizaciones (perfil gerente)
            validaciones para los filtros*/
            if ($post["idPedido"] !== '0')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Tracking_Pedido.Id_Pedido='".$post["idPedido"]."'";
                }
                else
                {
                    $sqlFiltros .= " AND Tracking_Pedido.Id_Pedido='".$post["idPedido"]."'";   
                }
            }

            if($post["idClase"] !=='0')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Tracking_Pedido.Id_Clase='".$post["idClase"]."'";
                }
                else
                {
                    $sqlFiltros .= " AND Tracking_Pedido.Id_Clase='".$post["idClase"]."'";
                }       
            }

            if($post["idUsuarioFiltro"] !=='0')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Tracking_Pedido.Id_Usuario='".$post["idUsuarioFiltro"]."'";
                }
                else
                {
                    $sqlFiltros .= " AND Tracking_Pedido.Id_Usuario='".$post["idUsuarioFiltro"]."'";
                }       
            }

            if($post["fechaDesde"] !=='' AND $post["fechaHasta"] !=='')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Tracking_Pedido.Fecha BETWEEN '".$post["fechaDesde"]."' AND '".$post["fechaHasta"]."'";
                }
                else
                {
                    $sqlFiltros .= " AND Tracking_Pedido.Fecha BETWEEN '".$post["fechaDesde"]."' AND '".$post["fechaHasta"]."'";
                }         
            }
                             
            $query = $this->db->query($sql.$sqlFiltros.' ORDER BY Tracking_Pedido.Fecha DESC');
            $this->response($query->result_array());

        } 
        catch (Exception $e) 
        {
            
        }
    }

}
?>
