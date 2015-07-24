<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class sectores extends REST_Controller{

    public function __construct(){
      parent::__construct();

      //cargamos la libreria para crear una variable de session
      $this->load->library('session');
      //cargamos la libreria para exportar a excel
      $this->load->library('Excel');
      //cargamos la libreria para exportar a pdf
      $this->load->library('mpdf');
              //cargamos los modelos
      $this->load->model('Sector');
      $this->load->model('Lugar');
      //cargamos la libreria bitauth
      $this->load->library('bitauth');

     // if(!$this->bitauth->logged_in()) 
      //{
        //  $this->response('Session Terminada',302);
      //}

    }

    function regiones_get()
  	{
	    $sql = "SELECT
	    Region.REGION_NOMBRE,
	    Region.REGION_ID
	    FROM
	    Region";
	    $query = $this->db->query($sql);   
	    $this->response($query->result_array());
  	}

    function provincia_get()
    {

      $region = $this->get('region');
      if(($region == "" ) OR ($region == "undefined") OR ($region == '0')){
        $cond = "";
      }
      else{
        $cond = " WHERE Provincia.PROVINCIA_REGION_ID = ".$region;
      }

      $sql = "SELECT
        Provincia.PROVINCIA_NOMBRE,
        Provincia.PROVINCIA_ID
        FROM
        Region
        LEFT JOIN Provincia ON Region.REGION_ID = Provincia.PROVINCIA_REGION_ID".$cond;
      
      $query = $this->db->query($sql);   
      $this->response($query->result_array());
    }

    function comuna_get()
    {
      $provincia= $this->get('provincia');
      if($provincia == "" or $provincia == "undefined" or $provincia == '0'){
        $cond = "";
      }
      else{
      $cond = " WHERE Provincia.PROVINCIA_ID = ".$provincia;
      }

      $sql = "SELECT
      origen.COMUNA_NOMBRE,
      Provincia.PROVINCIA_NOMBRE,
      Provincia.PROVINCIA_ID,
      origen.COMUNA_ID
      FROM
      Comuna AS origen
      LEFT JOIN Provincia ON Provincia.PROVINCIA_ID = origen.COMUNA_PROVINCIA_ID
      ".$cond;
      $query = $this->db->query($sql);   
      $this->response($query->result_array());
    }


    function guardarsector_post()
   {
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }

        try
        {
            //guardando el sector
            $S= new Sector();
            $S->Nombre= $post["Nombre"];
            $S->Estado= 1;
            $S->PrecioFlete= $post["PrecioFlete"];
            $S->COMUNA_ID= $post["Id_Comuna"] ;
            $Sec = $S->save();

            if ($Sec)
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

  function obtenersector_get()
    {
      $nombre= $this->get('nombre');
      $idcomuna= $this->get('idcomuna');
      $cond = " WHERE Sector.Estado = 1 ";
      $cond.= " AND Sector.COMUNA_ID = ".$idcomuna;
      $cond.= " AND Sector.Nombre = '".$nombre."'";
      $sql = " SELECT count(*) as c FROM Sector".$cond;
      $query = $this->db->query($sql);   
      $this->response($query->result_array());
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
        $cond=" WHERE Sector.Estado = 1 ";
        if($post['comuna'] != ""){
          $cond .=  " AND Comuna.COMUNA_NOMBRE = '".$post['comuna']."'";
        }

        $sql = "SELECT Count(Sector.Id_Sector) AS Cantidad_Total
        FROM
        Sector INNER JOIN Comuna
        ON Comuna.COMUNA_ID = Sector.COMUNA_ID".$cond;

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
      $cond=" WHERE Sector.Estado = 1 ";
      if($post['comuna'] != ""){
        $cond .=  " AND Comuna.COMUNA_NOMBRE = '".$post['comuna']."'";
      }

      $sql = "SELECT
      Sector.Id_Sector,
      Sector.Nombre,
      Sector.PrecioFlete,
      Comuna.COMUNA_NOMBRE as NombreComuna
      FROM
      Sector INNER JOIN Comuna
      ON Comuna.COMUNA_ID = Sector.COMUNA_ID".$cond;


      $query = $this->db->query($sql.' ORDER BY Sector.Id_Sector DESC '.' LIMIT '.$post['start'].','.'14');
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

  // funcion que elimina el sector de Talca
  function eliminar_get()
  {
    try
    {

    $id= $this->get('id');
    $sql = "SELECT
            Destino.Id_Destino
            FROM
            Destino
            INNER JOIN Lugar ON Destino.Id_Lugar = Lugar.Id_Lugar
            WHERE Lugar.Id_Sector =".$id;

    $query = $this->db->query($sql);
    if ($query->num_rows == 0){
            $s= new Sector();
            $resp = $s->where('Id_Sector',$id)->update('Estado','0');
            $this->response('true');
    }
    else{
            $this->response('false');
    }

    }catch(Exception $e){
        $this->response(array(
          'error'=>$e->getMessage()
        ),404);
      }
  }

  //funcion para el autocomplete que obtiene las comunas
  function micomuna_post(){
    $post = array(); 
    foreach($this->post() as $key => $value){
        $post[$key] = $value;
    }
    try
    { 
      $e = new Comuna();
      $e -> like('COMUNA_NOMBRE', $post['palabra'], 'after');
      $e -> get();
      $this->response($e->all_to_array());
    }
    catch(Exception $e)
    {
        $this->response(array('error'=>$e->getMessage()),404);
    }
  }

  //obtiene los datos del sector que sera editado
  function buscar_get(){
    $id = $this->get('id');
    try
    {
        $c= new Sector();
        $c->where(array('Id_Sector'=>$id, 'Estado' => '1'));
        $c->get();

        $this->response($c->all_to_array());
    }
    catch(Exception $e)
    {
        $this->response(array('error'=>$e->getMessage()),404);
    }

  }

  //obtiene la region y provincia del ingresado
  function buscarzona_get(){
    $id = $this->get('id');
    try
    {
      $cond = " WHERE Comuna.COMUNA_ID = ".$id;
      $sql  = " SELECT Region.REGION_ID as IdRegion,Provincia.PROVINCIA_ID as IdProvincia";
      $sql .= " FROM Provincia ";
      $sql .= " INNER JOIN Region ON Provincia.PROVINCIA_REGION_ID = Region.REGION_ID";
      $sql .= " INNER JOIN Comuna ON Comuna.COMUNA_PROVINCIA_ID = Provincia.PROVINCIA_ID".$cond;

      $query = $this->db->query($sql);
      $this->response($query->result_array());
    }
    catch(Exception $e)
    {
        $this->response(array('error'=>$e->getMessage()),404);
    }

  }

  //actualiza el sector seleccionado
  function actualizar_post(){
    try
    {
      $post = array(); 
      foreach($this->post() as $key => $value)
      {
        $post[$key] = $value;
      }

      $l= new Sector();

      $resp = $l->where('Id_Sector',$post['idsector'])->
      update(array(
        'Nombre'        => $post['Nombre'] ,
        'PrecioFlete'   => $post['PrecioFlete'],
        'COMUNA_ID'     => $post['Id_Comuna']));
    }
    catch(Exception $e)
    {
      $this->response(array('error'=>$e->getMessage()),404);
    }
  }

}
?>