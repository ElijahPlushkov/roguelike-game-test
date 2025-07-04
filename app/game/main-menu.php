<?php

require_once __DIR__ . "/../views/header.php";

?>


<body>
<section class="game-name">
    <h2 class="game-name__title">Game's Name</h2>
</section>

<div class="menu-container">
    <?php if (!isset($_SESSION["id"])) : ?>
        <section class="menu__authentication">

            <div class="menu__container">
                <h2>Register</h2>
                <form action="register" method="POST" class="menu__form">
                    <input type="text" name="username" placeholder="Username" required class="menu__input">
                    <input type="password" name="password" placeholder="Password" required class="menu__input">
                    <button type="submit" name="register" class="menu__button">Register</button>
                </form>
            </div>

            <div class="menu__container">
                <h2>Login</h2>
                <form action="login" method="POST" class="menu__form">
                    <input type="text" name="username" placeholder="Username" required class="menu__input">
                    <input type="password" name="password" placeholder="Password" required class="menu__input">
                    <button type="submit" name="login" class="menu__button">Login</button>
                </form>
            </div>

        </section>
    <?php else : ?>
        <section class="menu__container">
            <h2>User Profile</h2>

            <div class="profile-section">
                <div class="profile-info">
                    <p><strong>Username:</strong>
                        username
                    </p>
                    <p><strong>Description:</strong></p>
                    <p class="description">
                        ready for a challenge
                    </p>
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
                <form action="user-profile" method="POST">
                    <button type="submit" name="edit-profile" class="menu__button">Edit Profile</button>
                </form>

<!--                <form action="main-menu" method="GET">-->
<!--                    <button type="submit" class="menu__button">Back to Menu</button>-->
<!--                </form>-->

            </div>
        </section>
    <?php endif; ?>
    <section class="menu__container">

        <?php if (isset($_SESSION["id"])) : ?>
            <div class="menu__button">
                New Game
            </div>

            <div class="menu__button">
                Load Game
            </div>
        <?php endif; ?>
        <div class="menu__button">
            Lore Book
        </div>

        <div class="menu__button">
            Send a Note
        </div>

        <div class="menu__button">
            Controls
        </div>

        <form action="logout" method="POST">
            <button type="submit" class="menu__button">Quit</button>
        </form>

    </section>
</div>

</body>

</html>
