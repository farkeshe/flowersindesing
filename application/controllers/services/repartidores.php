<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class repartidores extends REST_Controller 
{
   	public function __construct(){
      parent::__construct();

      //cargamos la libreria para crear una variable de session
      $this->load->library('session');
      //cargamos la libreria para exportar a excel
      $this->load->library('Excel');
      //cargamos la libreria para exportar a pdf
      $this->load->library('mpdf');

      $this->load->model('repartidores_fecha');
      //cargamos la libreria bitauth
      $this->load->library('bitauth');

      //if(!$this->bitauth->logged_in()) 
      //{
        //  $this->response('Session Terminada',302);
      //}

    }


    function buscarFechaRepartidores_get()
    {
	    $sql = "SELECT
	    DATE_FORMAT(Repartidores_Fecha.Fecha,'%e-%c-%Y') as fecha,
	    Repartidores_Fecha.Cantidad_Repartidores as cantidadrepartidores
	    FROM
	    Repartidores_Fecha";
	    $query = $this->db->query($sql);   
	    $this->response($query->result_array());
    }

    function obtenerrepartidoresdia_get()
    {
      $fecha = $this->get('fecha');
      $cond = " WHERE Repartidores_Fecha.Fecha = '".$fecha."'";
      $sql = "SELECT
      *
      FROM
      Repartidores_Fecha".$cond;
      $query = $this->db->query($sql);
      if (count($query->result_array())==0) {
          $this->response(array('error'=>'202'),202);
      }else{
          $this->response($query->result_array());
      }   
    }

    function guardarRepartidorFecha_post()
    {
          $post = array(); 
          foreach($this->post() as $key => $value)
          {
              $post[$key] = $value;
          }
          try
          {
              if (count($post["seleccionadosnuevos"]) != 0){
                  foreach($post["seleccionadosnuevos"] as $fecha)
                  {
                      if ($fecha != "undefined")
                      {
                          $newformat = date('y-m-d',strtotime($fecha));
                          $R= new Repartidores_Fecha();
                          $R->Fecha= $newformat;
                          $R->Cantidad_Repartidores= $post["cantidadrepartidores"];
                          $Rep = $R->save(); 
                      }
                  }
              }

              if (count($post["seleccionadosantiguos"]) != 0){
                  foreach($post["seleccionadosantiguos"] as $fechaantigua)
                  {
                      if ($fechaantigua != "undefined")
                      {
                         $R= new Repartidores_Fecha();
                         $newformat = date('y-m-d',strtotime($fechaantigua));
                         $resp = $R->where('Fecha',$newformat)->
                         update(
                        'Cantidad_Repartidores',$post['cantidadrepartidores']);
                      }
                  }
              }      
          }
          catch(Exception $e)
          {
              $this->response(array('error'=>$e->getMessage()),404);
          }
    }

    public function obtenercantidadpedidos_post()
    {     
        $post = array(); 
        foreach($this->post() as $key => $value)
        {
            $post[$key] = $value;
        } 
        try
        {
            $cantidad = 0;
            foreach($post["fechasselect"] as $fecha)
            {
              if ($fecha != "undefined"){
                $newformat = date('Y-m-d',strtotime($fecha));
                $cond = " WHERE Pedidos.FechaHoraDespacho like '".$newformat."%'";
                $sql= "SELECT
                Pedidos.Id_Pedidos
                FROM
                Pedidos".$cond;
                $query = $this->db->query($sql);
                $cantidad = $cantidad + ($query->num_rows);
              }
            }
            $this->response($cantidad,200);
        } 
        catch(Exception $e)
        {
            $this->response(array('error'=>$e->getMessage()),404);
        }
    }

}