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

    if (!isset($_GET["id"], $input["title"], $input["image"], $input["content"], $input["status"])) {
        throw new AppError("title, image, content, and status are required.", 400);
    }

    $id = intval($_GET["id"]);

    if ($id <= 0) {
        throw new AppError("Invalid draft ID.", 400);
    }

    $title = trim($input["title"]);
    $image = trim($input["image"]);
    $content = trim($input["content"]);
    $status = trim($input["status"]); 
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

    $query = "UPDATE drafts SET title = ?, image = ?, content = ?, status = ? WHERE id = ?";
    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "ssssi", $title, $image, $content, $status, $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    $fetchQuery = "SELECT id, title, image, content, status FROM drafts WHERE user_id = ? ORDER BY id DESC";
    $fetchStmt = mysqli_prepare(Database::connect(), $fetchQuery);
    mysqli_stmt_bind_param($fetchStmt, "i", $user_id);
    mysqli_stmt_execute($fetchStmt);
    $result = mysqli_stmt_get_result($fetchStmt);

    $drafts = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $drafts[] = $row;
    }
    mysqli_stmt_close($fetchStmt);

    echo json_encode([
        "success" => true,
        "message" => "Draft updated successfully",
        "data" => $drafts
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
?>
