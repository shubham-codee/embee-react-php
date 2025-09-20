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
        throw new AppError("Post ID is required.", 400);
    }

    $userId = $_SESSION["user_id"];
    $postId = (int)$input["post_id"];

    $query = "SELECT id FROM favourites WHERE user_id = ? AND post_id = ?";
    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "ii", $userId, $postId);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    $isFavourite = mysqli_stmt_num_rows($stmt) > 0;

    echo json_encode([
        "success" => true,
        "data" => [
            "isFavourite" => $isFavourite
        ]
    ]);

    mysqli_stmt_close($stmt);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
