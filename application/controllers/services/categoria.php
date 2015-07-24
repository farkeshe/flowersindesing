<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class productos extends REST_Controller{

   public function __construct(){
      parent::__construct();

      //cargamos la libreria para crear una variable de session
      $this->load->library('session');
      //cargamos la libreria para exportar a excel
      $this->load->library('Excel');
      //cargamos la libreria para exportar a pdf
      $this->load->library('mpdf');
              //cargamos los modelos
      $this->load->model('producto');
      $this->load->model('categoria');
      //cargamos la libreria bitauth
      $this->load->library('bitauth');

     //if(!$this->bitauth->logged_in()) 
      //{
       //   $this->response('Session Terminada',302);
      //}

    }

   function categorias_get()
   {
    $sql = "SELECT
    Categoria.Id_Categoria,
    Categoria.Nombre
    FROM
    Categoria";
    $query = $this->db->query($sql);   
    $this->response($query->result_array());
  }

    function guardarproducto_post()
   {
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }

        try
        {
            //guardando el producto
            $P= new Producto();
            $P->Nombre= $post["Nombre"];
            $P->Estado= 'Activo';
            $P->Id_Categoria= $post["Id_Categoria"];
            $Prod = $P->save();

            if ($Prod)
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

  function obtenerproductos_get()
   {
    $sql = "SELECT
    Producto.Id_Producto,
    Producto.Nombre as nombreProducto,
    Producto.Estado,
    Categoria.Nombre as nombreCategoria,
    Producto.Id_Categoria as Id_Categoria
    FROM
    Producto INNER JOIN Categoria 
    ON Categoria.Id_Categoria = Producto.Id_Categoria";
    $query = $this->db->query($sql);   
    $this->response($query->result_array());
  }

  function obtenerproductos2_get()
   {
    $a = "Activo";
    $sql = "SELECT
    Producto.Id_Producto,
    Producto.Nombre as nombreProducto,
    Producto.Estado,
    Categoria.Nombre as nombreCategoria,
    Producto.Id_Categoria as Id_Categoria
    FROM
    Producto INNER JOIN Categoria 
    ON Categoria.Id_Categoria = Producto.Id_Categoria AND Producto.Estado = 'Activo'";
    $query = $this->db->query($sql);   
    $this->response($query->result_array());
  }

  function obtenerproductoshistorico_get()
   {
    $id= $this->get('id');
    $sql = "SELECT
    Producto.Id_Producto,
    Producto.Nombre as nombreProducto,
    Producto.Estado,
    Categoria.Nombre as nombreCategoria,
    Producto.Id_Categoria as Id_Categoria,
    Producto_Lista.Precio as precio
    FROM
    Producto,Categoria,Producto_Lista 
    WHERE Categoria.Id_Categoria = Producto.Id_Categoria AND Producto.Id_Producto = Producto_Lista.Id_Producto AND Producto_Lista.Id_ListaPrecio = ".$id."";
    $query = $this->db->query($sql);   
    $this->response($query->result_array());
  }
  //RESPALDO HISTORICO
  // function obtenerproductoshistorico_get()
  //  {
  //   $a = "Activo";
  //   $sql = "SELECT
  //   Producto.Id_Producto,
  //   Producto.Nombre as nombreProducto,
  //   Producto.Estado,
  //   Categoria.Nombre as nombreCategoria,
  //   Producto.Id_Categoria as Id_Categoria
  //   FROM
  //   Producto INNER JOIN Categoria 
  //   ON Categoria.Id_Categoria = Producto.Id_Categoria";
  //   $query = $this->db->query($sql);   
  //   $this->response($query->result_array());
  // }
  //RESPALOD HISTORICO
  //funcion para el autocomplete
  function miproducto_post(){
      $post = array(); 
        foreach($this->post() as $key => $value){
            $post[$key] = $value;
        }
    try
      {
             
        $e = new Producto();
        $e->like('Nombre', $post['palabra'], 'after');
        $e->where('Estado','Activo');
        $e->get();
      $this->response($e->all_to_array());
    }
    catch(Exception $e)
    {
          $this->response(array('error'=>$e->getMessage()),404);
        }
  }

  //funcion que cuenta los registros a mostrar
  function contarRegistros_post(){
    try
    {

      $post = array(); 
      foreach($this->post() as $key => $value)
      {
        $post[$key] = $value;
      }

      //a continuacion se realizan las condiciones de filtro
      $cond=" WHERE Producto.Estado = 'activo' ";
      if($post['nombreproducto'] != ""){
        $cond .= " AND Producto.Nombre = '".$post['nombreproducto']."'";
      }
      if($post['Id_Categoria'] != "vacio"){
        $cond .=  " AND Producto.Id_Categoria = ".$post['Id_Categoria'];
      }

      $sql = "SELECT Count(Producto.Id_Producto) AS Cantidad_Total
      FROM
      Producto".$cond;

      #print_r($sql);

      $query = $this->db->query($sql);   
      $this->response($query->result_array());
    
    }catch(Exception $e)
      {
        $this->response(array('error'=>$e->getMessage()),404);
      }
  }

  //funcion que filtra los productos a mostrar
  public function filtrar_post()
  {
    try
    {
      $post = array(); 
      foreach($this->post() as $key => $value)
      {
        $post[$key] = $value;
      }

      //a continuacion se realizan las condiciones de filtro
      $cond=" WHERE Producto.Estado = 'Activo' ";
      if($post['nombreproducto'] != ""){
        $cond.= " AND Producto.Nombre = '".$post['nombreproducto']."'";
      }
      if($post['Id_Categoria'] != "vacio"){
        $cond.=  " AND Producto.Id_Categoria = ".$post['Id_Categoria'];
      }

      $sql = "SELECT
      Producto.Id_Producto,
      Producto.Nombre as nombreProducto,
      Categoria.Nombre as nombreCategoria,
      Producto.Estado as nombreEstado
      FROM
      Producto INNER JOIN Categoria 
      ON Categoria.Id_Categoria = Producto.Id_Categoria".$cond;

      //print_r($sql);

      $query = $this->db->query($sql.' ORDER BY Producto.Id_Producto DESC '.' LIMIT '.$post['start'].','.'14');
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
//RESPALDO DE FILTRAR
// public function filtrar_post()
//   {
//     try
//     {
//       $post = array(); 
//       foreach($this->post() as $key => $value)
//       {
//         $post[$key] = $value;
//       }

//       //a continuacion se realizan las condiciones de filtro
//       $cond=" WHERE Producto.Estado = 'Activo' ";
//       if($post['nombreproducto'] != ""){
//         $cond.= " AND Producto.Nombre = '".$post['nombreproducto']."'";
//       }
//       if($post['Id_Categoria'] != "vacio"){
//         $cond.=  " AND Producto.Id_Categoria = ".$post['Id_Categoria'];
//       }

//       $sql = "SELECT
//       Producto.Id_Producto,
//       Producto.Nombre as nombreProducto,
//       Categoria.Nombre as nombreCategoria
//       FROM
//       Producto INNER JOIN Categoria 
//       ON Categoria.Id_Categoria = Producto.Id_Categoria".$cond;

//       //print_r($sql);

//       $query = $this->db->query($sql.' ORDER BY Producto.Id_Producto DESC '.' LIMIT '.$post['start'].','.'14');
//       $this->response($query->result_array());

//     }
//     catch(Exception $e)
//     {
//         $this->response(array('error'=>$e->getMessage()),404);
//     }
//   }
//RESPALDO DE FILTRAR
  function buscar_get(){
    $id = $this->get('id');
    try
    {

        $c= new Producto();
        $c->where(array('Id_Producto'=>$id, 'Estado' => 'Activo'));
        $c->get();

       // $c->check_last_query();
        $this->response($c->all_to_array());
    }
    catch(Exception $e)
    {
          $this->response(array('error'=>$e->getMessage()),404);
        }

  }

  // funcion que elimina el producto seleccionado, en realidad solo cambia de estado a inactivo
  function eliminar_get()
  {
    try
    {
      $id = $this->get('id');
      $sql = "UPDATE  Producto SET  Producto.Estado = 'Inactivo' WHERE Producto.Id_Producto = ".$id."";
      $totalA = "SELECT Lista_Precio.Id_ListaPrecio From Lista_Precio Where Lista_Precio.Estado = '1'";
      $totalA = $this->db->query($sql);
      $totalB = "SELECT Lista_Precio.Id_ListaPrecio From Lista_Precio Where Lista_Precio.Estado = '0'";
      $totalB = $this->db->query($sql);
      if($totalA->num_rows!=0)
      {
        $con1 = "SELECT Lista_Precio.Id_ListaPrecio From Lista_Precio Where Lista_Precio.Estado = '1'";
        $res1 = $this->db->query($con1);
        $res1 = $res1->result_array();
        $res1 = $res1[0]{Id_ListaPrecio};
        $con2 = "SELECT Producto_Lista.Precio, Lista_Precio.Nombre From Producto_Lista, Lista_Precio Where Producto_Lista.Id_ListaPrecio = ".$res1." AND Producto_Lista.Id_Producto = ".$id." AND Lista_Precio.Id_ListaPrecio = ".$res1." ";
        $res2 = $this->db->query($con2);
        $res2 = $res2->result_array();
        $res3 = $res2[0]{Precio};
        $res4 = $res2[0]{Nombre};
      }
      if($totalB->num_rows!=0)
      {
        $con12 = "SELECT Lista_Precio.Id_ListaPrecio From Lista_Precio Where Lista_Precio.Estado = '0'";
        $res12 = $this->db->query($con12);
        $res12 = $res12->result_array();
        $res12 = $res12[0]{Id_ListaPrecio};
        $con22 = "SELECT Producto_Lista.Precio, Lista_Precio.Nombre From Producto_Lista, Lista_Precio Where Producto_Lista.Id_ListaPrecio = ".$res12." AND Producto_Lista.Id_Producto = ".$id." AND Lista_Precio.Id_ListaPrecio = ".$res12." ";
        $res22 = $this->db->query($con22);
        $res22 = $res22->result_array();
        $res32 = $res22[0]{Precio};
        $res42 = $res22[0]{Nombre};
      }
      if($res3 != 0 && $res32 != 0)
      {
        $respuesta = (string)$res4." (Activa) y ".(string)$res42." (Temporal).";
        $this->response($respuesta);
      }
      else
      {
        if($res3 != 0)
        {
          $respuesta = (string)$res4." (Activa).";
          $this->response($respuesta); 
        }
        if($res32 != 0)
        {
          $respuesta =(string)$res42." (Temporal).";
          $this->response($respuesta);
        }
      }
      if($res3 == 0 && $res32 == 0)
      {
        $query = $this->db->query($sql);
        $this->response('true');
      }
      else
      {
        if($res3 == 0)
        {
          $query = $this->db->query($sql);
          $this->response('true');
        }
      
        if($res32 == 0)
        {
          $query = $this->db->query($sql);
          $this->response('true');
        }
      }
      
    }
    catch(Exception $e)
    {
      $this->response(array('error'=>$e->getMessage()),404);
    }
  }
 
  //actualiza el producto seleccionado
  function actualizar_post(){
    try
    {
      $post = array(); 
      foreach($this->post() as $key => $value)
      {
        $post[$key] = $value;
      }

      $l= new Producto();

      $resp = $l->where('Id_Producto',$post['idproducto'])->
      update(array(
        'Nombre'        => $post['Nombre'] ,
        'Id_Categoria'     => $post['Id_Categoria']));

    }
    catch(Exception $e)
    {
      $this->response(array('error'=>$e->getMessage()),404);
    }
  }

  //buscamos si existe el producto en la misma categoria
  function existenciaProducto_post(){
    try
    {
      $post = array(); 
      foreach($this->post() as $key => $value)
      {
        $post[$key] = $value;
      }

      $sql = "SELECT * FROM Producto WHERE Nombre = '".$post['Nombre']."'";
      $sql .= " AND Id_categoria = ".$post['Id_Categoria'];

      $query = $this->db->query($sql);

      if(count($query->result_array()) == 0){
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

}
?>