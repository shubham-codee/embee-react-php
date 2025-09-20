<?php
include_once("./header.php");
include("./Database.php");
include_once("./AppError.php");
include_once("./GlobalErrorHandler.php");

try {
    if (!isset($_SESSION["user_id"])) {
        throw new AppError("Unauthorized: Please log in first.", 401);
    }

    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input["title"], $input["image"], $input["content"])) {
        throw new AppError("Title, image, and content are required.", 400);
    }

    $title = trim($input["title"]);
    if (strlen($title) < 5 || strlen($title) > 150) {
        throw new AppError("Title must be between 5 and 150 characters.", 400);
    }

    $image = trim($input["image"]);
    if (!filter_var($image, FILTER_VALIDATE_URL)) {
        throw new AppError("Invalid image URL.", 400);
    }

    $filename = basename(parse_url($image, PHP_URL_PATH));
    if (!preg_match('/^img_[a-z0-9]+\.[0-9]+\.(jpg|jpeg|png)$/i', $filename)) {
        throw new AppError("Invalid image filename format.", 400);
    }

    $content = trim($input["content"]);
    if (strlen($content) < 20) {
        throw new AppError("Content is too short. Please write more.", 400);
    }

    $user_id = $_SESSION["user_id"];

    $query = "INSERT INTO posts(title, image, content, user_id) VALUES (?, ?, ?, ?)";
    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "sssi", $title, $image, $content, $user_id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    echo json_encode([
        "success" => true,
        "message" => "Post added successfully"
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
