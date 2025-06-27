<?php
session_start();

include "Dbh.php";
include "user-profile.model.php";
include "user-profile.controller.php";

$id = $_SESSION["id"] ?? null;
$username = $_SESSION["username"] ?? null;

$profileInfo = new ProfileController($id, $username);

//if ($_SERVER["REQUEST_METHOD"] === "POST") {
//    $about = htmlspecialchars($_POST["about"] ?? '');
//}

$profileData = $profileInfo->getCurrentProfile($id);
$about = $profileInfo->displayAbout($id);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Profile</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="container">
    <h2>Edit Profile</h2>

    <form action="user-profile.php" method="post" class="auth-form">
        <div>
            <p><strong>Username:</strong> <?php echo htmlspecialchars($_SESSION["username"]); ?></p>
        </div>

        <label for="about">About:</label>
        <textarea id="about" name="about"><?php echo htmlspecialchars($about); ?></textarea>

        <div class="button-group">
            <button type="submit" name="edit-profile">Save Changes</button>
            <button type="button">Cancel</button>
        </div>
    </form>
</div>
</body>
</html>