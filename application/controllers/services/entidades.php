<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class entidades extends REST_Controller 
{

  
   public function __construct(){
      parent::__construct();

      //cargamos la libreria para crear una variable de session
      $this->load->library('session');
      //cargamos la libreria para exportar a excel
      $this->load->library('Excel');
      //cargamos la libreria para exportar a pdf
      $this->load->library('mpdf');
              //cargamos los modelos
      $this->load->model('entidad');
      $this->load->model('clasificacion_entidad');
      //cargamos la libreria bitauth
      $this->load->library('bitauth');

      //if(!$this->bitauth->logged_in()) 
      //{
       //   $this->response('Session Terminada',302);
      //}

    }

  function clasificacionentidad_get()
  {
    $sql = "SELECT
    Clasificacion_Entidad.Id_ClasificacionEntidad,
    Clasificacion_Entidad.Nombre
    FROM
    Clasificacion_Entidad";
    $query = $this->db->query($sql);   
    $this->response($query->result_array());
  }

  function guardarentidad_post()
  {
      $post = array(); 
      foreach($this->post() as $key => $value)
      {
          $post[$key] = $value;
      }

      try
      {
          //guardando el producto
          $E= new Entidad();
          $E->Rut_Entidad= $post["Rut"];
          $E->Tipo_Entidad= $post["Tipo"];
          $E->REGION_ID= 7;
          $E->COMUNA_ID= 7101;
          $E->Nombre= $post["Nombre"];
          $E->PROVINCIA_ID= 71;
          $E->Direccion= "";
          $E->Telefono= $post["Telefono"];
          $E->Email= $post["Email"];
          $E->Latitud= 'Latitud';
          $E->Longitud= 'Longitud';
          $E->Id_ClasificacionEntidad= $post["Clasificacion"];
          $E->Estado= 1;

          $Ent = $E->save();

          if ($Ent)
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
      $cond=" WHERE Entidad.Estado = 1 ";
      if($post['nombrentidad'] != ""){
        $cond.= " AND Entidad.Nombre = '".$post['nombreentidad']."'";
      }
      if($post['rutentidad'] != ""){
        $cond.=  " AND Entidad.Rut_Entidad = ".$post['rutentidad'];
      }
      if($post['tipoentidad'] != "vacio"){
        $cond.=  " AND Entidad.Tipo_Entidad = '".$post['tipoentidad']."'";
      }
      if($post['clasificacionentidad'] != "vacio"){
        $cond.=  " AND Entidad.Id_ClasificacionEntidad = ".$post['clasificacionentidad'];
      }

      $sql = "SELECT Count(Entidad.Rut_Entidad) AS Cantidad_Total
      FROM
      Entidad".$cond;

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
      $cond=" WHERE Entidad.Estado = 1 ";
      if($post['nombreentidad'] != ""){
        $cond.= " AND Entidad.Nombre = '".$post['nombreentidad']."'";
      }
      if($post['rutentidad'] != ""){
        $cond.=  " AND Entidad.Rut_Entidad = ".$post['rutentidad'];
      }
      if($post['tipoentidad'] != "vacio"){
        $cond.=  " AND Entidad.Tipo_Entidad = '".$post['tipoentidad']."'";
      }
      if($post['clasificacionentidad'] != "vacio"){
        $cond.=  " AND Entidad.Id_ClasificacionEntidad = ".$post['clasificacionentidad'];
      }

      $sql = "SELECT
      Entidad.Rut_Entidad,
      Entidad.Nombre,
      Entidad.Direccion,
      Entidad.Telefono,
      Entidad.Email,
      Clasificacion_Entidad.Nombre as Clasificacion,
      Entidad.Tipo_Entidad
      FROM
      Clasificacion_Entidad
      INNER JOIN Entidad ON Entidad.Id_ClasificacionEntidad = Clasificacion_Entidad.Id_ClasificacionEntidad".$cond;


      $query = $this->db->query($sql.' ORDER BY Entidad.Nombre DESC '.' LIMIT '.$post['start'].','.'14');
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

  //funcion para el autocomplete
  function mientidad_post(){
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


  //funcion para el autocomplete por rut
  function mientidadrut_post(){
      $post = array(); 
        foreach($this->post() as $key => $value){
            $post[$key] = $value;
        }
    try
      {
             
        $e = new Entidad();
        $e->like('Rut_Entidad', $post['palabra'], 'both');
        $e->get();
      $this->response($e->all_to_array());
    }
    catch(Exception $e)
    {
          $this->response(array('error'=>$e->getMessage()),404);
        }
  }


  function buscar_get(){
    $id = $this->get('id');
    try
    {
        $c= new Entidad();
        $c->where(array('Rut_Entidad'=>$id, 'Estado' => 1));
        $c->get();

       // $c->check_last_query();
        $this->response($c->all_to_array());
    }
    catch(Exception $e)
    {
          $this->response(array('error'=>$e->getMessage()),404);
        }

  }

//actualiza los adtos de la entidad seleccioanada
  function actualizar_post(){
    try
    {
      $post = array(); 
      foreach($this->post() as $key => $value)
      {
        $post[$key] = $value;
      }

      $l= new Entidad();

      $resp = $l->where('Rut_Entidad',$post['rut'])->
      update(array(
        'Nombre'        => $post['nombre'] ,
        'Telefono'      => $post['telefono'] ,
        'Email'         => $post['email'] ,
        'Id_ClasificacionEntidad'     => $post['clasificacion']));

    }
    catch(Exception $e)
    {
      $this->response(array('error'=>$e->getMessage()),404);
    }
  }


 // funcion que elimina la entidad seleccionada
  function eliminar_get()
  {
    try
    {

    $id= $this->get('rut');

    $p= new Pedidos();
    $p->where('Rut_Entidad',$id);
    $p->get();

    if(count($p->all_to_array())==0){
          $sqla= "DELETE FROM Destino WHERE Rut_Entidad =".$id;
          $sqlb= " DELETE FROM Entidad WHERE Rut_Entidad =".$id;

          $query = $this->db->query($sqla);
          $query2 = $this->db->query($sqlb);
          $this->response('true');
    }else{
          $this->response('false');
    }
    }catch(Exception $e){
        $this->response(array(
          'error'=>$e->getMessage()
        ),404);
      }
  }


}
?>