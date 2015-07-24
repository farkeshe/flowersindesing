<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class ListadoCotizacion extends REST_Controller 
{

    public function __construct()
    {
        parent::__construct();

        //cargamos la libreria para crear una variable de session
        $this->load->library('session');
        //cargamos los modulos
        $this->load->model('clase');
        $this->load->model('usuario');
        $this->load->model('assoc_restricciones');
        $this->load->model('item_pedido');
        $this->load->model('producto');
        $this->load->model('pedidos');
        $this->load->model('tracking_pedido');
        $this->load->model('tracking_entregado');
        $this->load->model('opcionesanulacion');
        $this->load->model('tracking_anulada');
        //cargamos la libreria bitauth
        $this->load->library('bitauth');

       //if(!$this->bitauth->logged_in()) 
        //{
         //  $this->response('Session Terminada',302);
        //}


    }


    public function index_post()
    {
        $post = array(); 
        $sqlFiltros= '';
        $group= '';
        foreach($this->post() as $key => $value){
            $post[$key] = $value;
        }
        
        try
        {
            $sql =  " SELECT Pedidos.Id_Pedidos,Pedidos.FechaHoraDespacho, Pedidos.Cliente, Clase.Nombre as Clase, Destino.Nombre_Contacto, Usuario.Nombre as Vendedor, Pedidos.Total";
            $sql.=  " FROM Pedidos";
            $sql.=  " INNER JOIN Destino ON Destino.Id_Destino = Pedidos.Id_Destinatario";
            $sql.=  " INNER JOIN Clase ON Pedidos.Id_Clase = Clase.Id_Clase";
            $sql.=  " INNER JOIN Usuario ON Pedidos.Id_Vendedor = Usuario.Id_Usuario";
            $sql.=  " INNER JOIN Item_Pedido ON Item_Pedido.Id_Pedido = Pedidos.Id_Pedidos";
            
            //si el perfil es vendedor(4) o vendedor exterior (5)
           // if($post['idPerfil'] == '4' or $post['idPerfil'] == '5')
            //{
            //    $sqlFiltros .= " WHERE Pedidos.Id_Vendedor = '".$post['idUsuario']."'";
            //}
           //si el perfil es supervisor (3)
          //  if($post['idPerfil'] == '3')
            //{
              //  $sqlFiltros .= " WHERE Pedidos.Responsable = '".$post['idUsuario']."'";
           // }    
            //si el perfil es asistente (6)
           // else if($post['idPerfil'] == '6')
           // {
           //     $sqlFiltros .= " WHERE Pedidos.Id_Usuario = '".$post['idUsuario']."'";
           // }
            //else
           // {
                /*se filtra por el responsable o vendedor seleccionado en los filtros 
                y si no hay seleccionados se muestran todas las cotizaciones (perfil gerente)*/
                // if($post['idResponsable'] !== '0')
                // {
                //     if($sqlFiltros =='')
                //     {
                //         $sqlFiltros .= " WHERE dbPedidos.Pedidos.Responsable='".$post['idResponsable']."'";
                //     }
                //     else
                //     {
                //         $sqlFiltros .= " AND dbPedidos.Pedidos.Responsable='".$post['idResponsable']."'";
                //     }    
                // }

             //   if($post['idVendedor'] !=='0')
               // {
                //    if($sqlFiltros =='')
                //    {
                 //       $sqlFiltros .= " WHERE Pedidos.Id_Vendedor='".$post['idVendedor']."'";
                  //  }
                  //  else
                  //  {
                  //      $sqlFiltros .= " AND Pedidos.Id_Vendedor='".$post['idVendedor']."'";
                  //  }    
               // }
           // }
            //validaciones para el resto de los filtros
            if ($post['idClase'] !== '0')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Pedidos.Id_Clase='".$post['idClase']."'";
                }
                else
                {
                    $sqlFiltros .= " AND Pedidos.Id_Clase='".$post['idClase']."'";   
                }
            }
            if ($post['idClase'] == '0')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Pedidos.Id_Clase=3";
                }
                else
                {
                    $sqlFiltros .= " AND Pedidos.Id_Clase=3";   
                }
            }
           
            if($post['idCliente'] !== '') 
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Pedidos.Rut_Entidad='".$post['idCliente']."'";
                }
                else
                {
                    $sqlFiltros .= " AND Pedidos.Rut_Entidad='".$post['idCliente']."'";
                }    
            }

            if($post['idDestinatario'] !=='0')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Pedidos.Id_Destinatario='".$post['idDestinatario']."'";
                }
                else
                {
                    $sqlFiltros .= " AND Pedidos.Id_Destinatario='".$post['idDestinatario']."'";
                }       
            }

            if($post['idProducto'] !=='0')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Item_Pedido.Id_Producto='".$post['idProducto']."'";
                }
                else
                {
                    $sqlFiltros .= " AND Item_Pedido.Id_Producto='".$post['idProducto']."'";
                }         
            }

            if($post['fechaDesde'] !=='' AND $post['fechaHasta'] !=='')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Pedidos.FechaHoraDespacho BETWEEN '".$post['fechaDesde']."' AND '".$post['fechaHasta']."'";
                }
                else
                {
                    $sqlFiltros .= " AND Pedidos.FechaHoraDespacho BETWEEN '".$post['fechaDesde']."' AND '".$post['fechaHasta']."'";
                }         
            }        
            $group.= ' GROUP BY Item_Pedido.Id_Pedido';
            $query = $this->db->query($sql.$sqlFiltros.$group.' ORDER BY Pedidos.FechaHoraDespacho DESC '.' LIMIT '.$post['start'].', 14');
            $exportar = $this->db->query($sql.$sqlFiltros);
            //guardamos el array de la consulta en una variable de session para ser exportada
            $this->session->set_userdata('data', $exportar->result_array());
            $this->response($query->result_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function cargarFiltroClase_get()
    {
        try
        {
            $c= new Clase();
            $c->get();
            $this->response($c->all_to_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function cargarFiltroResponsable_get()
    {
        try
        {
            $u= new Usuario();
            $perfiles = array('2','3');
            $u->where_in('Id_Perfil',$perfiles);
            $u->where('Estado','1');
            $u->get();
            $this->response($u->all_to_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function cargarFiltroVendedor_get()
    {
        try
        {
            $u= new Usuario();
            $u->where('Estado','1');
            $u->get();
            $this->response($u->all_to_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function cargarFiltroCentroNegocio_get()
    {
        $idUsuario = $this->get('id');
        try
        {
            $a= new Assoc_Restricciones();
            $a->where(array('Id_Restricciones'=>'5','Id_Usuario'=>$idUsuario));
            $a->get();

            $c= new Centro_Negocio();
            $c->where_not_in('Id_Centro',$a->Valor);
            $c->get();
            
            $this->response($c->all_to_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function cargarFiltroFormas_get()
    {
        try
        {
            $f= new Formas();
            $f->get();
            $this->response($f->all_to_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function cargarFiltroProducto_get()
    {
        try
        {
            
            $a= new Producto();
            $a->where('Estado','activo');
            $a->get();
            $this->response($a->all_to_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function contarRegistros_post()
    {
        $post = array(); 
        $sqlFiltros= '';
        $group= '';
        foreach($this->post() as $key => $value){
            $post[$key] = $value;
        }
        
        try
        {   
            $sql =  " SELECT sum(filtro.Total) AS Cantidad_Total from";
            $sql.=  " (SELECT Count(Distinct Pedidos.Id_Pedidos) AS Total";
            $sql.=  " FROM Pedidos";
            $sql.=  " INNER JOIN Destino ON Destino.Id_Destino = Pedidos.Id_Destinatario";
            $sql.=  " INNER JOIN Clase ON Pedidos.Id_Clase = Clase.Id_Clase";
            $sql.=  " INNER JOIN Usuario ON Pedidos.Id_Vendedor = Usuario.Id_Usuario";
            $sql.=  " INNER JOIN Item_Pedido ON Item_Pedido.Id_Pedido = Pedidos.Id_Pedidos";
            //si el perfil es vendedor(4) o vendedor exterior (5)
            if($post['idPerfil'] == '4' or $post['idPerfil'] == '5')
            {
                $sqlFiltros .= " WHERE Pedidos.Id_Vendedor = '".$post['idUsuario']."'";
            }
            //si el perfil es supervisor (3)
            else if($post['idPerfil'] == '3')
            {
                $sqlFiltros .= " WHERE Pedidos.Responsable = '".$post['idUsuario']."'";
            }    
            //si el perfil es asistente (6)
            else if($post['idPerfil'] == '6')
            {
                $sqlFiltros .= " WHERE Pedidos.Id_Usuario = '".$post['idUsuario']."'";
            }
            else
            {
                /*se filtra por el responsable o vendedor seleccionado en los filtros 
                y si no hay seleccionados se muestran todas las cotizaciones (perfil gerente)*/
                // if($post['idResponsable'] !== '0')
                // {
                //     if($sqlFiltros =='')
                //     {
                //         $sqlFiltros .= " WHERE dbPedidos.Pedidos.Responsable='".$post['idResponsable']."'";
                //     }
                //     else
                //     {
                //         $sqlFiltros .= " AND dbPedidos.Pedidos.Responsable='".$post['idResponsable']."'";
                //     }    
                // }

                if($post['idVendedor'] !=='0')
                {
                    if($sqlFiltros =='')
                    {
                        $sqlFiltros .= " WHERE Pedidos.Id_Vendedor='".$post['idVendedor']."'";
                    }
                    else
                    {
                        $sqlFiltros .= " AND Pedidos.Id_Vendedor='".$post['idVendedor']."'";
                    }    
                }
            }
            //validadciones para el resto de los filtros
            if ($post['idClase'] !== '0')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Pedidos.Id_Clase='".$post['idClase']."'";
                }
                else
                {
                    $sqlFiltros .= " AND Pedidos.Id_Clase='".$post['idClase']."'";   
                }
            }

            if($post['idCliente'] !== '') 
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Pedidos.Rut_Entidad='".$post['idCliente']."'";
                }
                else
                {
                    $sqlFiltros .= " AND Pedidos.Rut_Entidad='".$post['idCliente']."'";
                }    
            }

            if($post['idDestinatario'] !=='0')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Pedidos.Id_Destinatario ='".$post['idDestinatario']."'";
                }
                else
                {
                    $sqlFiltros .= " AND Pedidos.Id_Destinatario='".$post['idDestinatario']."'";
                }       
            }

            if($post['idProducto'] !=='0')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Item_Pedido.Id_Producto='".$post['idProducto']."'";
                }
                else
                {
                    $sqlFiltros .= " AND Item_Pedido.Id_Producto='".$post['idProducto']."'";
                }         
            }

            if($post['fechaDesde'] !=='' AND $post['fechaHasta'] !=='')
            {
                if($sqlFiltros =='')
                {
                    $sqlFiltros .= " WHERE Pedidos.FechaHoraDespacho BETWEEN '".$post['fechaDesde']."' AND '".$post['fechaHasta']."'";
                }
                else
                {
                    $sqlFiltros .= " AND Pedidos.FechaHoraDespacho BETWEEN '".$post['fechaDesde']."' AND '".$post['fechaHasta']."'";
                }         
            }
                      
            $group= ' GROUP BY Item_Pedido.Id_Pedido';       
            $query = $this->db->query($sql.$sqlFiltros.$group.')filtro');
            $this->response($query->result_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function cargarVendedores_get()
    {
        $id = $this->get('id');
        try
        {
            $sql =  "SELECT Supervisor.Nombre AS Supervisor, Usuario.Supervisor AS Id_Supervisor, Usuario.Nombre, Sucursal.Nombre AS Sucursal, Usuario.Id_Usuario, Perfil_Usuario.Tipo AS Perfil";
            $sql .= " FROM Usuario";
            $sql .= " LEFT JOIN Usuario AS Supervisor ON Usuario.Supervisor = Supervisor.Id_Usuario";
            $sql .= " INNER JOIN Sucursal ON Sucursal.Id_Sucursal = Usuario.Id_Sucursal";
            $sql .= " INNER JOIN Perfil_Usuario ON Perfil_Usuario.Id_Perfil = Usuario.Id_Perfil";

            if($id=='2')
            {
                $sql .= " WHERE Usuario.Id_Perfil <> '1' AND Usuario.Id_Perfil <> '6'"; 
            }

            if($id=='3')
            {
                $sql .= " WHERE Usuario.Supervisor = '".$id."'"; 
            }
            
            $query = $this->db->query($sql);
            $this->response($query->result_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }

    }

    public function updateVendedores_put()
    {
        $idVendedor = $this->get('idVendedor');
        $idSupervisor = $this->get('idSupervisor');
        $idCotizacion = $this->get('idCotizacion');
        try
        {
            $P = new Pedidos();
            $P->where('Id_Pedidos', $idCotizacion);
            if($idSupervisor=='null')
            {
                $P->update(array ( 'Id_Vendedor' => $idVendedor , 'Responsable' => $idVendedor ));
            }
            else
            {
                $P->update(array ( 'Id_Vendedor' => $idVendedor , 'Responsable' => $idSupervisor ));
            }


            if ($P)
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

     public function eliminarCotizacion_delete()
    {
        $idCotizacion = $this->get('idCotizacion');
        try
        {

            //sql que elimina los item
            $sqlItem =  "DELETE FROM Item_Pedido";
            $sqlItem .= " WHERE Id_Pedido = '".$idCotizacion."'";

            //sql que elimina los pedidos
            $sqlPedido =  "DELETE FROM Pedidos";
            $sqlPedido .= " WHERE Id_Pedidos = '".$idCotizacion."'";

            //sql que elimina el tracking
            $sqlTracking =  "DELETE FROM Tracking_Pedido";
            $sqlTracking .= " WHERE Id_Pedido = '".$idCotizacion."'";
        ;
            $item= $this->db->query($sqlItem);
            $pedido= $this->db->query($sqlPedido);
            $tracking= $this->db->query($sqlTracking);

            if ($item == 'true' and $pedido == 'true' and $tracking == 'true')
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

    public function cambiarClase_put()
    {
        $idCotizacion = $this->get('idCotizacion');
        $clase = $this->get('clase');
        $idUsuario = $this->get('idUsuario');
        try
        {
            $P = new Pedidos();
            $P->where('Id_Pedidos', $idCotizacion);
            $P->update('Id_Clase',$clase);
                
            $T= new Tracking_Pedido();
            $T->Id_Pedido= $idCotizacion;
            $T->Id_Clase= $clase;
            $T->Id_Usuario=$idUsuario;
            $T->Fecha= date("Y-m-d H:i:s");
            $T->Tipo_Accion= 'Cambio de Clase';
            $T->save();

            if ($P and $T)
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

    public function buscarItem_get()
    {
        $idCotizacion = $this->get('idCotizacion');
        try
        { 
            $sql =  "SELECT Item_Pedido.Id_ItemPedido, Item_Pedido.Id_Clase, Item_Pedido.Cantidad, Item_Pedido.Id_Producto, Item_Pedido.Id_Articulo, Item_Pedido.Despachado, Item_Pedido.Entregado, Item_Pedido.Precio_Total, Item_Pedido.Valor_Flete, Item_Pedido.Fecha_Necesidad, Clase.Nombre AS Clase";
            $sql .= " FROM Item_Pedido";
            $sql .= " INNER JOIN Clase ON Clase.Id_Clase = Item_Pedido.Id_Clase";
            $sql .= " WHERE Item_Pedido.Id_Pedido = '".$idCotizacion."'";
            $sql .= " ORDER BY Item_Pedido.Id_ItemPedido ASC";

            $query = $this->db->query($sql);
            $this->response($query->result_array());    
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function ProgressDespachoEntrega_get()
    {
        $idCotizacion = $this->get('idCotizacion');
        try
        { 
            $sql =  "SELECT Count(Item_Pedido.Id_ItemPedido) AS Items, itemsDespachado.Despachado, itemsEntregado.Entregado";
            $sql .= " From";
            $sql .= " (SELECT Count(Item_Pedido.Id_ItemPedido) AS Despachado FROM Item_Pedido WHERE Item_Pedido.Id_Pedido = '".$idCotizacion."' AND Item_Pedido.Cantidad IN (SELECT Item_Pedido.Despachado FROM Item_Pedido WHERE Item_Pedido.Id_Pedido = '".$idCotizacion."'))itemsDespachado,";
            $sql .= " (SELECT Count(Item_Pedido.Id_ItemPedido) AS Entregado FROM Item_Pedido WHERE Item_Pedido.Id_Pedido = '".$idCotizacion."' AND Item_Pedido.Cantidad IN (SELECT Item_Pedido.Entregado FROM Item_Pedido WHERE Item_Pedido.Id_Pedido = '".$idCotizacion."'))itemsEntregado,";
            $sql .= " Item_Pedido";
            $sql .= " WHERE Item_Pedido.Id_Pedido = '".$idCotizacion."'";

            $query = $this->db->query($sql);
            $this->response($query->result_array());    


        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

    public function despacharItem_get()
    {
        $idCotizacion = $this->get('idCotizacion');
        $idItem = $this->get('idItem');
        $cantidad = $this->get('cantidad');
        $idUsuario = $this->get('idUsuario');

        try
        {
            //actualizando la cantidad
            $sql =  "Update Item_Pedido";
            $sql .= " SET Despachado=Despachado + '".$cantidad."'";  
            $sql .= " WHERE Id_ItemPedido = '".$idItem."'";
            $sql .= " AND Id_Pedido = '".$idCotizacion."'";
            $query = $this->db->query($sql);

            //actualizando la clase
            $IP = new Item_Pedido();
            $IP->where(array('Id_Pedido'=> $idCotizacion, 'Id_ItemPedido' => $idItem));
            $IP->get();

            if($IP->Cantidad == $IP->Despachado)
            {
                $I = new Item_Pedido();
                $I->where(array('Id_Pedido'=> $IP->Id_Pedido, 'Id_ItemPedido' => $IP->Id_ItemPedido));
                $I->update('Id_Clase', '7' );
            }

            // Guardando cambios en el Tracking
            $Item = new Item_Pedido();
            $Item->where(array('Id_Pedido'=> $idCotizacion, 'Id_ItemPedido' => $idItem));
            $Item->get();

            $T= new Tracking_Pedido();
            $T->Id_Pedido= $idCotizacion;
            $T->Id_ItemPedido= $Item->Id_ItemPedido;
            $T->Id_Clase= $Item->Id_Clase;
            $T->Id_Usuario=$idUsuario;
            $T->Fecha= date("Y-m-d H:i:s");
            $T->Tipo_Accion= 'Despacho Item';
            $T->Despachado= $cantidad;
            $T->save();

            if ($query == 'true' and $T)
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

    public function cambiarClaseDespachadoPedidos_get()
    {
        $idCotizacion = $this->get('idCotizacion');
        try
        {
            //cambiando la clase del pedido si todos los items fueron despachados
            $sqlPedido = "SELECT Count(Item_Pedido.Id_ItemPedido) AS Items, despachoItems.Items_Despachados";
            $sqlPedido .= " FROM";
            $sqlPedido .= " (SELECT Count(Item_Pedido.Id_ItemPedido) AS Items_Despachados FROM Item_Pedido WHERE Item_Pedido.Cantidad = Item_Pedido.Despachado AND Item_Pedido.Id_Pedido = '".$idCotizacion."')despachoItems,";
            $sqlPedido .= " Item_Pedido";
            $sqlPedido .= " WHERE Item_Pedido.Id_Pedido = '".$idCotizacion."'";

            $query = $this->db->query($sqlPedido);
            foreach ($query->result_array() as $row)
            {
                if($row['Items'] == $row['Items_Despachados'])
                {
                    $P = new Pedidos();
                    $P->where('Id_Pedidos',$idCotizacion);
                    $P->update('Id_Clase', '7' );  
                } 
            }
        } 
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }   

    }

    public function entregarItem_get()
    {
        $idCotizacion = $this->get('idCotizacion');
        $idItem = $this->get('idItem');
        $cantidad = $this->get('cantidad');
        $idUsuario = $this->get('idUsuario');

        try
        {
            //actualizando la cantidad
            $sql =  "Update Item_Pedido";
            $sql .= " SET Entregado=Entregado + '".$cantidad."'";  
            $sql .= " WHERE Id_ItemPedido = '".$idItem."'";
            $sql .= " AND Id_Pedido = '".$idCotizacion."'";
            $query = $this->db->query($sql);

            //actualizando la clase
            $IP = new Item_Pedido();
            $IP->where(array('Id_Pedido'=> $idCotizacion, 'Id_ItemPedido' => $idItem));
            $IP->get();

            if($IP->Cantidad == $IP->Entregado)
            {
                $I = new Item_Pedido();
                $I->where(array('Id_Pedido'=> $IP->Id_Pedido, 'Id_ItemPedido' => $IP->Id_ItemPedido));
                $I->update('Id_Clase', '8' );
            }

            // Guardando cambios en el Tracking
            $Item = new Item_Pedido();
            $Item->where(array('Id_Pedido'=> $idCotizacion, 'Id_ItemPedido' => $idItem));
            $Item->get();

            $T= new Tracking_Pedido();
            $T->Id_Pedido= $idCotizacion;
            $T->Id_ItemPedido= $Item->Id_ItemPedido;
            $T->Id_Clase= $Item->Id_Clase;
            $T->Id_Usuario=$idUsuario;
            $T->Fecha= date("Y-m-d H:i:s");
            $T->Tipo_Accion= 'Entrega Item';
            $T->Entregado= $cantidad;
            $T->save();

            if ($query == 'true' and $T)
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

     public function cambiarClaseEntregadoPedidos_get()
    {
        $idCotizacion = $this->get('idCotizacion');
        try
        {
            //cambiando la clase del pedido si todos los items fueron despachados
            $sqlPedido = "SELECT Count(Item_Pedido.Id_ItemPedido) AS Items, entregaItems.Items_Entregados";
            $sqlPedido .= " FROM";
            $sqlPedido .= " (SELECT Count(Item_Pedido.Id_ItemPedido) AS Items_Entregados FROM Item_Pedido WHERE Item_Pedido.Cantidad = Item_Pedido.Entregado AND Item_Pedido.Id_Pedido = '".$idCotizacion."')entregaItems,";
            $sqlPedido .= " Item_Pedido";
            $sqlPedido .= " WHERE Item_Pedido.Id_Pedido = '".$idCotizacion."'";

            $query = $this->db->query($sqlPedido);
            foreach ($query->result_array() as $row)
            {
                if($row['Items'] == $row['Items_Entregados'])
                {
                    $P = new Pedidos();
                    $P->where('Id_Pedidos',$idCotizacion);
                    $P->update('Id_Clase', '8' );  
                } 
            }
        } 
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }   

    }

    public function clonarCotizacion_post()
    {
        $idCotizacion = $this->get('idCotizacion');
        $idUsuario = $this->get('idUsuario');
        try
        {
            //buscamos el pedido que se quiere clonar
            $P = new Pedidos();
            $P->where('Id_Pedidos',$idCotizacion);
            $P->get();
            //guardamos el nuevo pedido clonado con la clase ingresada
            $newPedido = new Pedidos();
            $newPedido->Id_Clase= '1';
            $newPedido->Cliente= $P->Cliente;
            $newPedido->Rut_Entidad= $P->Rut_Entidad;
            $newPedido->Id_Usuario=$idUsuario;
            $newPedido->Fecha_Pedido= $P->Fecha_Pedido;
            $newPedido->Id_Vendedor= $P->Id_Vendedor;
            $newPedido->Responsable= $P->Responsable;
            $newPedido->Id_Destinatario= $P->Id_Destinatario;
            $newPedido->Total_Flete= $P->Total_Flete;
            $newPedido->Valor_Neto= $P->Valor_Neto;
            $newPedido->Descuento= $P->Descuento;
            $newPedido->Iva= $P->Iva;
            $newPedido->Total= $P->Total;
            $newPedido->Observaciones_Fabricacion= $P->Observaciones_Fabricacion;
            $newPedido->Observaciones_Despacho= $P->Observaciones_Despacho;
            $newPedido->Observaciones= $P->Observaciones;
            $newPedido->Id_Sucursal= $P->Id_Sucursal;
            $newPedido->FechaHoraDespacho= $P->FechaHoraDespacho;
            $newPedido->save();

            //id del nuevo pedido clonado
            $idPedido= $this->db->insert_id();


            //generamos el tracking para los nuevos items clonados
            $T= new Tracking_Pedido();
            $T->Id_Pedido=$idPedido;
            $T->Id_Clase='1';
            $T->Id_Usuario=$idUsuario;
            $T->Fecha= date("Y-m-d H:i:s");
            $T->Tipo_Accion= 'Clonación del Pedido '.$P->Id_Pedidos;
            $Tracking = $T->save();

            //buscamos los items del pedido que se quiere clonar
            $I = new Item_Pedido();
            $I->where('Id_Pedido',$idCotizacion);
            $I->get();

            foreach ($I as $Item)
            {
                //asignamos los items al nuevo pedido clonado
                $newItem = new Item_Pedido();
                $newItem->Id_Pedido = $idPedido;
                $newItem->Cantidad = $Item->Cantidad;
                $newItem->Id_Producto = $Item->Id_Producto;
                $newItem->Precio_Unitario = $Item->Precio_Unitario;
                $newItem->Precio_Total = $Item->Precio_Total;;
                $newItem->save();

                //id del nuevo item creado
                $idItem= $this->db->insert_id();
                
            }

            if ($newPedido)
            {
                $this->response(array('true',$idPedido));
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

    public function recotizarCotizacion_post()
    {
        $idCotizacion = $this->get('idCotizacion');
        $idUsuario = $this->get('idUsuario');
        try
        {
            //cambiando la clase del pedido seleccionado a Cancelada
            $PC = new Pedidos();
            $PC->where('Id_Pedidos',$idCotizacion);
            $PC->update('Id_Clase', '6' ); 

            // generamos el tracking para los items que se han cancelado
            $TI= new Tracking_Pedido();
            $TI->Id_Pedido= $idCotizacion;
            $TI->Id_Clase='6';
            $TI->Id_Usuario=$idUsuario;
            $TI->Fecha= date("Y-m-d H:i:s");
            $TI->Tipo_Accion= 'Cancelación de pedido '.$idCotizacion;
            $TI->save();

            //buscamos el pedido que se quiere recotizar
            $P = new Pedidos();
            $P->where('Id_Pedidos',$idCotizacion);
            $P->get();
            //guardamos el nuevo pedido con la clase recotizada
            $newPedido = new Pedidos();
            $newPedido->Id_Clase= '5';
            $newPedido->Cliente= $P->Cliente;
            $newPedido->Rut_Entidad= $P->Rut_Entidad;
            $newPedido->Id_Usuario=$idUsuario;
            $newPedido->Fecha_Pedido= $P->Fecha_Pedido;
            $newPedido->Id_Vendedor= $P->Id_Vendedor;
            $newPedido->Responsable= $P->Responsable;
            $newPedido->Id_Destinatario= $P->Id_Destinatario;
            $newPedido->Total_Flete= $P->Total_Flete;
            $newPedido->Valor_Neto= $P->Valor_Neto;
            $newPedido->Descuento= $P->Descuento;
            $newPedido->Iva= $P->Iva;
            $newPedido->Total= $P->Total;
            $newPedido->Observaciones_Fabricacion= $P->Observaciones_Fabricacion;
            $newPedido->Observaciones_Despacho= $P->Observaciones_Despacho;
            $newPedido->Observaciones= $P->Observaciones;
            $newPedido->Id_Sucursal= $P->Id_Sucursal;
            $newPedido->FechaDespacho= $P->FechaDespacho;
            $newPedido->HoraDespacho= $P->HoraDespacho;
            $newPedido->save();

            //id del nuevo pedido recotizado
            $idPedido= $this->db->insert_id();

            //generamos el tracking para el pedido recotizado
            $T= new Tracking_Pedido();
            $T->Id_Pedido=$idPedido;
            $T->Id_Clase='5';
            $T->Id_Usuario=$idUsuario;
            $T->Fecha= date("Y-m-d H:i:s");
            $T->Tipo_Accion= 'Recotizada desde el pedido '.$idCotizacion;
            $Tracking = $T->save();

            //buscamos los items del pedido que se quiere recotizar
            $I = new Item_Pedido();
            $I->where('Id_Pedido',$idCotizacion);
            $I->get();

            foreach ($I as $Item)
            {
                //asignamos los items al nuevo pedido recotizado
                $newItem = new Item_Pedido();
                $newItem->Id_Pedido = $idPedido;
                $newItem->Cantidad = $Item->Cantidad;
                $newItem->Id_Producto = $Item->Id_Producto;
                $newItem->Precio_Unitario = $Item->Precio_Unitario;
                $newItem->Precio_Total = $Item->Precio_Total;;
                $newItem->save();

                //id del nuevo item creado
                $idItem= $this->db->insert_id();
                
            }

            if ($newPedido)
            {
                $this->response(array('true',$idPedido));
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

    public function existeCliente_get()
    {
        $idCotizacion = $this->get('idCotizacion');
        try
        {
            //cambiando la clase del pedido si todos los items fueron despachados
            $sqlPedido = "SELECT Count(*) AS Existe";
            $sqlPedido .= " FROM";
            $sqlPedido .= " Pedidos";
            $sqlPedido .= " WHERE Pedidos.Rut_Entidad IS NOT NULL";
            $sqlPedido .= " AND Pedidos.Id_Pedidos = '".$idCotizacion."'";

            $query = $this->db->query($sqlPedido);
            $this->response($query->result_array());
        } 
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }   

    }

    function guardarcomentarioentrega_post()
    {
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }

        try
        {
            //guardando el destino
            $T= new Tracking_Entregado();
            $T->Id_Pedido= $post["idcotizacion"];
            $T->Hora= $post["hora"];
            $T->RecibioDestinatario= $post["recibiodestinatario"];
            $T->Receptor= $post["nombrereceptor"];
            $T->Comentarios= $post["comentarios"];
            $Tra = $T->save();

            if ($Tra)
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

    function guardarcomentarioanulacion_post()
    {
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }

        try
        {
            //guardando el destino
            $T= new Tracking_Anulada();
            $T->Id_Pedido= $post["idcotizacion"];
            $T->Id_Opcion= $post["idopcion"];
            $T->Comentarios= $post["comentarios"];
            $Tra = $T->save();

            if ($Tra)
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

    public function buscarMotivos_get()
    {
        try
        {
            $c= new OpcionesAnulacion();
            $c->get();
            $this->response($c->all_to_array());
        }
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

}
?>
