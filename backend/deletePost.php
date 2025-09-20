<?php
include_once("./header.php");
include("./Database.php");
include_once("./AppError.php");
include_once("./GlobalErrorHandler.php");

try {
    if (!isset($_SESSION["user_id"])) {
        throw new AppError("Unauthorized: Please log in first.", 401);
    }

    if (!isset($_GET["id"])) {
        throw new AppError("ID is required.", 400);
    }

    $id = intval($_GET["id"]);

    if ($id <= 0) {
        throw new AppError("Invalid post ID.", 400);
    }

    $user_id = $_SESSION["user_id"];

    $checkQuery = "SELECT user_id FROM posts WHERE id = ?";
    $checkStmt = mysqli_prepare(Database::connect(), $checkQuery);
    mysqli_stmt_bind_param($checkStmt, "i", $id);
    mysqli_stmt_execute($checkStmt);
    $checkResult = mysqli_stmt_get_result($checkStmt);
    $post = mysqli_fetch_assoc($checkResult);
    mysqli_stmt_close($checkStmt);

    if (!$post) {
        throw new AppError("Post not found.", 404);
    }

    if ($post["user_id"] != $user_id) {
        throw new AppError("Unauthorized: You do not own this post.", 403);
    }

    $query = "DELETE FROM posts WHERE id=?";
    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    echo json_encode([
        "success" => true,
        "message" => "Post deleted successfully"
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
