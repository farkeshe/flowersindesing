<?php 

class Excel{ 
    var $FileName   = "export"; #Nombre del archivo 
    var $xls        = "";       #Contenido del archivo 
    var $row        = 1;        #Fila 
    var $col        = 1;        #Columna 

    public function Excel($file_name = "export")
    { 
        //Inicio de clase 
        $this->FileName = $file_name; 
    } 

    private function Head($file_name = ""){ 
        //Escribe cabeceras 
        $this->FileName = ($file_name == "") ? $this->FileName : $file_name; 
        $f = $this->FileName; 
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); 
        header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT"); 
        header("Cache-Control: no-cache, must-revalidate"); 
        header("Pragma: no-cache"); 
        header("Content-type: application/x-msexcel"); 
        header("Content-Disposition: attachment; filename=$f.xls" ); 
        header("Content-Description: PHP/INTERBASE Generated Data" ); 
        header("Expires: 0"); 
    } 

    private function BOF(){ 
        //Inicio de archivo 
        return pack("ssssss", 0x809, 0x8, 0x0, 0x10, 0x0, 0x0); 
    } 

    private function EOF(){ 
        //Fin de archivo 
        return pack("ss", 0x0A, 0x00); 
    } 

    public function Number($Row, $Col, $Value){ 
        //Escribe un número (double) en la $Row/$Col 
        $this->xls .= pack("sssss", 0x203, 14, $Row, $Col, 0x0); 
        $this->xls .= pack("d", $Value); 
    } 

    public function Text($Row, $Col, $Value){ 
        //Escribe texto en $Row/$Col (UTF8) 
        $Value2UTF8 = utf8_decode($Value); 
        $L = strlen($Value2UTF8); 
        $this->xls .= pack("ssssss", 0x204, 8 + $L, $Row, $Col, 0x0, $L); 
        $this->xls .= $Value2UTF8; 
    } 

    public function Write($Row, $Col, $Value){ 
        //Escribir texto o numeros en $Row/$Col 
        if (is_numeric($Value)) $this->Number($Row, $Col, $Value); 
        else $this->Text($Row, $Col, $Value); 
    } 

    public function WriteMatriz($Matriz){ 
        //Convierte una matriz en una planilla 
        //NOTA: Elimina el contenido que haya hasta ahora almacenado! 
        /* 
         * Ejemplo: 
         * $Matriz = array( 
         *      array('Nombre', 'Apellido', 'Edad'), 
         *      array('Luciana', 'Camila', 1), 
         *      array('Eduardo, 'Cuomo', 24), 
         *      array('Vanesa', 'Chavez', 21) 
         * ); 
         * 
         * Devuelve un EXCEL como: 
         * _| A     | B      | C  | 
         * 1|Nombre |Apellido|Edad| 
         * 2|Luciana|Camila  |1   | 
         * 3|Eduardo|Cuomo   |24  | 
         * 4|Vanesa |Chavez  |21  | 
         * 
        */ 
        $this->xls = ""; 
        $nRow = 0; 
        $nCol = 0; 
        foreach($Matriz as $Row){ 
            foreach($Row as $Value){ 
                $this->Write($nRow, $nCol, $Value); 
                $nCol++; 
            } 
            $nCol = 0; 
            $nRow++; 
        } 
    } 

    public function WriteListadoCotizacion($resultset, $header) 
    {
        $this->xls = "";
        $nCol = 0;
        $numCols = count($header);
        for ($i = 0; $i < $numCols; $i++) 
        {
            $this->Write(0, $i, $header[$i]);
        }
        $nRow = 1;

        foreach($resultset as $row) 
        {
            $this->Write($nRow, 0, $row['Id_Pedidos']);
            $this->Write($nRow, 1, date("d/m/Y", strtotime($row['Fecha_Cot'])));
            $this->Write($nRow, 2, $row['Clase']);
            $this->Write($nRow, 3, $row['Responsable']);
            $this->Write($nRow, 4, $row['Vendedor']);
            $this->Write($nRow, 5, $row['Cliente']);
            $this->Write($nRow, 6, number_format($row['Total_Flete']));
            $this->Write($nRow, 7, number_format($row['Valor_Neto']));
            $this->Write($nRow, 8, number_format($row['Total']));
            $nRow++;
        }
            
    }

    public function WriteListaPrecios($resultset, $header) 
    {
        $this->xls = "";
        $nCol = 0;
        $numCols = count($header);
        for ($i = 0; $i < $numCols; $i++) 
        {
            $this->Write(0, $i, $header[$i]);
        }
        $nRow = 1;

        foreach($resultset as $row) 
        {
            $this->Write($nRow, 0, $row['Nombre']);
            $this->Write($nRow, 1, $row['name']);
            $this->Write($nRow, 2, $row['Tipo']);
            $this->Write($nRow, 3, $row['Estadolista']);
            if($row['Periodo_Desde'] != ""){$this->Write($nRow, 4,  date("d/m/Y", strtotime($row['Periodo_Desde'])));}
            ///$this->Write($nRow, 4,  date("d/m/Y", strtotime($row['Periodo_Desde'])));
            if($row['Periodo_Hasta'] != "") {$this->Write($nRow, 5,  date("d/m/Y", strtotime($row['Periodo_Hasta'])));}
            $nRow++;
        }
            
    }

    public function Download($file_name = ""){ 
        //Escribe el archivo y agrega las cabeceras para generar la descarga 
        $this->Head($file_name); 
        echo $this->BOF(); 
        echo $this->xls; 
        echo $this->EOF(); 
    } 

    public function Archivo($loc_file){ 
        //Crea archivo, borrando el que existe si ya existia 
        //$loc_file : Ruta del archivo. Ej: "./downloads/archivo.xls" 
        $f = fopen($loc_file, 'w'); 
        fwrite($f, $this->BOF()); 
        fwrite($f, $this->xls); 
        fwrite($f, $this->EOF()); 
        fclose($f); 
    } 

} 
?>