<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    include __DIR__ . "/../../core/Dbh.php";
    include __DIR__ . "/../models/login.model.php";
    include __DIR__ . "/../controllers/login.controller.php";

    $login = new LoginController($username, $password);

    //validate and login
    $login->loginUser();
}

header("Location: " . BASE_PATH . "/main-menu");
exit();