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
        throw new AppError("Invalid draft ID.", 400);
    }

    $user_id = $_SESSION["user_id"];

    $checkQuery = "SELECT user_id FROM drafts WHERE id = ?";
    $checkStmt = mysqli_prepare(Database::connect(), $checkQuery);
    mysqli_stmt_bind_param($checkStmt, "i", $id);
    mysqli_stmt_execute($checkStmt);
    $checkResult = mysqli_stmt_get_result($checkStmt);
    $draft = mysqli_fetch_assoc($checkResult);
    mysqli_stmt_close($checkStmt);

    if (!$draft) {
        throw new AppError("Draft not found.", 404);
    }

    if ($draft["user_id"] != $user_id) {
        throw new AppError("Unauthorized: You do not own this draft.", 403);
    }

    $query = "DELETE FROM drafts WHERE id=?";
    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    $fetchQuery = "SELECT id, title, image, content, status FROM drafts WHERE user_id = ? ORDER BY id DESC";
    $fetchStmt = mysqli_prepare(Database::connect(), $fetchQuery);
    mysqli_stmt_bind_param($fetchStmt, "i", $user_id);
    mysqli_stmt_execute($fetchStmt);
    $result = mysqli_stmt_get_result($fetchStmt);

    $drafts = [];
     while ($row = mysqli_fetch_assoc($result)) {
        $drafts[] = [
            "id" => $row["id"],
            "title" => $row["title"],
            "image" => $row["image"],
            "content" => $row["content"],
            "status" => $row["status"],
        ];
    }
    mysqli_stmt_close($fetchStmt);

    echo json_encode([
        "success" => true,
        "message" => "Draft deleted successfully",
        "data" => $drafts
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
?>
