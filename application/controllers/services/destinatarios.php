<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class destinatarios extends REST_Controller{

    public function __construct(){
      parent::__construct();

      //cargamos la libreria para crear una variable de session
      $this->load->library('session');
      //cargamos la libreria para exportar a excel
      $this->load->library('Excel');
      //cargamos la libreria para exportar a pdf
      $this->load->library('mpdf');
              //cargamos los modelos
      $this->load->model('destino');
      $this->load->model('entidad');
      //cargamos la libreria bitauth
      $this->load->library('bitauth');

      //if(!$this->bitauth->logged_in()) 
      //{
       //  $this->response('Session Terminada',302);
      //}

    }

    //RESPALDO MILUGARPOST
    function milugar_post(){
      $post = array(); 
      foreach($this->post() as $key => $value){
          $post[$key] = $value;
      }
      try
      {
          $cond1= " AND Lugar.Nombre LIKE '%".$post['palabra']."%'";
          $cond2= " AND Sector.COMUNA_ID = ".$post['idcomuna'];
          $sql = " SELECT
          Sector.Nombre as nombresector,
          Lugar.Id_Lugar as idlugar,
          Lugar.Nombre as nombrelugar,
          Tipo.Nombre As nombretipo
          FROM
          Lugar
          INNER JOIN Sector ON Lugar.Id_Sector = Sector.Id_Sector
          INNER JOIN Tipo ON Lugar.Id_Tipo = Tipo.Id_Tipo
          WHERE Lugar.Estado = 1 ".$cond1.$cond2;

          $query = $this->db->query($sql);   
          $this->response($query->result_array());
      }
      catch(Exception $e)
      {
          $this->response(array('error'=>$e->getMessage()),404);
      }
    }

    function obtenersectores_get()
    {
        $sql = "SELECT
        Sector.Id_Sector,
        Sector.Descripcion
        FROM
        Sector";
        $query = $this->db->query($sql);   
        $this->response($query->result_array());
    }


    function obtenervillas_get()
    {
        $sql = "SELECT
        Villa.Id_Villa,
        Villa.Nombre
        FROM
        Villa";
        $query = $this->db->query($sql);   
        $this->response($query->result_array());
    }

    function buscarVillas_get()
    {
        $idsector= $this->get('idsector');
        $cond = "";
        if ($idsector != ""){
          $cond =" WHERE Villa.Id_Sector = ".$idsector;
        }
        $sql = "SELECT
        Villa.Id_Villa,
        Villa.Nombre
        FROM
        Villa";
        $query = $this->db->query($sql.$cond);   
        $this->response($query->result_array());
    }


    function guardardestinatario_post()
   {
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }

        try
        {
            //guardando el destino
            $D= new Destino();
            $D->Rut_Entidad= $post["rut"];
            $D->Direccion= $post["direccion"];
            $D->Telefono= $post["telefono"];
            $D->Nombre_Contacto= $post["nombredestinatario"];
            $D->Id_Lugar= $post["idlugar"];
            $D->Estado= 1;
            $Dest = $D->save();

            if ($Dest )
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
      $cond=" WHERE Entidad.Estado = 1 and Destino.Estado= 1 ";
      if($post['nombrecliente'] != ""){
        $cond.= " AND Entidad.Nombre = '".$post['nombrecliente']."'";
      }
      if($post['rutcliente'] != ""){
        $cond.= " AND Entidad.Rut_Entidad = '".$post['rutcliente']."'";
      }


      $sql = "SELECT
      Count(Destino.Id_Destino) Cantidad_Total
      FROM
      Entidad
      INNER JOIN Destino ON Destino.Rut_Entidad = Entidad.Rut_Entidad".$cond;


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
      $cond=" WHERE Entidad.Estado = 1 and Destino.Estado= 1 ";
      if($post['nombrecliente'] != ""){
        $cond.= " AND Entidad.Nombre = '".$post['nombrecliente']."'";
      }
      if($post['rutcliente'] != ""){
        $cond.= " AND Entidad.Rut_Entidad = '".$post['rutcliente']."'";
      }

      $sql = "SELECT
      Destino.Direccion AS direcciondestinatario,
      Destino.Telefono AS telefonodestinatario,
      Destino.Nombre_Contacto AS nombredestinatario,
      Entidad.Nombre AS nombreentidad,
      Entidad.Rut_Entidad AS rutentidad,
      Lugar.Nombre AS nombretipo,
      Sector.Nombre AS nombresector,
      Comuna.COMUNA_NOMBRE AS nombrecomuna,
      Destino.Id_Destino AS iddestino
      FROM
      Destino
      INNER JOIN Entidad ON Destino.Rut_Entidad = Entidad.Rut_Entidad
      INNER JOIN Lugar ON Destino.Id_Lugar = Lugar.Id_Lugar
      INNER JOIN Sector ON Lugar.Id_Sector = Sector.Id_Sector
      INNER JOIN Comuna ON Sector.COMUNA_ID = Comuna.COMUNA_ID".$cond;

      $query = $this->db->query($sql.' ORDER BY Destino.Id_Destino DESC '.' LIMIT '.$post['start'].','.'14');
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


  function buscar_get(){
    $id = $this->get('id');
    try
    {
              //a continuacion se realizan las condiciones de filtro
      $cond=" WHERE Entidad.Estado = 1 ";
      $cond.= " AND Destino.Id_Destino = ".$id;

      $sql = "SELECT
      Destino.Direccion,
      Destino.Nombre_Contacto,
      Destino.Telefono,
      Entidad.Nombre AS Nombre_Cliente,
      Entidad.Rut_Entidad,
      Lugar.Nombre AS Nombre_Lugar,
      Lugar.Id_Lugar,
      Sector.Nombre AS Nombre_Sector,
      Comuna.COMUNA_ID,
      Provincia.PROVINCIA_ID,
      Region.REGION_ID
      FROM
      Destino
      INNER JOIN Entidad ON Destino.Rut_Entidad = Entidad.Rut_Entidad
      INNER JOIN Lugar ON Destino.Id_Lugar = Lugar.Id_Lugar
      INNER JOIN Sector ON Sector.Id_Sector = Lugar.Id_Sector
      INNER JOIN Comuna ON Sector.COMUNA_ID = Comuna.COMUNA_ID
      INNER JOIN Provincia ON Comuna.COMUNA_PROVINCIA_ID = Provincia.PROVINCIA_ID
      INNER JOIN Region ON Provincia.PROVINCIA_REGION_ID = Region.REGION_ID".$cond;

      $query = $this->db->query($sql);   
      $this->response($query->result_array());
    
      }catch(Exception $e)
      {
          $this->response(array('error'=>$e->getMessage()),404);
      }

  }

  //actualiza los datos del destinatario seleccionado
  function actualizar_post(){
    try
    {
      $post = array(); 
      foreach($this->post() as $key => $value)
      {
        $post[$key] = $value;
      }

      $l= new Destino();

      $resp = $l->where('Id_Destino',$post['iddestino'])->
      update(array(
        'Nombre_Contacto'        => $post['nombredestinatario'] ,
        'Direccion'     => $post['direccion'] ,
        'Telefono'      => $post['telefono'] ,
        'Id_Lugar'     => $post['idlugar']));
    }
    catch(Exception $e)
    {
      $this->response(array('error'=>$e->getMessage()),404);
    }
  }

  // funcion que elimina el destinatario seleccionado
  function eliminar_get()
  {
    try
    {

    $id= $this->get('id');

    $p= new Pedidos();
    $p->where('Id_Destinatario',$id);
    $p->get();

    if(count($p->all_to_array())==0){
          $sql= "DELETE FROM Destino WHERE Id_Destino =".$id;
          $query = $this->db->query($sql);
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