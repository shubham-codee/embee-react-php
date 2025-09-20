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

    $userId = $_SESSION["user_id"];
    $id = intval($_GET["id"]);

    if ($id <= 0) {
        throw new AppError("Invalid draft ID.", 400);
    }

    $query = "SELECT id, title, image, content, status 
              FROM drafts 
              WHERE id = ? AND user_id = ?";

    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "ii", $id, $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $row = mysqli_fetch_assoc($result);
    mysqli_stmt_close($stmt);

    if (!$row) {
        throw new AppError("Draft not found.", 404);
    }

    echo json_encode([
        "success" => true,
        "message" => "Draft fetched successfully.",
        "data" => $row
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
?>
