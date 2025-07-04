<?php

require_once __DIR__ . "/../views/header.php";

?>

<body>
<div class="container">
    <h2>Register</h2>
    <form action="register" method="POST" class="auth-form">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit" name="register">Register</button>
    </form>

    <h2>Login</h2>
    <form action="login" method="POST" class="auth-form">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit" name="login">Login</button>
    </form>

    <h2>Logout</h2>
    <form action="logout" method="POST" class="auth-form">
        <button type="submit" name="logout">Logout</button>
    </form>

    <form action="user-profile" method="POST" class="auth-form">
        <button type="submit" name="user-profile">Your Profile</button>
    </form>

    <form action="game" method="POST" class="auth-form">
        <button type="submit" name="game">Play</button>
    </form>
</div>
</body>
</html>
