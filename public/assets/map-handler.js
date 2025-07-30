let map = [];
let player = { x: 0, y: 0 };
let scriptData = {};
let currentState = "";
let eventActive = false;
const adventureLog = document.querySelector(".adventure-log");

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
                currentState = "greetings";
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

            if (player.y === 2 && player.x === 2) {
                const slug = "arrival_to_chyceen";
                if (!hasSeenEvent(slug)) {
                    loadScriptData(slug, ()=> {
                        eventActive = true;
                        initEvent();
                        markEventSeen(slug);
                    });
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
            scriptData = script;
            callback();
        })
        .catch(err => {
            console.error("Failed to load script:", err);
        });
}

function initEvent() {
    const event = scriptData.event;
    const newEvent = document.createElement("div");
    newEvent.className = "adventure-log__new-event";
    newEvent.textContent = event;
    adventureLog.prepend(newEvent);

    const continueButton = document.createElement("button");
    continueButton.textContent = "Continue";
    continueButton.className = "dialogue-button";
    newEvent.appendChild(continueButton);
    continueButton.addEventListener("click", () => {
        endEvent();
        newEvent.removeChild(continueButton);
    });
}

function initDialogue() {
    const state = scriptData[currentState];
    const description = document.createElement("p");
    adventureLog.prepend(description);
    description.textContent = state.description;
    description.className = "dialogue-color";

    const options = document.createElement("div");
    description.append(options);
    options.innerHTML = '';

    state.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option.label;
        button.className = 'dialogue-button';
        button.addEventListener("click", () => {
            const nextState = state.outcomes?.[option.key];
            if (nextState) {
                currentState = nextState;
                initDialogue(currentState);
                options.innerHTML = '';
            }
        });
        options.appendChild(button);
    });

    if (!state.options || state.options.length === 0) {
        const continueButton = document.createElement("button");
        continueButton.textContent = "Continue";
        continueButton.className = "dialogue-button";
        options.appendChild(continueButton);
        continueButton.addEventListener("click", () => {
            endEvent();
            options.removeChild(continueButton);
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
    newLogEntry.className = "log-entry";
    newLogEntry.textContent = "-- you can't walk here";
    adventureLog.prepend(newLogEntry);
}