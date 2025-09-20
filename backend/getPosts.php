<?php
include_once("./header.php");
include("./Database.php");
include_once("./AppError.php");
include_once("./GlobalErrorHandler.php");

try {
    $query = "SELECT id, title, image, content FROM posts ORDER BY id DESC";
    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    mysqli_stmt_close($stmt);

    $posts = array();

    while($row = mysqli_fetch_assoc($result)){
        $posts[] = array(
            "id" => $row["id"],
            "title" => $row["title"],
            "image" => $row["image"],
            "content" => $row["content"],
        );
    }

    $response = ["success" => true, "data" => $posts];
    echo json_encode($response);

} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
