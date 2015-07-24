<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'libraries/REST_Controller.php';
class Login extends REST_Controller 
{
	public function __construct()
	{
		parent::__construct();

		$this->load->library('bitauth');
		$this->load->library('form_validation');

	}

	public function index_get()
	{
		$data = array();
		if($this->bitauth->logged_in())
		{

			$data['usuario'] = $this->bitauth->fullname;
			$data['id_usuario'] = $this->bitauth->user_id;
			$data['logIn'] = "True";
			$sql = "SELECT Sucursal.Id_Sucursal, Perfil_Usuario.Tipo, Perfil_Usuario.Id_Perfil, Usuario.Supervisor
					FROM Usuario
					INNER JOIN Sucursal ON Usuario.Id_Sucursal = Sucursal.Id_Sucursal
					INNER JOIN Perfil_Usuario ON Perfil_Usuario.Id_Perfil = Usuario.Id_Perfil
					WHERE Usuario.Estado = '1' AND
					Usuario.Id_Usuario =".$this->bitauth->user_id;

			$query = $this->db->query($sql);

			foreach ($query->result_array() as $row)
			{
	   			$data['perfil'] = $row['Tipo'];
	   			$data['id_perfil'] = $row['Id_Perfil'];
	   			$data['Id_Sucursal'] = $row['Id_Sucursal'];
	   			if($row['Supervisor'] == '') $data['id_supervisor'] = '0';
	   			else $data['id_supervisor'] = $row['Supervisor'];
	   		}
			$this->response($data);
		}
		else
		{
			$this->response("False");
		}
		
	}

	public function logIn_post()
	{
		$data = array(); // para crear el arreglo con los errores
		//para recibir los datos mediante el metodo post
		$post = array(); 
		foreach($this->post() as $key => $value){
			$post[$key] = $value;
		}
		//fin de recepcion de datos
		$this->form_validation->set_message('required', 'El campo %s es requerido.');
		$this->form_validation->set_rules('user', 'Usuario', 'trim|required');
		$this->form_validation->set_rules('pass', 'Contraseña', 'required');
		if($this->form_validation->run() == TRUE)
		{
			if($this->bitauth->login($post['user'], $post['pass']))	
			{

					$this->response("True");
			}
			else
			{
				$data['error'] = $this->bitauth->get_error();
				$this->response($data);
			}
		}	
		else
		{
			$data['error'] = validation_errors();
			$this->response($data);
		}
		
	}

	public function logOut_get()
	{
		$this->bitauth->logout();
		$this->response("False");
	}
	
}
?>
