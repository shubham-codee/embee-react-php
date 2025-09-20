<?php
include_once("./header.php");
include_once("./AppError.php");
include_once("./GlobalErrorHandler.php");

try {
    if (!isset($_SESSION["user_id"])) {
        throw new AppError("Unauthorized: Please log in first.", 401);
    }

    if (!isset($_FILES["file"])) {
        throw new AppError("No file uploaded.", 400);
    }

    $file = $_FILES['file'];
    $originalName = $file['name'];
    $tempPath = $file['tmp_name'];
    $fileError = $file['error'];

    if ($fileError !== UPLOAD_ERR_OK) {
        throw new AppError("Upload error: " . $fileError, 400);
    }

    $allowedExtensions = ['jpg', 'jpeg', 'png', 'img'];
    $fileExt = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    if (!in_array($fileExt, $allowedExtensions)) {
        throw new AppError("Invalid file type. Only images are allowed.", 400);
    }

    $imageInfo = getimagesize($tempPath);
    if (strpos($imageInfo["mime"], "image/") !== 0) {
        throw new AppError("Uploaded file is not a valid image.", 400);
    }

    $uploadDir = "uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0700, true);
    }

    $uniqueName = uniqid("img_", true) . "." . $fileExt;
    $destination = $uploadDir . $uniqueName;

    if (!move_uploaded_file($tempPath, $destination)) {
        throw new AppError("Failed to move uploaded file", 500);
    }

    $url = "http://localhost/MyBlog/" . $destination;

    echo json_encode([
        "success" => true,
        "url" => $url
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
}