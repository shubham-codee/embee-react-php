<?php
include_once("./header.php");
include("./Database.php");
include_once("./AppError.php");
include_once("./GlobalErrorHandler.php");

try {
    if (!isset($_GET["id"])) {
        throw new AppError("Post ID is required.", 400);
    }

    $id = intval($_GET["id"]);

    if ($id <= 0) {
        throw new AppError("Invalid post ID.", 400);
    }

    $query = "SELECT posts.id, posts.title, posts.image, posts.content, posts.user_id, users.username 
              FROM posts 
              JOIN users ON posts.user_id = users.id 
              WHERE posts.id = ?";

    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $row = mysqli_fetch_assoc($result);
    mysqli_stmt_close($stmt);

    if (!$row) {
        throw new AppError("Post not found.", 404);
    }

    echo json_encode([
        "success" => true,
        "message" => "Post fetched successfully.",
        "data" => $row
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
