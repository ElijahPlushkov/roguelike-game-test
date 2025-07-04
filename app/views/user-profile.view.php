<?php

require_once __DIR__ . "/../views/header.php";

?>
<body>
<div class="container">
    <h2>User Profile</h2>

    <div class="profile-section">
        <div class="profile-info">
            <p><strong>Username:</strong> <?php echo htmlspecialchars($_SESSION["username"]); ?></p>
            <p><strong>Description:</strong></p>
            <p class="description"><?php echo htmlspecialchars($about); ?></p>
        </div>

        <div class="stats-section">
            <h3>Statistics</h3>
            <ul class="stats-list">
                <li>Games Played: <span class="stat-value">-</span></li>
                <li>Wins: <span class="stat-value">-</span></li>
                <li>Losses: <span class="stat-value">-</span></li>
                <li>High Score: <span class="stat-value">-</span></li>
            </ul>
        </div>
        <form action="user-profile" method="POST" class="auth-form">
            <button type="submit" name="edit-profile">Edit Profile</button>
        </form>

        <form action="main-menu" method="GET" class="auth-form">
            <button type="submit">Back to Menu</button>
        </form>

    </div>
</div>
</body>
</html>
