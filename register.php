<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = htmlspecialchars($_POST["username"]);
    $password = htmlspecialchars($_POST["password"]);

    include "Dbh.php";
    include "signup.model.php";
    include "signup.controller.php";

    $register = new SignupController($username, $password);

    //validate and register
    $register->validateUserInput();

    //get user's id to create a profile when signing up
    $id = $register->fetchUserId($username);

    include "user-profile.model.php";
    include "user-profile.controller.php";

    $profileInfo = new ProfileController($id, $username);
    $profileInfo->defaultProfileInfo();

    header("location: main-menu.php");
    exit();
}