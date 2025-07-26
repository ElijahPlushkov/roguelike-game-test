<?php

require_once __DIR__ . "/../views/header.php";
?>


<body>
<section id="players-info">
    <h4>displays player's info (reputation, health, mana, etc)</h4>
</section>

<section class="map-display">
    <div id="game" class="tile-grid"></div>
</section>


<section id="adventure-log">
    <h4>Adventure log</h4>
    <div id="dialogueWindow">
        <p id="description"></p>
        <div id="options">

        </div>
    </div>
</section>


<br>
<br>
<button onclick="clearStorage()" id="clear-storage"></button>

<script src="/roguelike-game/public/assets/map-handler.js"></script>
</body>
</html>