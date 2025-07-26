let map = [];
let player = { x: 0, y: 0 };
let dialogueData = {};
let currentState = "";
let eventActive = false;
const adventureLog = document.getElementById("adventure-log");

function loadLevel() {
    fetch("/roguelike-game/load-level")
        .then(response => response.json())
        .then(data => {
            map = data.tilemap;
            player = data.player;
            render();
        })
        .catch(err => {
            console.error("Failed to load level:", err);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadLevel();

    document.addEventListener("keydown", (e) => {
        if (eventActive) {
            return;
        }

        let dx = 0, dy = 0;

        switch (e.key) {
            case "ArrowUp": dy = -1; break;
            case "ArrowDown": dy = 1; break;
            case "ArrowLeft": dx = -1; break;
            case "ArrowRight": dx = 1; break;
            default: return;
        }

        const newX = player.x + dx;
        const newY = player.y + dy;

        if (map[newY][newX]) {
            player.x = newX;
            player.y = newY;
            if (map[newY][newX] === "#") {
                blockedPath(dx, dy);
            }
            if (player.y === 2 && player.x === 8) {
                const slug = "spider_talk_1";
                currentState= "greetings";
                if (!hasSeenEvent(slug)) {
                    loadScriptData(slug, ()=> {
                        eventActive = true;
                        initDialogue();
                        markEventSeen(slug);
                    });
                }
                else {
                    console.log("I have nothing more to say");
                }
            }
            render();
        }
    });
});

function render() {

    const gameContainer = document.getElementById("game");
    gameContainer.innerHTML = "";

    for (let y = 0; y < map.length; y++) {
        const row = document.createElement("div");
        row.classList.add("tile-row");

        for (let x = 0; x < map[y].length; x++) {
            const tileType = map[y][x];
            const tile = document.createElement("div");
            tile.classList.add("tile");

            if (x === player.x && y === player.y) {
                tile.classList.add("player");
                tile.textContent = "Ж";
            } else {
                switch (tileType) {
                    case "#":
                        tile.classList.add("wall");
                        tile.textContent = "#";
                        break;
                    case ".":
                        tile.classList.add("floor");
                        tile.textContent = ".";
                        break;
                    case "T":
                        tile.classList.add("tree");
                        tile.textContent = "T";
                        break;
                    case "N":
                        tile.classList.add("npc");
                        break;
                    case "E":
                        tile.classList.add("enemy");
                        break;
                    case "o":
                        tile.classList.add("item");
                        break;
                    case "D":
                        tile.classList.add("door");
                        break;
                    default:
                        tile.classList.add("unknown");
                        break;
                }
            }
            row.appendChild(tile);
        }

        gameContainer.appendChild(row);
    }
}

function loadScriptData(slug, callback) {
    fetch(`/roguelike-game/load-script?slug=${encodeURIComponent(slug)}`)
        .then(response => response.json())
        .then(script => {
            dialogueData = script;
            currentState= "greetings";
            callback();
        })
        .catch(err => {
            console.error("Failed to load script:", err);
        });
}

function initDialogue() {
    const state = dialogueData[currentState];
    document.getElementById('description').textContent = state.description;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    state.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option.label;
        button.className = 'option-button';
        button.addEventListener("click", () => {
            const nextState = state.outcomes?.[option.key];
            if (nextState) {
                currentState = nextState;
                initDialogue(currentState);
            }
        });
        optionsDiv.appendChild(button);
    });

    if (!state.options || state.options.length === 0) {
        const continueButton = document.createElement("button");
        continueButton.textContent = "Continue";
        continueButton.className = "option-button";
        optionsDiv.appendChild(continueButton);
        continueButton.addEventListener("click", () => {
            endEvent();
            optionsDiv.removeChild(continueButton);
        });
    }
}

function endEvent() {
    eventActive = false;
}

function hasSeenEvent(slug) {
    return localStorage.getItem(`event_${slug}`) === "true";
}

function markEventSeen(slug) {
    localStorage.setItem(`event_${slug}`, "true");
}

function clearStorage() {
    localStorage.clear();
}

function blockedPath(dx, dy) {
    player.x = player.x - dx;
    player.y = player.y - dy;
    const newLogEntry = document.createElement("p");
    newLogEntry.textContent = "you can't walk here";
    adventureLog.appendChild(newLogEntry);
}