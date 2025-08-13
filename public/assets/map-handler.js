//constants
let map = [];
let player = {x: 0, y: 0};
let tileSet = {};

let levelData = {};

let dialogueData = {};
let stateKey = "";

let eventData = {};

let itemData = {};

let enemyData = {};

let eventActive = false;
const adventureLog = document.querySelector(".adventure-log");

const playerCharacteristics = {
    reputation: 1,
    might: 2,
    prayer: 0,
};

const displayReputation = document.querySelector(".reputation-characteristic-count");
displayReputation.textContent = playerCharacteristics.reputation;

const displayMight = document.querySelector(".might-characteristic-count");
displayMight.textContent = playerCharacteristics.might;

const displayPrayer = document.querySelector(".prayer-characteristic-count");
displayPrayer.textContent = playerCharacteristics.prayer;

//load data
function loadLevelData() {
    fetch("/roguelike-game/load-level")
        .then(response => response.json())
        .then(level => {
            levelData = level;
            map = level.tilemap;
            player = level.player;
            tileSet = level.tileset;
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
            case "w":
                dy = -1;
                break;
            case "s":
                dy = 1;
                break;
            case "a":
                dx = -1;
                break;
            case "d":
                dx = 1;
                break;
            default:
                return;
        }

        const newX = player.x + dx;
        const newY = player.y + dy;

        if (map[newY][newX]) {
            player.x = newX;
            player.y = newY;

            isWalkable(player.x, player.y, dx, dy);
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
                    case "=":
                        tile.classList.add("wooden-wall");
                        tile.textContent = "=";
                        break;
                    case "α":
                        tile.classList.add("boulder");
                        tile.textContent = "α";
                        break;
                    case ".":
                        tile.classList.add("floor");
                        tile.textContent = ".";
                        break;
                    case "□":
                        tile.classList.add("cobble");
                        tile.textContent = "□";
                        break;
                    case "T":
                        tile.classList.add("tree");
                        tile.textContent = "T";
                        break;
                    case "N":
                        tile.classList.add("npc");
                        tile.textContent = "N";
                        break;
                    case "E":
                        tile.classList.add("enemy");
                        tile.textContent = "E";
                        break;
                    case "Ω":
                        tile.classList.add("item");
                        tile.textContent = "Ω";
                        break;
                    case "П":
                        tile.classList.add("door");
                        tile.textContent = "П";
                        break;
                    case "Θ":
                        tile.classList.add("altar");
                        tile.textContent = "Θ";
                        break;
                    case "t":
                        tile.classList.add("short-tree");
                        tile.textContent = "t";
                        break;
                    case "*":
                        tile.classList.add("pine-tree");
                        tile.textContent = "*";
                        break;
                    case "▲":
                        tile.classList.add("mountain");
                        tile.textContent = "▲";
                        break;
                    case "≈":
                        tile.classList.add("water");
                        tile.textContent = "≈";
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
        ...(levelData.layers.dialogues || []),
        ...(levelData.layers.enemies || [])
    ]

    const newEvent = allEvents.find(event => event.x === x && event.y === y);

    console.log(newEvent);

    if (newEvent) {

        if (!characteristicCheck(newEvent)) {
            return;
        }

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

        if (newEvent.type === "enemy") {
            const enemySlug = newEvent.slug;
            if (!hasSeenEvent(enemySlug)) {
                eventActive = true;
                initCombat(enemySlug);
                markEventSeen(enemySlug);
            }
        }

    }
}

function initCombat(enemySlug) {

    const enemy = enemyData.enemies.find(enemy => enemy.slug === enemySlug);

    const enemyChars = enemy.characteristics;
    const enemyFleeRequirements = enemy.flee;

    const newCombat = document.createElement("div");
    newCombat.className = "adventure-log__new-combat";
    newCombat.textContent = enemy.description;
    adventureLog.prepend(newCombat);

    const options = document.createElement("div");
    newCombat.append(options);
    options.innerHTML = '';

    enemy.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option.label;
        button.className = 'dialogue-button';
        options.appendChild(button);

        button.addEventListener("click", ()=> {
            if (button.textContent === "fight") {
                if (playerCharacteristics.might < enemyChars.might) {
                    newCombat.textContent = enemy.combatDefeat;
                } else {
                    newCombat.textContent = enemy.combatVictory;
                }
                const continueButton = document.createElement("button");
                continueButton.textContent = "Continue";
                continueButton.className = "dialogue-button";
                newCombat.appendChild(continueButton);
                continueButton.addEventListener("click", () => {
                    endEvent();
                    newCombat.removeChild(continueButton);
                });
            }

            if (button.textContent === "negotiate") {
                if (playerCharacteristics.reputation < enemyChars.reputation) {
                    newCombat.textContent = enemy.negotiationDefeat;
                } else {
                    newCombat.textContent = enemy.negotiationVictory;
                }
                const continueButton = document.createElement("button");
                continueButton.textContent = "Continue";
                continueButton.className = "dialogue-button";
                newCombat.appendChild(continueButton);
                continueButton.addEventListener("click", () => {
                    endEvent();
                    newCombat.removeChild(continueButton);
                });
            }

            if (button.textContent === "flee") {
                if (enemy.difficulty === "weak" || enemy.difficulty === "average") {
                    newCombat.textContent = enemy.fleeSuccess;
                } else {
                    if (playerCharacteristics.might < enemyFleeRequirements.might ||
                        playerCharacteristics.prayer < enemyFleeRequirements.prayer) {
                        newCombat.textContent = enemy.fleeFailure;
                    } else {
                        newCombat.textContent = enemy.fleeSuccess;
                    }
                }
                const continueButton = document.createElement("button");
                continueButton.textContent = "Continue";
                continueButton.className = "dialogue-button";
                newCombat.appendChild(continueButton);
                continueButton.addEventListener("click", () => {
                    endEvent();
                    newCombat.removeChild(continueButton);
                });
            }
        });
    });
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
    continueButton.addEventListener("click", () => {
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

                const optionData = option;

                if (optionData.requirements) {
                    let canProceed = true;

                    for (const [charKey, requiredValue] of Object.entries(optionData.requirements)) {
                        if ((playerCharacteristics[charKey] || 0) < requiredValue) {
                            canProceed = false;
                            const rejection = document.createElement("div");
                            rejection.textContent = optionData.rejection || "You cannot do this.";
                            adventureLog.prepend(rejection);
                            break;
                        }
                    }
                    if (!canProceed) {
                        return;
                    }
                }

                const nextStateKey = currentState.outcomes?.[option.key];
                if (nextStateKey) {
                    options.innerHTML = '';
                    initDialogue(dialogueSlug, nextStateKey);
                }
            });
            options.appendChild(button);
        });
    } else {

        const finalState = dialogue[stateKey];

        dialogue.finalOutcome = {
            description: finalState.description,
            characteristics: finalState.characteristics
        }

        const dialogueOutcome = dialogue.finalOutcome.characteristics;

        registerDialogueOutcome(dialogueOutcome);

        const continueButton = document.createElement("button");
        continueButton.textContent = "Continue";
        continueButton.className = "dialogue-button";
        options.appendChild(continueButton);
        continueButton.addEventListener("click", () => {
            endEvent();
            options.removeChild(continueButton);
            console.log("Final outcome registered:", dialogue.finalOutcome);
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

function isWalkable(x, y, dx, dy) {
    const tileType = map[y][x];

    const currentTile = tileSet[tileType];

    if (currentTile.walkable === false) {
        player.x = player.x - dx;
        player.y = player.y - dy;
        const newLogEntry = document.createElement("p");
        newLogEntry.className = "log-entry";
        newLogEntry.textContent = "-- you can't walk here";
        adventureLog.prepend(newLogEntry);
    }
}

function registerDialogueOutcome(dialogueOutcome) {
    for (const [key, value] of Object.entries(dialogueOutcome)) {
        playerCharacteristics[key] += value;

        const displayCharacteristic = document.querySelector(`.${key}-characteristic-count`);
        if (displayCharacteristic) {
            displayCharacteristic.textContent = playerCharacteristics[key];
        } else {
            console.warn(`Missing DOM element for: .${key}-characteristic-count`);
        }
    }
}

function characteristicCheck(newEvent) {

    if (newEvent.type === "dialogue") {
        const dialogueSlug = newEvent.slug;
        const dialogue = dialogueData.dialogues.find(dialogue => dialogue.slug === dialogueSlug);

        if (!dialogue.requirements) {
            return true;
        } else {

            const requirements = dialogue.requirements;

            for (const [key, value] of Object.entries(requirements)) {
                if (playerCharacteristics[key] < value) {
                    const rejection = document.createElement("div");
                    rejection.textContent = dialogue.rejection;
                    adventureLog.prepend(rejection);
                    return false;
                }
            }
        }

    }
    return true;
}