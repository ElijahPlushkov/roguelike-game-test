//constants
let map = [];
let player = { x: 0, y: 0 };

let levelData = {};

let dialogueData = {};
let stateKey = "";

let eventData = {};

let itemData = {};

let enemyData = {};

let eventActive = false;
const adventureLog = document.querySelector(".adventure-log");

//load data
function loadLevelData() {
    fetch("/roguelike-game/load-level")
        .then(response => response.json())
        .then(level => {
            map = level.tilemap;
            player = level.player;
            levelData = level;
            render();
        })
        .catch(err => {
            console.error("Failed to load level:", err);
        });
}

function loadDialogueData() {
    const slug = "chapter_1_dialogues";
    fetch(`/roguelike-game/load-script?slug=${encodeURIComponent(slug)}`)
        .then(response => response.json())
        .then(dialogues => {
            dialogueData = dialogues;
        })
        .catch(err => {
            console.error("Failed to load script:", err);
        });
}

function loadEventData() {
    const slug = "chapter_1_events";
    fetch(`/roguelike-game/load-script?slug=${encodeURIComponent(slug)}`)
        .then(response => response.json())
        .then(events => {
            eventData = events;
        })
        .catch(err => {
            console.error("Failed to load script:", err);
        });
}

function loadItemData() {
    const slug = "chapter_1_items";
    fetch(`/roguelike-game/load-script?slug=${encodeURIComponent(slug)}`)
        .then(response => response.json())
        .then(items => {
            itemData = items;
        })
        .catch(err => {
            console.error("Failed to load script:", err);
        });
}

function loadEnemyData() {
    const slug = "chapter_1_enemies";
    fetch(`/roguelike-game/load-script?slug=${encodeURIComponent(slug)}`)
        .then(response => response.json())
        .then(enemies => {
            enemyData = enemies;
        })
        .catch(err => {
            console.error("Failed to load script:", err);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadLevelData();
    loadDialogueData();
    loadEventData();
    loadItemData();
    loadEnemyData();

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

            checkForAnyEvent(player.x, player.y);

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

function checkForAnyEvent(x, y) {

    const allEvents = [
        ...(levelData.layers.events || []),
        ...(levelData.layers.dialogues || [])
    ]

    const newEvent = allEvents.find(event => event.x === x && event.y === y);

    if (newEvent) {
        if (newEvent.type === "event") {
            const eventSlug = newEvent.slug;
            if (!hasSeenEvent(eventSlug)) {
                eventActive = true;
                initEvent(eventSlug);
                markEventSeen(eventSlug);
            }
        }

        if (newEvent.type === "dialogue") {
            const dialogueSlug = newEvent.slug;
            if (!hasSeenEvent(dialogueSlug)) {
                eventActive = true;
                initDialogue(dialogueSlug, stateKey);
                markEventSeen(dialogueSlug);
            }
        }
    }
}

function initEvent(eventSlug) {

    const event = eventData.events.find(event => event.slug === eventSlug);

    const newEvent = document.createElement("div");
    newEvent.className = "adventure-log__new-event";
    newEvent.textContent = event.event;
    adventureLog.prepend(newEvent);

    const continueButton = document.createElement("button");
    continueButton.textContent = "Continue";
    continueButton.className = "dialogue-button";
    newEvent.appendChild(continueButton);
    continueButton.addEventListener("click", ()=> {
        endEvent();
        newEvent.removeChild(continueButton);
    });
}

function initDialogue(dialogueSlug, stateKey) {

    const dialogue = dialogueData.dialogues.find(dialogue => dialogue.slug === dialogueSlug);
    const currentStateKey = stateKey || dialogue.start || "greetings";
    const currentState = dialogue[currentStateKey];

    if (!currentState) {
        console.error(`State "${currentStateKey}" not found in dialogue "${dialogueSlug}"`);
        return;
    }
    console.log(currentState);

    const description = document.createElement("p");
    description.textContent = currentState.description;
    description.className = "dialogue-color";

    adventureLog.prepend(description);

    const options = document.createElement("div");
    description.append(options);
    options.innerHTML = '';

    if (currentState.options && currentState.options.length > 0) {
        currentState.options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option.label;
            button.className = 'dialogue-button';

            button.addEventListener("click", () => {
                const nextStateKey = currentState.outcomes?.[option.key];
                if (nextStateKey) {
                    options.innerHTML = '';
                    initDialogue(dialogueSlug, nextStateKey);
                }
            });
            options.appendChild(button);
        });
    } else {
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