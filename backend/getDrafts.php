<?php
include_once("./header.php");
include("./Database.php");
include_once("./AppError.php");
include_once("./GlobalErrorHandler.php");

try {
    if (!isset($_SESSION["user_id"])) {
        throw new AppError("Unauthorized: Please log in first.", 401);
    }

    $userId = $_SESSION["user_id"];

    $query = "SELECT id, title, image, content, status 
              FROM drafts 
              WHERE user_id = ? 
              ORDER BY id DESC";

    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    mysqli_stmt_close($stmt);

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

    $response = ["success" => true, "data" => $drafts];
    echo json_encode($response);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
?>
