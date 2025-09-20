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

    if (!isset($input["post_id"])) {
        throw new AppError("Post ID is required to add favourite.", 400);
    }

    $userId = $_SESSION["user_id"];
    $postId = intval($input["post_id"]);

    $checkPostQuery = "SELECT id FROM posts WHERE id = ?";
    $stmt = mysqli_prepare(Database::connect(), $checkPostQuery);
    mysqli_stmt_bind_param($stmt, "i", $postId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $post = mysqli_fetch_assoc($result);

    if (!$post) {
        throw new AppError("Post not found.", 404);
    }
    mysqli_stmt_close($stmt);

    $checkFavQuery = "SELECT id FROM favourites WHERE user_id = ? AND post_id = ?";
    $stmt = mysqli_prepare(Database::connect(), $checkFavQuery);
    mysqli_stmt_bind_param($stmt, "ii", $userId, $postId);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        throw new AppError("This post is already in your favourites.", 400);
    }
    mysqli_stmt_close($stmt);

    $insertQuery = "INSERT INTO favourites (user_id, post_id) VALUES (?, ?)";
    $stmt = mysqli_prepare(Database::connect(), $insertQuery);
    mysqli_stmt_bind_param($stmt, "ii", $userId, $postId);
    $result = mysqli_stmt_execute($stmt);

    if (!$result) {
        throw new AppError("Failed to add favourite.", 500);
    }

    $favouriteId = mysqli_insert_id(Database::connect());

    echo json_encode([
        "success" => true,
        "message" => "Post added to favourites.",
        "data" => [
            "favourite_id" => $favouriteId,
            "post_id" => $postId
        ]
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
