<?php
class AppError extends Exception{
    public $statusCode;

    public function __construct($message, $statusCode){
        parent::__construct($message);
        $this->statusCode = $statusCode;
    }
}
?>