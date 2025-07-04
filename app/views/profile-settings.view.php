<?php

require_once __DIR__ . "/../views/header.php";

?>

<body>
<div class="container">
    <h2>Edit Profile</h2>

    <form action="user-profile" method="POST" class="auth-form">
        <div>
            <p><strong>Username:</strong> <?php echo htmlspecialchars($_SESSION["username"]); ?></p>
        </div>

        <label for="about">About:</label>
        <textarea id="about" name="about"><?php echo htmlspecialchars($about); ?></textarea>

        <div class="button-group">
            <button type="submit" name="save-changes">Save Changes</button>
            <button type="button">Cancel</button>
        </div>
    </form>
</div>
</body>
</html>