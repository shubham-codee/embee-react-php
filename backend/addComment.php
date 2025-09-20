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

    if (!isset($input["post_id"], $input["content"])) {
        throw new AppError("Post ID and content are required.", 400);
    }

    $userId = $_SESSION["user_id"];
    $postId = intval($input["post_id"]);
    $content = trim($input["content"]);

    if ($postId <= 0) {
        throw new AppError("Invalid post ID.", 400);
    }

    if ($content === "") {
        throw new AppError("Comment content cannot be empty.", 400);
    }

    $postQuery = "SELECT id FROM posts WHERE id = ?";
    $postStmt = mysqli_prepare(Database::connect(), $postQuery);
    mysqli_stmt_bind_param($postStmt, "i", $postId);
    mysqli_stmt_execute($postStmt);
    $postResult = mysqli_stmt_get_result($postStmt);
    $postExists = mysqli_fetch_assoc($postResult);
    mysqli_stmt_close($postStmt);

    if (!$postExists) {
        throw new AppError("Post not found.", 404);
    }

    $query = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "iis", $postId, $userId, $content);

    if (!mysqli_stmt_execute($stmt)) {
        throw new AppError("Failed to add comment.", 500);
    }

    mysqli_stmt_close($stmt);

    $fetchQuery = "
        SELECT c.id, c.content, c.user_id, u.username
        FROM comments c
        INNER JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.id DESC
    ";
    $fetchStmt = mysqli_prepare(Database::connect(), $fetchQuery);
    mysqli_stmt_bind_param($fetchStmt, "i", $postId);
    mysqli_stmt_execute($fetchStmt);
    $result = mysqli_stmt_get_result($fetchStmt);

    $comments = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $comments[] = [
            "id" => $row["id"],
            "content" => $row["content"],
            "user_id" => $row["user_id"],
            "username" => $row["username"]
        ];
    }
    mysqli_stmt_close($fetchStmt);

    echo json_encode([
        "success" => true,
        "message" => "Comment added successfully.",
        "data" => $comments
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
?>
