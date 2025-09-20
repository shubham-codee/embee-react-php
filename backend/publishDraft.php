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
        throw new AppError("Draft ID is required.", 400);
    }

    $id = intval($_GET["id"]);
    if ($id <= 0) {
        throw new AppError("Invalid draft ID.", 400);
    }

    $user_id = $_SESSION["user_id"];

    $checkQuery = "SELECT * FROM drafts WHERE id = ? AND user_id = ?";
    $checkStmt = mysqli_prepare(Database::connect(), $checkQuery);
    mysqli_stmt_bind_param($checkStmt, "ii", $id, $user_id);
    mysqli_stmt_execute($checkStmt);
    $result = mysqli_stmt_get_result($checkStmt);
    $draft = mysqli_fetch_assoc($result);
    mysqli_stmt_close($checkStmt);

    if (!$draft) {
        throw new AppError("Draft not found or unauthorized.", 404);
    }

    $insertQuery = "INSERT INTO posts (user_id, title, image, content) VALUES (?, ?, ?, ?)";
    $insertStmt = mysqli_prepare(Database::connect(), $insertQuery);
    mysqli_stmt_bind_param($insertStmt, "isss", $user_id, $draft["title"], $draft["image"], $draft["content"]);
    mysqli_stmt_execute($insertStmt);
    mysqli_stmt_close($insertStmt);

    $deleteQuery = "DELETE FROM drafts WHERE id = ?";
    $deleteStmt = mysqli_prepare(Database::connect(), $deleteQuery);
    mysqli_stmt_bind_param($deleteStmt, "i", $id);
    mysqli_stmt_execute($deleteStmt);
    mysqli_stmt_close($deleteStmt);

    $fetchQuery = "SELECT id, title, image, content FROM posts ORDER BY id DESC";
    $fetchStmt = mysqli_prepare(Database::connect(), $fetchQuery);
    mysqli_stmt_execute($fetchStmt);
    $postsResult = mysqli_stmt_get_result($fetchStmt);

    $posts = [];
    while ($row = mysqli_fetch_assoc($postsResult)) {
        $posts[] = $row;
    }
    mysqli_stmt_close($fetchStmt);

    echo json_encode([
        "success" => true,
        "message" => "Draft published successfully",
        "data" => $posts
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
?>
