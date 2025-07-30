<?php

require_once __DIR__ . "/../views/header.php";

?>

<body>
<div class="menu-container">


    <form action="user-profile" method="POST" class="menu__form">
        <h2>Edit Profile</h2>
        <div>
            <p><strong>Username:</strong> <?php echo htmlspecialchars($_SESSION["username"]); ?></p>
        </div>

        <label for="about">About:</label>
        <textarea id="about" name="about" class="menu__input"><?php echo htmlspecialchars($about); ?></textarea>

        <div class="button-group">
            <button type="submit" name="save-changes" class="menu__button">Save Changes</button>
            <button type="button" class="menu__button">Cancel</button>
        </div>
    </form>
</div>
</body>
</html>