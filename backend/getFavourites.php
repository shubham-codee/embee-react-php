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

    $query = "
        SELECT f.post_id, p.title
        FROM favourites f
        INNER JOIN posts p ON f.post_id = p.id
        WHERE f.user_id = ?
        ORDER BY f.id DESC
    ";

    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    mysqli_stmt_close($stmt);
    
    $favourites = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $favourites[] = [
            "id" => $row["post_id"],
            "title" => $row["title"],
        ];
    }

    $response = ["success" => true, "data" => $favourites];
    echo json_encode($response);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
