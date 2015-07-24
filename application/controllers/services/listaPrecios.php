<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class ListaPrecios extends REST_Controller 
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
        //cargamos la libreria bitauth
        $this->load->library('bitauth');
        //CARGAMOS EL MODELO
        $this->load->model('lista_precio');
        $this->load->model('moneda');

        //if(!$this->bitauth->logged_in()) 
        //{
         //   $this->response('Session Terminada',302);
        //}
    }
    
    function guardarlista_post()
    {
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }
        try{
          //se guarda la lista de precios temporal
          $L= new Lista_Precio();
          $L->Nombre= $post["Nombre"];
          $L->Tipo= "Normal";
          $L->Estado= $post["Estado"];
          $L->Fecha_C= date("Y-m-d H:i:s");
          $Lis = $L->save();
          if ($Lis)
            {
                $this->response($this->db->insert_id());
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
    //PRUEBA
    function productolistainsert_post()
    {
      try
      {
          //guardando el sector
          foreach($this->post() as $key => $value)
          {
            $sql ="INSERT INTO Producto_Lista (Producto_Lista.Id_Producto, Producto_Lista.Id_ListaPrecio, Producto_Lista.Precio, Producto_Lista.Estado) VALUES ('".$value['val_p']."','".$value['val_c']."','".$value['val_v']."','".$value['val_e']."')";
            $query = $this->db->query($sql);
          }
          
      }
      catch(Exception $e)
      {
          $this->response(array('error'=>$e->getMessage()),404);
      }

    }
    //Prueba2-> productolistaeliminar
    //DELETE FROM `dbflowers`.`producto_lista` WHERE `producto_lista`.`Id_Producto` = 11 AND `producto_lista`.`Id_ListaPrecio` = 22"
     function productolistaeliminar_get()
    {
      $idLista = $this->get('idLista');
      try
      {
            $sql ="DELETE FROM Producto_Lista WHERE  Producto_Lista.Id_ListaPrecio = '".$idLista."' ";
            $query = $this->db->query($sql);
          
          $this->response('true');
          
      }
      catch(Exception $e)
      {
          $this->response(array('error'=>$e->getMessage()),404);
      }

    }

    // function productolistaeliminar_post()
    // {
    //   try
    //   {
    //       //guardando el sector
    //       foreach($this->post() as $key => $value)
    //       {
    //         $sql ="DELETE FROM Producto_Lista WHERE Producto_Lista.Id_Producto = '".$value['id_produ']."' AND Producto_Lista.Id_ListaPrecio = '".$value['id_lista']."' ";
    //         $query = $this->db->query($sql);
    //       }
    //       $this->response('true');
          
    //   }
    //   catch(Exception $e)
    //   {
    //       $this->response(array('error'=>$e->getMessage()),404);
    //   }

    // }
    //asd
    // function productolistaedit_post()
    // {
    //   try
    //   {
    //       //guardando el sector
    //       foreach($this->post() as $key => $value)
    //       { 
    //         $sql = "UPDATE  Producto_Lista SET  Producto_Lista.Precio = '".$value['val_v']."', Producto_Lista.Estado =  '".$value['val_e']."' WHERE Producto_Lista.Id_Producto = '".$value['val_p']."' AND  Producto_Lista.Id_ListaPrecio = '".$value['val_c']."'";
    //         $query = $this->db->query($sql);
    //       }
          
    //   }
    //   catch(Exception $e)
    //   {
    //       $this->response(array('error'=>$e->getMessage()),404);
    //   }

    // }


     function productolistaedit_post()
    {
      try
      {
          //guardando el sector
          foreach($this->post() as $key => $value)
          { 
            $sql  = " SELECT COUNT(1) as Cantidad from Producto_Lista  ";
            $sql .= " WHERE Producto_Lista.Id_ListaPrecio = '".$value['val_c']."'";
            $sql .= " AND Producto_Lista.Id_Producto = '".$value['val_p']."' ";

            $query = $this->db->query($sql);
            $cantidad = $query->row()->Cantidad;

            #si no existe e inserta de otro modo e actualiza
            if($cantidad==0){

                $sql ="INSERT INTO Producto_Lista (Producto_Lista.Id_Producto, Producto_Lista.Id_ListaPrecio, Producto_Lista.Precio, Producto_Lista.Estado) VALUES ('".$value['val_p']."','".$value['val_c']."','".$value['val_v']."','".$value['val_e']."')";

            }else{

                $sql = "UPDATE  Producto_Lista SET  Producto_Lista.Precio = '".$value['val_v']."', Producto_Lista.Estado =  '".$value['val_e']."' WHERE Producto_Lista.Id_Producto = '".$value['val_p']."' AND  Producto_Lista.Id_ListaPrecio = '".$value['val_c']."'";

            }
            $query = $this->db->query($sql);
          }
          
      }
      catch(Exception $e)
      {
          $this->response(array('error'=>$e->getMessage()),404);
      }

    }
    //ACTUALIZA LA LISTA
    function actualizar_post(){
    try
    {
      $post = array(); 
      foreach($this->post() as $key => $value)
      {
        $post[$key] = $value;
      }

      $l= new Lista_Precio();

      $resp = $l->where('Id_ListaPrecio',$post['idlista'])->
      update(array(
        'Nombre'        => $post['nombre'] ,
        'Tipo'   => "Normal",
        'Estado'     => $post['estado'],
        'Fecha_C'     => $post['fecha']
        ));
    }
    catch(Exception $e)
    {
      $this->response(array('error'=>$e->getMessage()),404);
    }
    }
    //Actualizar2
    function actualizar2_post(){
      try
      {
        $id = $this->get('id');
        $sql = "UPDATE  Lista_Precio SET  Lista_Precio.Estado = '2' WHERE Lista_Precio.Id_ListaPrecio = '".$id."'";
        $query = $this->db->query($sql);
        $this->response('true');
      }
      
      catch(Exception $e)
      {
          //$this->response('false');
          $this->response(array('error'=>$e->getMessage()),404);
      }
    }

    function contarRegistros_post(){
      try
      {

        $post = array(); 
        foreach($this->post() as $key => $value)
        {
          $post[$key] = $value;
        }

        //a continuacion se realizan las condiciones de filtro
        if($post['nombre'] != ""){
          $cond .=  " WHERE Lista_Precio.Nombre = '".$post['nombre']."'";
        }

        $sql = "SELECT Count(Lista_Precio.Id_ListaPrecio) AS Cantidad_Total
        FROM
        Lista_Precio".$cond;

        $query = $this->db->query($sql);   
        $this->response($query->result_array());
      
      }catch(Exception $e)
      {
        $this->response(array('error'=>$e->getMessage()),404);
      }
    }

    public function filtrar_post()
    {
      try
      {
         $post = array(); 
         foreach($this->post() as $key => $value)
         {
           $post[$key] = $value;
         }

         if($post['nombre'] != ""){
          $cond .=  " WHERE Lista_Precio.Nombre = '".$post['nombre']."'";
         }

         $sql = "SELECT
         Lista_Precio.Id_ListaPrecio,
         Lista_Precio.Nombre,
         Lista_Precio.Tipo,
         Lista_Precio.Estado,
         Lista_Precio.Fecha_C
         FROM
         Lista_Precio".$cond;

         $query = $this->db->query($sql.' ORDER BY Lista_Precio.Id_ListaPrecio DESC '.' LIMIT '.$post['start'].','.'14');
         if(count($query->result_array())==0){
            $this->response(array(),202);
         }else{
            $this->response($query->result_array());
         }
       }
       catch(Exception $e)
       {
           $this->response(array('error'=>$e->getMessage()),404);
       }
  }
    //Autocompleta con los Datos de la Bd en el TextBox
    function milista_post(){
      $post = array(); 
      foreach($this->post() as $key => $value){
          $post[$key] = $value;
      }
      try
      { 
        $e = new Lista_Precio();
        $e -> like('Nombre', $post['palabra'], 'after');
        $e -> get();
        $this->response($e->all_to_array());
      }
      catch(Exception $e)
      {
          $this->response(array('error'=>$e->getMessage()),404);
      }
    }

    function editarlista_post()
    {
      //BUSCAR LISTA PARA EDITAR
      try
      {
         $post = array(); 
         foreach($this->post() as $key => $value)
         {
           $post[$key] = $value;
         }

         if($post['id'] != ""){
          $cond .=  " WHERE Lista_Precio.Id_ListaPrecio = '".$post['id']."'";
         }

         $sql = "SELECT
         Lista_Precio.Nombre,
         Lista_Precio.Tipo,
         Lista_Precio.Estado,
         Lista_Precio.Fecha_C
         FROM
         Lista_Precio".$cond;

         $query = $this->db->query($sql);
         $this->response($query->result_array());

       }
       catch(Exception $e)
       {
           $this->response(array('error'=>$e->getMessage()),404);
       }
    }

    function traerlistaproductos_post()
    {
      try
      {
         $post = array(); 
         foreach($this->post() as $key => $value)
         {
           $post[$key] = $value;
         }

         if($post['id'] != ""){
          $cond .=  " WHERE Producto_Lista.Id_ListaPrecio = '".$post['id']."'";
         }

         $sql = "SELECT
         Producto_Lista.Id_Producto,
         Producto_Lista.Id_ListaPrecio,
         Producto_Lista.Precio,
         Producto_Lista.Estado
         FROM 
         Producto_Lista".$cond;

         $query = $this->db->query($sql);
         $this->response($query->result_array());
      }
       catch(Exception $e)
       {
           $this->response(array('error'=>$e->getMessage()),404);
       }
    }

    // funcion que elimina la lista|| "DELETE FROM `dbflowers`.`lista_precio` WHERE `lista_precio`.`Id_ListaPrecio` = 1" ||
  function eliminar_get()
  {
    try
    {

    $id= $this->get('id');
    $sql = "DELETE
            FROM
            Lista_Precio
            WHERE Lista_Precio.Id_ListaPrecio =".$id;

    $query = $this->db->query($sql);
    $this->response('true');
    }
    catch(Exception $e)
    {
        $this->response(array('error'=>$e->getMessage()),404);
    }
  }

  //Consulta lista TEMPORAL
  function contemporal_post()
  {
    try
    {
    $sql = "SELECT Lista_Precio.Nombre From Lista_Precio Where Lista_Precio.Estado = '0'";
    $total = $this->db->query($sql);
      if($total->num_rows!=0){
        $this->response('false');
      }else{
        $this->response('true');
      }
    }
    catch(Exception $e)
    {
        $this->response(array('error'=>$e->getMessage()),404);
    }
  }
  //Consulta Lista ACTIVA
  function conactiva_post()
  {
    try
    {
    $id = $this->get('id');
    $sql = "SELECT Lista_Precio.Id_ListaPrecio From Lista_Precio Where Lista_Precio.Estado = '1' AND Lista_Precio.Id_ListaPrecio != '".$id."'";
    $total = $this->db->query($sql);
    
      if($total->num_rows !=0)
      {
        //$this->response('true');
        $sql = "SELECT Lista_Precio.Id_ListaPrecio From Lista_Precio Where Lista_Precio.Estado = '1' AND Lista_Precio.Id_ListaPrecio != '".$id."'";
        $query = $this->db->query($sql);
        $this->response($query->result_array());
      }else{
        $this->response('false');
      }
    }
    catch(Exception $e)
    {
        //$this->response('false');
        $this->response(array('error'=>$e->getMessage()),404);
    }
  }
}
?>