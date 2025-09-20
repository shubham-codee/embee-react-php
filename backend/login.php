<?php
include_once("./header.php");
include("./Database.php");
include_once("./AppError.php");
include_once("./GlobalErrorHandler.php");

try {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input["email"], $input["password"])) {
        throw new AppError("Email and password are required.", 400);
    }

    $email = trim($input["email"]);
    $password = $input["password"];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new AppError("Invalid email format.", 400);
    }

    if (empty($password)) {
        throw new AppError("Password cannot be empty.", 400);
    }

    $query = "SELECT id, username, email, password FROM users WHERE email = ?";
    $stmt = mysqli_prepare(Database::connect(), $query);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($result);

    if (!$user) {
        throw new AppError("No user found with this email.", 404);
    }

    if (!password_verify($password, $user["password"])) {
        throw new AppError("Incorrect password.", 401);
    }

    $_SESSION["user_id"] = $user["id"];

    echo json_encode([
        "success" => true,
        "message" => "Login successful.",
        "data" => [
            "id" => $user["id"],
            "username" => $user["username"],
            "email" => $user["email"]
        ]
    ]);
} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
