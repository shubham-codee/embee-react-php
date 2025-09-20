<?php
include_once("./header.php");
include_once("./AppError.php");
include_once("./GlobalErrorHandler.php");

try {
    if (!isset($_SESSION["user_id"])) {
        throw new AppError("Unauthorized: Please log in first.", 401);
    }

    if (!isset($_GET["filename"])) {
        throw new AppError("Filename not provided.", 400);
    }

    $filename = basename($_GET["filename"]);

    if (!preg_match('/^img_[a-z0-9]+\.[0-9]+\.(jpg|jpeg|png)$/i', $filename)) {
        throw new AppError("Invalid filename.", 400);
    }

    $uploadDir = __DIR__ . "/uploads/";
    $filePath = $uploadDir . $filename;

    if (!file_exists($filePath)) {
        throw new AppError("File does not exist.", 404);
    }

    if (!unlink($filePath)) {
        throw new AppError("Failed to delete the image.", 500);
    }

    echo json_encode([
        "success" => true,
        "message" => "Image deleted successfully."
    ]);
} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
}
