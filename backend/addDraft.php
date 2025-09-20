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

    if (!isset($input["title"], $input["image"], $input["content"], $input["status"])) {
        throw new AppError("Title, image, content, and status are required.", 400);
    }

    $title = trim($input["title"]);
    if (strlen($title) < 5 || strlen($title) > 150) {
        throw new AppError("Title must be between 5 and 150 characters.", 400);
    }

    $image = trim($input["image"]);
    if (!filter_var($image, FILTER_VALIDATE_URL)) {
        throw new AppError("Invalid image URL.", 400);
    }

    $filename = basename(parse_url($image, PHP_URL_PATH));
    if (!preg_match('/^img_[a-z0-9]+\.[0-9]+\.(jpg|jpeg|png)$/i', $filename)) {
        throw new AppError("Invalid image filename format.", 400);
    }

    $content = trim($input["content"]);
    if (strlen($content) < 20) {
        throw new AppError("Content is too short. Please write more.", 400);
    }

    $status = trim($input["status"]);
    if (!in_array($status, ["draft", "published"])) {
        throw new AppError("Invalid status value. Allowed: draft, published.", 400);
    }

    $user_id = $_SESSION["user_id"];

    $query = "INSERT INTO drafts (title, image, content, status, user_id) VALUES (?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "ssssi", $title, $image, $content, $status, $user_id);

    if (!mysqli_stmt_execute($stmt)) {
        throw new AppError("Failed to add draft.", 500);
    }
    mysqli_stmt_close($stmt);

    $fetchQuery = "
        SELECT id, title, image, content, status
        FROM drafts
        WHERE user_id = ?
        ORDER BY id DESC
    ";
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
        "message" => "Draft added successfully.",
        "data" => $drafts
    ]);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
