<?php
include_once("./header.php");

try {
    session_unset();
    session_destroy();

    if (isset($_COOKIE["PHPSESSID"])) {
        setcookie("PHPSESSID", "", time() - 3600, "/");
    }

    echo json_encode([
        "success" => true,
        "message" => "Logged out successfully"
    ]);
} catch (Throwable $th) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Server error: " . $th->getMessage()
    ]);
}
