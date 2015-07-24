<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class usuarios extends REST_Controller 
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
      $this->load->library('form_validation');
      //cargamos las librerias de usuario

      //cargamos la libreria bitauth
      $this->load->library('bitauth');

      //if(!$this->bitauth->logged_in()) 
      //{
       //   $this->response('Session Terminada',302);
      //}

  }

  public function index_post()
  {
         try{
      $post = array(); 
      foreach($this->post() as $key => $value){
        $post[$key] = $value;
      }

    /*$subgerenciausuarios = $this->get('subgerenciausuarios');
    $perfilusuarios =$this->get('perfilusuarios');
    */
    $cond=" WHERE Usuario.Estado = 1 AND ";
    $cont = 1;

    if($post['sucursal'] == "vacio" and $post['perfil'] == "vacio"){
     $cond=" WHERE Usuario.Estado = 1 ";
    }


    if($post['sucursal']  != "vacio"){
      $cont = 0;
      $cond .= " Usuario.Id_Sucursal = ".$post['sucursal'] ;
    }
    if($post['perfil'] != "vacio"){
      if($cont ==1){
        $cont = 0;
        $cond .=  " Usuario.Id_Perfil = ".$post['perfil'];
      }
      else{
        $cond .=  " AND Usuario.Id_Perfil = ".$post['perfil'];
      }
    }

    $sql = "SELECT
      Usuario.Id_Usuario,
      Usuario.Id_Perfil,
      Usuario.Id_Sucursal,
      Usuario.Nombre,
      Usuario.Telefono,
      Usuario.Celular,
      Usuario.Email,
      Usuario.Supervisor,
      Usuario.User,
      Usuario.Estado,
      Perfil_Usuario.Tipo,
      Sucursal.Nombre as name,
      
      (
       SELECT ar.Nombre as nombreusuario
        from Usuario as ar
        where ar.Id_Usuario =  Usuario.Supervisor   
      )super

      FROM
      Usuario 
      LEFT JOIN Perfil_Usuario ON Usuario.Id_Perfil = Perfil_Usuario.Id_Perfil
      LEFT JOIN Sucursal ON Usuario.Id_Sucursal = Sucursal.Id_Sucursal
      ".$cond;



      $query = $this->db->query($sql.' LIMIT '.$post['start'].','.'14');
      if(count($query->result_array())==0){
        $this->response(array(),202);
      }else{
        $this->response($query->result_array());
      }

      }catch(Exception $e){
        $this->response(array(
          'error'=>$e->getMessage()
        ),404);
      }
  }

  public function contarRegistros_post(){
      try{
      $post = array(); 
      foreach($this->post() as $key => $value){
        $post[$key] = $value;
      }

    /*$subgerenciausuarios = $this->get('subgerenciausuarios');
    $perfilusuarios =$this->get('perfilusuarios');
    */
    $cond=" WHERE Usuario.Estado = 1 AND ";
    $cont = 1;

    if($post['sucursal'] == "vacio" and $post['perfil'] == "vacio"){
     $cond=" WHERE Usuario.Estado = 1";
    }


    if($post['sucursal']  != "vacio"){
      $cont = 0;
      $cond .= " Usuario.Id_Sucursal = ".$post['sucursal'] ;
    }
    if($post['perfil'] != "vacio"){
      if($cont ==1){
        $cont = 0;
        $cond .=  " Usuario.Id_Perfil = ".$post['perfil'];
      }
      else{
        $cond .=  " AND Usuario.Id_Perfil = ".$post['perfil'];
      }
    }

      $sql = "SELECT Count( Usuario.Id_Usuario) AS Cantidad_Total
      FROM
      Usuario
      LEFT JOIN Perfil_Usuario ON Usuario.Id_Perfil = Perfil_Usuario.Id_Perfil
      LEFT JOIN Sucursal ON Usuario.Id_Sucursal = Sucursal.Id_Sucursal
      ".$cond;

      //
         
      $query = $this->db->query($sql);   
      $this->response($query->result_array());

    }catch(Exception $e){
        $this->response(array(
          'error'=>$e->getMessage()
        ),404);
    }
  }

  function perfil_get(){

        $this->load->model('Perfil_Usuario');
        $g = new Perfil_Usuario();
        $g->get()->order_by('Id_Perfil'); 
        $this->response($g->all_to_array());

  }

    function obtenerusuario_get(){
    try{


      $id = $this->get('id');

      $sql = "SELECT
      Usuario.Id_Usuario,
      Usuario.Id_Perfil,
      Usuario.Id_Sucursal,
      Usuario.Nombre,
      Usuario.Telefono,
      Usuario.Celular,
      Usuario.Email,
      Usuario.Supervisor,
      Usuario.User,
      Usuario.Estado,
      Perfil_Usuario.Tipo,
      Sucursal.Nombre as name,
      
      (
       SELECT ar.Nombre as nombreusuario
        from Usuario as ar
        where ar.Id_Usuario =  Usuario.Supervisor   
      )super
      FROM
      Usuario 

      LEFT JOIN Perfil_Usuario ON Usuario.Id_Perfil = Perfil_Usuario.Id_Perfil
      LEFT JOIN Sucursal ON Usuario.Id_Sucursal = Sucursal.Id_Sucursal
      WHERE
      Usuario.Id_Usuario = ".$id;

      $query = $this->db->query($sql);   
      $this->response($query->result_array());

      }catch(Exception $e){
        $this->response(array(
          'error'=>$e->getMessage()
        ),404);
      }

  }
  function supervisor_get(){
    try{
      $sql = "SELECT
      Usuario.Id_Usuario,
      Usuario.Id_Perfil,
      Usuario.Id_Sucursal,
      Usuario.Nombre,
      Usuario.Telefono,
      Usuario.Celular,
      Usuario.Email,
      Usuario.Supervisor,
      Usuario.`User`,
      Usuario.Estado
      FROM
      Usuario
      WHERE
      Usuario.Id_Perfil = 3";

      $query = $this->db->query($sql);   
      $this->response($query->result_array());

      }catch(Exception $e){
        $this->response(array(
          'error'=>$e->getMessage()
        ),404);
      }

  }

  function sucursal_get() 
  {
    $this->load->model('Sucursal');

      $g = new Sucursal();
      $g->get()->order_by('Nombre'); 
      $this->response($g->all_to_array());
   
  }
  
function eliminar_get()
  {
    try
    {
      $this->load->model('Usuario');
      $l = new Usuario();

      $id = $this->get('id');
      $resp = $l->where('Id_Usuario',$id)->update('Estado','0');
      $this->bitauth->disable($id);

    }catch(Exception $e){
        $this->response(array(
          'error'=>$e->getMessage()
        ),404);
      }
  }


function updateusuario_post(){
    try{
      //para recibir los datos mediante el metodo post
      $post = array(); 
      foreach($this->post() as $key => $value){
        $post[$key] = $value;
      }

      $this->load->model('Usuario');
      $c = new Usuario();
        $user = $c->where('Id_Usuario',$post['id'])->update(array(
            'Id_Perfil' => $post['perfil'], 
            'Id_Sucursal' => $post['consignatario'],
            'Telefono' => $post['telefono'],
            'Nombre' =>  $post['nombre'],
            'Celular' => $post['celular'],
            'Email' => $post['email'], //cambiar  cuando cambie de BD a principal
            'Supervisor' => $post['supervisor'],
            'User' => $post['user'],
            'Estado' => '1'));

        if($post['pass'] != ""){
          $res = $this->bitauth->update_user( $post['id'],
              array('username' => $post['user'],
              'password' => $post['pass'],
              'groups'   => array($post['perfil']),
              'fullname' => $post['nombre'],
              'email' => $post['email']));
        }else{
           $res = $this->bitauth->update_user( $post['id'],
              array('username' => $post['user'],
              'groups'   => array($post['perfil']),
              'fullname' => $post['nombre'],
              'email' => $post['email']));
        }
       # $this->response('true');
      /*}else{
        $this->response('false');
      }*/


    }catch(Exception $e){ $this->response(array('error'=>$e->getMessage()),404);}
  }

  function guardarusuario_post(){
    try{
      //para recibir los datos mediante el metodo post
      $post = array();
      #echo var_dump($this->post()); 
      foreach($this->post() as $key => $value){
        $post[$key] = $value;
      }

      $this->load->model('Usuario');
      $c = new Usuario();


      $aux = "SELECT Count(Usuario.User) as contador
        FROM
        Usuario
        WHERE
        Usuario.User = '".$post['user']."'";

      $query = $this->db->query($aux);   

      foreach ($query->result_array() as $row) {
        $i = $row['contador'];
        #echo $i;
      }
    // $i='0';
    
      if($i == '0')
      {
        //agregando usuario a bitauth
        $user = array(
        'username' => $post['user'],
        'password' => $post['pass'],
        'groups'   => array($post['perfil']),
        'fullname' => $post['nombre'],
        'email' => $post['email']
        );

        $usuario = $this->bitauth->add_user($user);

        $c->Id_Usuario = $usuario->user_id; 
        $c->Id_Perfil = $post['perfil']; 
        $c->Id_Sucursal = $post['consignatario'];
        $c->Telefono = $post['telefono'];
        $c->Nombre =  $post['nombre'];
        $c->Celular = $post['celular'];
        $c->Email = $post['email']; //cambiar  cuando cambie de BD a principal
        $c->Supervisor = $post['supervisor'];
        $c->User = $post['user'];
        $c->Estado = '1';
        $c->save();    
        $this->response($usuario->user_id);
      }else{
        #$this->response('false');
      }


    }catch(Exception $e){ $this->response(array('error'=>$e->getMessage()),404);}
  }

}
?>
