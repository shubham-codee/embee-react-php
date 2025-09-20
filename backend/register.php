<?php
include_once("./header.php");
include("./Database.php");
include_once("./AppError.php");
include_once("./GlobalErrorHandler.php");

try {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input["username"], $input["email"], $input["password"])) {
        throw new AppError("Username, email, and password are required.", 400);
    }

    $username = trim($input["username"]);
    $email = trim($input["email"]);
    $password = $input["password"];

    if (strlen($username) < 3 || strlen($username) > 20) {
        throw new AppError("Username must be between 3 and 20 characters.", 400);
    }

    if (!preg_match('/^[A-Za-z0-9_]+$/', $username)) {
        throw new AppError("Username can only contain letters, numbers, and underscores.", 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new AppError("Invalid email format.", 400);
    }

    if (strlen($password) < 6) {
        throw new AppError("Password must be at least 6 characters.", 400);
    }

    if (!preg_match('/[A-Z]/', $password)) {
        throw new AppError("Password must include at least one uppercase letter.", 400);
    }

    if (!preg_match('/[0-9]/', $password)) {
        throw new AppError("Password must include at least one number.", 400);
    }

    if (!preg_match('/[\W_]/', $password)) {
        throw new AppError("Password must include at least one symbol.", 400);
    }

    $checkQuery = "SELECT id FROM users WHERE email = ?";
    $stmt = mysqli_prepare(Database::connect(), $checkQuery);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        throw new AppError("User already exists with this email.", 400);
    }

    mysqli_stmt_close($stmt);

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $insertQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare(Database::connect(), $insertQuery);
    mysqli_stmt_bind_param($stmt, "sss", $username, $email, $hashedPassword);
    $result = mysqli_stmt_execute($stmt);

    if (!$result) {
        throw new AppError("Failed to register user.", 500);
    }

    $userId = mysqli_insert_id(Database::connect());
    $_SESSION["user_id"] = $userId;

    echo json_encode([
        "success" => true,
        "message" => "User registered successfully.",
        "data" => [
            "id" => $userId,
            "username" => $username,
            "email" => $email
        ]
    ]);
} catch (Throwable $error) {
    GlobalErrorHandler::handleError($error);
} finally {
    Database::close();
}
