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
        throw new AppError("Post ID is required to remove favourite.", 400);
    }

    $userId = $_SESSION["user_id"];
    $postId = intval($input["post_id"]);

    $checkQuery = "SELECT id FROM favourites WHERE user_id = ? AND post_id = ?";
    $stmt = mysqli_prepare(Database::connect(), $checkQuery);
    mysqli_stmt_bind_param($stmt, "ii", $userId, $postId);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) === 0) {
        mysqli_stmt_close($stmt);
        throw new AppError("This post is not in your favourites.", 404);
    }
    mysqli_stmt_close($stmt);

    $deleteQuery = "DELETE FROM favourites WHERE user_id = ? AND post_id = ?";
    $stmt = mysqli_prepare(Database::connect(), $deleteQuery);
    mysqli_stmt_bind_param($stmt, "ii", $userId, $postId);
    mysqli_stmt_execute($stmt);

    if (mysqli_stmt_affected_rows($stmt) < 1) {
        mysqli_stmt_close($stmt);
        throw new AppError("Failed to remove favourite.", 500);
    }
    mysqli_stmt_close($stmt);

    echo json_encode([
        "success" => true,
        "message" => "Post removed from favourites.",
        "data" => [
            "post_id" => $postId
        ]
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
