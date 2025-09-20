<?php
include_once("./header.php");
include("./Database.php");
include_once("./AppError.php");
include_once("./GlobalErrorHandler.php");

try {
    if (!isset($_GET["post_id"])) {
        throw new AppError("Post ID is required.", 400);
    }

    $postId = intval($_GET["post_id"]);

    if ($postId <= 0) {
        throw new AppError("Invalid post ID.", 400);
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

    $response = [
        "success" => true,
        "data" => $comments
    ];

    echo json_encode($response);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
?>
