<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class lugares extends REST_Controller{

    public function __construct(){
      parent::__construct();

      //cargamos la libreria para crear una variable de session
      $this->load->library('session');
      //cargamos la libreria para exportar a excel
      $this->load->library('Excel');
      //cargamos la libreria para exportar a pdf
      $this->load->library('mpdf');
              //cargamos los modelos
      $this->load->model('lugar');
      //cargamos la libreria bitauth
      $this->load->library('bitauth');

      //if(!$this->bitauth->logged_in()) 
      //{
       //   $this->response('Session Terminada',302);
      //}

    }

    function sectores_get()
    {
      $comuna= $this->get('comuna');
      $cond = " WHERE  Sector.Estado= 1";
      if($comuna == "" or $comuna == "undefined" or $comuna == '0'){
        $cond .= "";
      }
      else{
        $cond .= " AND Comuna.COMUNA_ID= ".$comuna;
      }
 
      $sql = "SELECT
      Sector.Nombre,
      Sector.Id_Sector
      FROM
      Sector INNER JOIN Comuna
      ON Comuna.COMUNA_ID = Sector.COMUNA_ID
      ".$cond;
      $query = $this->db->query($sql);   
      $this->response($query->result_array());
    }


    function tipos_get()
    {
      $sql = "SELECT
      Tipo.Id_Tipo,
      Tipo.Nombre
      FROM
      Tipo";
      $query = $this->db->query($sql);   
      $this->response($query->result_array());
    }

    function guardarlugar_post()
    {
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        }

        try
        {
            //guardando el lugar
            $S= new Lugar();
            $S->Nombre= $post["Nombre"];
            $S->Estado= 1;
            $S->Id_Sector= $post["Id_Sector"];
            $S->Id_Tipo= $post["Id_Tipo"];
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

    function obtenerlugar_get()
    {
      $nombre= $this->get('nombre');
      $idtipo= $this->get('idtipo');
      $idsector= $this->get('idsector');
      $cond = " WHERE Lugar.Estado = 1 ";
      $cond.= " AND Lugar.Id_Tipo = ".$idtipo;
      $cond.= " AND Lugar.Id_Sector = ".$idsector;
      $cond.= " AND Lugar.Nombre = '".$nombre."'";
      $sql = " SELECT count(*) as c FROM Lugar".$cond;
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
          $cond=" WHERE Lugar.Estado = 1 ";
          if($post['comuna'] != ""){
            $cond .=  " AND Comuna.COMUNA_NOMBRE = '".$post['comuna']."'";
          }
          if($post['idsector'] != "" AND $post['idsector'] != 0){
            $cond .=  " AND Lugar.Id_Sector = ".$post['idsector'];
          }
          if($post['idtipo'] != "" AND $post['idtipo'] != 0){
            $cond .=  " AND Lugar.Id_Tipo = ".$post['idtipo'];
          }

          $sql = "SELECT Count(Lugar.Id_Lugar) AS Cantidad_Total
          FROM
          Lugar         
          INNER JOIN Tipo ON Tipo.Id_Tipo = Lugar.Id_Tipo
          INNER JOIN Sector ON Lugar.Id_Sector = Sector.Id_Sector
          INNER JOIN Comuna ON Sector.COMUNA_ID = Comuna.COMUNA_ID".$cond;

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

        //a continuacion se realizan las condiciones de filtro
        $cond=" WHERE Lugar.Estado = 1 ";
        if($post['comuna'] != ""){
          $cond .=  " AND Comuna.COMUNA_NOMBRE = '".$post['comuna']."'";
        }
        if($post['idsector'] != "" AND $post['idsector'] != 0){
          $cond .=  " AND Lugar.Id_Sector = ".$post['idsector'];
        }
        if($post['idtipo'] != "" AND $post['idtipo'] != 0){
          $cond .=  " AND Lugar.Id_Tipo = ".$post['idtipo'];
        }

        $sql = "SELECT
        Lugar.Nombre as nombrelugar,
        Lugar.Id_Lugar,
        Tipo.Nombre as nombretipo,
        Sector.Nombre as nombresector,
        Comuna.COMUNA_NOMBRE as nombrecomuna
        FROM Lugar
        INNER JOIN Tipo ON Tipo.Id_Tipo = Lugar.Id_Tipo
        INNER JOIN Sector ON Lugar.Id_Sector = Sector.Id_Sector
        INNER JOIN Comuna ON Sector.COMUNA_ID = Comuna.COMUNA_ID".$cond;
   
        $query = $this->db->query($sql.' ORDER BY Lugar.Id_Lugar DESC '.' LIMIT '.$post['start'].','.'14');
        $this->response($query->result_array());
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

    // funcion que elimina un lugar
    function eliminar_get()
    {
      try
      {
          $id= $this->get('id');

          $sql = "SELECT * FROM Destino WHERE Id_Lugar=".$id;
          $query = $this->db->query($sql);
          if ($query->num_rows == 0){
                  $sql = " DELETE FROM Lugar WHERE Id_Lugar=".$id;
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

    //obtiene los datos del lugar que sera editado
    function buscar_get(){
      $id = $this->get('id');
      try
      {
          $c= new Lugar();
          $c->where(array('Id_Lugar'=>$id, 'Estado' => '1'));
          $c->get();

          $this->response($c->all_to_array());
      }
      catch(Exception $e)
      {
          $this->response(array('error'=>$e->getMessage()),404);
      }

    }

    //obtiene la region,provincia, comuna del sector ingresado
    function buscarzona_get(){
      $id = $this->get('id');
      try
      {
        $cond = " WHERE Sector.Id_Sector = ".$id;
        $sql  = " SELECT Region.REGION_ID as IdRegion,Provincia.PROVINCIA_ID as IdProvincia,Comuna.COMUNA_ID as IdComuna";
        $sql .= " FROM Comuna ";
        $sql .= " INNER JOIN Sector ON Sector.COMUNA_ID = Comuna.COMUNA_ID";
        $sql .= " INNER JOIN Provincia ON Comuna.COMUNA_PROVINCIA_ID = Provincia.PROVINCIA_ID";
        $sql .= " INNER JOIN Region ON Provincia.PROVINCIA_REGION_ID = Region.REGION_ID".$cond;

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

        $l= new Lugar();

        $resp = $l->where('Id_Lugar',$post['idlugar'])->
        update(array(
          'Nombre'      => $post['Nombre'] ,
          'Id_Sector'   => $post['Id_Sector'],
          'Id_Tipo'     => $post['Id_Tipo']));
      }
      catch(Exception $e)
      {
        $this->response(array('error'=>$e->getMessage()),404);
      }
    }

}
?>