<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Game Main Menu</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
<header>
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
</header>

<div class="container">
    <h2>Register</h2>
    <form action="register.php" method="POST" class="auth-form">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit" name="register">Register</button>
    </form>

    <h2>Login</h2>
    <form action="login.php" method="POST" class="auth-form">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit" name="login">Login</button>
    </form>

    <h2>Logout</h2>
    <form action="logout.php" method="POST" class="auth-form">
        <button type="submit" name="logout">Logout</button>
    </form>

    <form action="user-profile.php" method="POST" class="auth-form">
        <button type="submit" name="user-profile">Your Profile</button>
    </form>
</div>
</body>
</html>
