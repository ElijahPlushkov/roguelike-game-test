<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = htmlspecialchars($_POST["username"]);
    $password = htmlspecialchars($_POST["password"]);

    include __DIR__ . "/../../core/Dbh.php";
    include __DIR__ . "/../models/signup.model.php";
    include __DIR__ . "/../controllers/signup.controller.php";

    $register = new SignupController($username, $password);

    //validate and register
    $register->validateUserInput();

    //get user's id to create a profile when signing up
    $id = $register->fetchUserId($username);

    include __DIR__ . "/../models/user-profile.model.php";
    include __DIR__ . "/../controllers/user-profile.controller.php";

    $profileInfo = new ProfileController($id, $username);
    $profileInfo->defaultProfileInfo();

    header("location: " . BASE_PATH . "/main-menu");
    exit();
}