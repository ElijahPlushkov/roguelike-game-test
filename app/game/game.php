<?php

require_once __DIR__ . "/../views/header.php";
$chapterName = "Chapter 1 Spring Blossom";
?>


<body>

<section class="game-info">

    <div class="players-info">
        <div class="players-info__item">-=HP 100/100=-</div>
        <div class="players-info__item">-=REP 34=-</div>
        <div class="players-info__item">-=GOLD 200=-</div>
        <div class="players-info__item">-=Prayers 3=-</div>
    </div>

    <div class="game-info__divider">||</div>

    <div class="menu">

        <div class="menu__item"><a class="menu__link" href="main-menu">[Menu]</a></div>
        <div class="menu__item">[Save]</div>
        <div class="menu__item">[Load]</div>
        <div class="menu__item">[Settings]</div>
        <div class="menu__item">[Quit]</div>
    </div>

</section>

<section class="level-title">

    <h3 class="level-title__heading">-==|<?php echo $chapterName ?>|==-</h3>

</section>

<section class="map-display">
    <div id="game" class="tile-grid"></div>
</section>


<section class="adventure-log-container">
    <div class="adventure-log__divider">< ==**====-*-====-*-====-*-====-*-====-*-====-*-====-*-====-*-====-*-====-*-====-*-====**== ></div>

    <div class="adventure-log">


    </div>

    <div class="adventure-log__divider">< ==**====-*-====-*-====-*-====-*-====-*-====-*-====-*-====-*-====-*-====-*-====-*-====**== ></div>
</section>


<br>
<br>
<button onclick="clearStorage()" id="clear-storage"></button>

<script src="/roguelike-game/public/assets/map-handler.js"></script>
</body>
</html>