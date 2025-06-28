<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    include "Dbh.php";
    include "login.model.php";
    include "login.controller.php";

    $login = new LoginController($username, $password);

    //validate and login
    $login->loginUser();

    header("location: main-menu.php");
    exit();
}
