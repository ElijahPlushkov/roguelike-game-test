<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Game Main Menu</title>
    <link rel="stylesheet" href="/roguelike-game/public/assets/styles.css">
</head>

<?php
session_start();
echo "<pre>";
print_r($_SESSION);
echo "</pre>";
if (isset($_SESSION["id"])) {
    echo "<p>Welcome, ".htmlspecialchars($_SESSION["username"])."! You are logged in.</p>";
    unset($_SESSION["error"]);
} else {
    echo "<p>You are not logged in</p>";
}
?>
