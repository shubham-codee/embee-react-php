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

    if (!isset($input["comment_id"], $input["post_id"], $input["content"])) {
        throw new AppError("Comment ID, Post ID, and new content are required.", 400);
    }

    $commentId = intval($input["comment_id"]);
    $postId = intval($input["post_id"]);
    $content = trim($input["content"]);
    $userId = $_SESSION["user_id"];

    if ($commentId <= 0 || $postId <= 0 || $content === "") {
        throw new AppError("Invalid comment ID, post ID, or empty content.", 400);
    }

    $checkQuery = "SELECT id FROM comments WHERE id = ? AND user_id = ?";
    $checkStmt = mysqli_prepare(Database::connect(), $checkQuery);
    mysqli_stmt_bind_param($checkStmt, "ii", $commentId, $userId);
    mysqli_stmt_execute($checkStmt);
    $checkResult = mysqli_stmt_get_result($checkStmt);
    $commentExists = mysqli_fetch_assoc($checkResult);
    mysqli_stmt_close($checkStmt);

    if (!$commentExists) {
        throw new AppError("Comment not found or you are not authorized to edit it.", 404);
    }

    $updateQuery = "UPDATE comments SET content = ? WHERE id = ?";
    $updateStmt = mysqli_prepare(Database::connect(), $updateQuery);
    mysqli_stmt_bind_param($updateStmt, "si", $content, $commentId);
    mysqli_stmt_execute($updateStmt);
    mysqli_stmt_close($updateStmt);

    $query = "
        SELECT c.id, c.content, c.user_id, u.username
        FROM comments c
        INNER JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.id DESC
    ";
    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "i", $postId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $comments = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $comments[] = [
            "id" => $row["id"],
            "content" => $row["content"],
            "user_id" => $row["user_id"],
            "username" => $row["username"]
        ];
    }
    mysqli_stmt_close($stmt);

    echo json_encode([
        "success" => true,
        "message" => "Comment updated successfully.",
        "data" => $comments
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
?>
