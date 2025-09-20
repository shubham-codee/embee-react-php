<?php
class GlobalErrorHandler{
    public static function handleError($error){
        $statusCode = $error instanceof AppError ? $error->statusCode : 500;

        http_response_code($statusCode);
        echo json_encode([
            "success" => false,
            "error" => $error->getMessage()
        ]);
    }
}
?>