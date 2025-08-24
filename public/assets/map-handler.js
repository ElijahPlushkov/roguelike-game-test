//constants
let map = [];
let player = {x: 0, y: 0};
let tileSet = {};

let levelData = {};

let dialogueData = {};
let stateKey = "";

let eventData = {};

let doorData = {};

let itemData = {};

let enemyData = {};

let eventActive = false;
const adventureLog = document.querySelector(".adventure-log");

const playerCharacteristics = {
    reputation: 0,
    might: 2,
    prayer: 0,
};

let pollen = 0;

const displayReputation = document.querySelector(".reputation-characteristic-count");
displayReputation.textContent = playerCharacteristics.reputation;

const displayMight = document.querySelector(".might-characteristic-count");
displayMight.textContent = playerCharacteristics.might;

const displayPrayer = document.querySelector(".prayer-characteristic-count");
displayPrayer.textContent = playerCharacteristics.prayer;

const displayPollen = document.querySelector(".pollen-quantity-count");
displayPollen.textContent = pollen;

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

function loadDoorData() {
    const slug = "chapter_1_doors";
    fetch(`/roguelike-game/load-script?slug=${encodeURIComponent(slug)}`)
        .then(response => response.json())
        .then(doors => {
            doorData = doors;
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
    loadDoorData();
    loadItemData();
    loadEnemyData();

    //movement
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

        if (isWalkable(newX, newY)) {
            player.x = newX;
            player.y = newY;
        }

        checkForAnyEvent(player.x, player.y);

        render();

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
        // ...(levelData.layers.doors || []),
        ...(levelData.layers.dialogues || []),
        ...(levelData.layers.enemies || []),
        ...(levelData.layers.items || [])
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

        // if (newEvent.type === "door") {
        //     const eventSlug = newEvent.slug;
        //     if (!hasSeenEvent(eventSlug)) {
        //         eventActive = true;
        //         markEventSeen(eventSlug);
        //     }
        // }

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

function isWalkable(x, y) {
    const tileType = map[y][x];

    const currentTile = tileSet[tileType];

    if (currentTile.walkable === false) {
        const newLogEntry = document.createElement("p");
        newLogEntry.className = "log-entry";
        newLogEntry.textContent = "-you can't walk here";
        adventureLog.prepend(newLogEntry);
        return false;
    }
    if (currentTile.type === "door") {
        return accessDoor(x, y);
    }
    return true;
}

function accessDoor(x, y) {
    const doors = [...(levelData.layers.doors) || []];

    const doorTile = doors.find(doorTile => doorTile.x === x && doorTile.y === y);

    console.log(doorTile);

    if (!doorTile) {
        return true;
    }

    if (doorTile.slug) {
        const doorSlug = doorTile.slug;

        const door = doorData.doors.find(door => door.slug === doorSlug);

        if (door) {
            for (const [charKey, requiredValue] of Object.entries(door.requirements)) {
                if ((playerCharacteristics[charKey] || 0) < requiredValue) {
                    doorTile.type = "unwalkable";
                    const rejection = document.createElement("div");
                    rejection.textContent = door.rejection || "You are not worthy to enter";
                    adventureLog.prepend(rejection);
                    return false;
                }
            }
        }
        if (!hasSeenEvent(doorSlug)) {
            const newEvent = document.createElement("div");
            const eventType = newEvent;
            newEvent.className = "adventure-log__new-event";
            newEvent.textContent = door.description;
            adventureLog.prepend(newEvent);

            const reward = door.reward;
            registerEventOutcome(reward);

            appendContinueButton(eventType);
            markEventSeen(doorSlug);
        }
        return true;
    }
}

function initCombat(enemySlug) {

    const enemy = enemyData.enemies.find(enemy => enemy.slug === enemySlug);

    const enemyChars = enemy.characteristics;
    const enemyFleeRequirements = enemy.flee;
    const enemyDifficulty = enemy.difficulty;
    let isSuccessful;

    const newCombat = document.createElement("div");
    const eventType = newCombat;
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
                    isSuccessful = false;
                    newCombat.textContent = enemy.combatDefeat + " " + resolveCombat(enemyDifficulty, isSuccessful, pollen);

                } else {
                    isSuccessful = true;
                    newCombat.textContent = enemy.combatVictory + " " + resolveCombat(enemyDifficulty, isSuccessful, pollen);

                }
                appendContinueButton(eventType);
            }

            if (button.textContent === "negotiate") {
                if (playerCharacteristics.reputation < enemyChars.reputation) {
                    isSuccessful = false;
                    newCombat.textContent = enemy.negotiationDefeat + " " + resolveCombat(enemyDifficulty, isSuccessful, pollen);
                } else {
                    isSuccessful = true;
                    newCombat.textContent = enemy.negotiationVictory + " " + resolveCombat(enemyDifficulty, isSuccessful, pollen);
                }
                appendContinueButton(eventType);
            }

            if (button.textContent === "flee") {
                if (enemyDifficulty === "weak" || enemyDifficulty === "average") {
                    isSuccessful = false;
                    newCombat.textContent = enemy.fleeSuccess + " " + resolveCombat(enemyDifficulty, isSuccessful, pollen);
                } else {
                    if (playerCharacteristics.might < enemyFleeRequirements.might ||
                        playerCharacteristics.prayer < enemyFleeRequirements.prayer) {
                        isSuccessful = false;
                        newCombat.textContent = enemy.fleeFailure + " " + resolveCombat(enemyDifficulty, isSuccessful, pollen);
                    } else if (enemyDifficulty === "boss") {
                        isSuccessful = false;
                        newCombat.textContent = enemy.fleeFailure + " " + resolveCombat(enemyDifficulty, isSuccessful, pollen);
                    } else {
                        isSuccessful = false;
                        newCombat.textContent = enemy.fleeSuccess + " " + resolveCombat(enemyDifficulty, isSuccessful, pollen);
                    }
                }
                appendContinueButton(eventType);
            }
        });
    });
}

function appendContinueButton(eventType) {
    const newEvent = eventType;

    const continueButton = document.createElement("button");
    continueButton.textContent = "Continue";
    continueButton.className = "dialogue-button";
    newEvent.appendChild(continueButton);
    continueButton.addEventListener("click", () => {
        endEvent();
        newEvent.removeChild(continueButton);
    });
}

function resolveCombat(enemyDifficulty, isSuccessful) {

    let increase;
    let decrease;
    let pollenChange;

    const characteristics = Object.keys(playerCharacteristics);
    const charKey = characteristics[Math.floor(Math.random() * characteristics.length)];

    const displayCharacteristic = document.querySelector(`.${charKey}-characteristic-count`);

    if (enemyDifficulty === "weak") {
        increase = 1;
        decrease = -1;
        pollenChange = Math.floor(Math.random() * 10) + 1;
    } else if (enemyDifficulty === "average") {
        increase = 2;
        decrease = -2;
        pollenChange = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    } else if (enemyDifficulty === "tough") {
        increase = 3;
        decrease = -4;
        pollenChange = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
    } else if (enemyDifficulty === "master") {
        increase = 4;
        decrease = -6;
        pollenChange = Math.floor(Math.random() * (60 - 40 + 1)) + 40;
    } else if (enemyDifficulty === "boss") {
        increase = 5;
        decrease = -8;
        pollenChange = Math.floor(Math.random() * (80 - 60 + 1)) + 60;
    }

    if (isSuccessful === false) {
        playerCharacteristics[charKey] += decrease;
        displayCharacteristic.textContent = playerCharacteristics[charKey];
        displayPollen.textContent = pollen -= pollenChange;
        return `Your ${charKey} decreased by ${Math.abs(decrease)}. You lose ${pollenChange} pollen grains`;
    } else {
        playerCharacteristics[charKey] += increase;
        displayCharacteristic.textContent = playerCharacteristics[charKey];
        displayPollen.textContent = pollen += pollenChange;
        return `Your ${charKey} increased by ${increase}. You collect ${pollenChange} pollen grains`;
    }
}

function initEvent(eventSlug) {

    const event = eventData.events.find(event => event.slug === eventSlug);

    if (event.requirements) {
        let canProceed = true;

        for (const [charKey, requiredValue] of Object.entries(event.requirements)) {
            if ((playerCharacteristics[charKey] || 0) < requiredValue) {
                canProceed = false;
                const rejection = document.createElement("div");
                rejection.textContent = event.rejection || "You are not worthy to witness";
                adventureLog.prepend(rejection);
                break;
            }
        }
        if (!canProceed) {
            return;
        }
    }

    const newEvent = document.createElement("div");
    const eventType = newEvent;
    newEvent.className = "adventure-log__new-event";
    newEvent.textContent = event.event;
    adventureLog.prepend(newEvent);

    appendContinueButton(eventType);

    const reward = event.reward;
    registerEventOutcome(reward);
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

                const nextStateKey = option.key;
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

function registerDialogueOutcome(dialogueOutcome) {
    for (const [key, value] of Object.entries(dialogueOutcome)) {
        playerCharacteristics[key] += value;

        const displayCharacteristic = document.querySelector(`.${key}-characteristic-count`);
        if (displayCharacteristic) {
            displayCharacteristic.textContent = playerCharacteristics[key];

            const charChange = document.createElement("p");
            charChange.className = "log-entry";
            charChange.textContent = `Your reward: ${value} ${key}`;
            adventureLog.prepend(charChange);

        } else {
            console.warn(`Missing DOM element for: .${key}-characteristic-count`);
        }
    }
}

function registerEventOutcome(reward) {

    for (const [key, value] of Object.entries(reward)) {

        if (key === "pollen") {
            pollen += value;
            displayPollen.textContent = pollen;

            const charChange = document.createElement("p");
            charChange.className = "log-entry";
            charChange.textContent = `Your reward: ${value} ${key} pollen grains`;
            adventureLog.prepend(charChange);
        }

        else {

            playerCharacteristics[key] += value;

            const displayCharacteristic = document.querySelector(`.${key}-characteristic-count`);

            if (displayCharacteristic) {
                displayCharacteristic.textContent = playerCharacteristics[key];

                const charChange = document.createElement("p");
                charChange.className = "log-entry";
                charChange.textContent = `Your reward: ${value} ${key}`;
                adventureLog.prepend(charChange);

            } else {
                console.warn(`Missing DOM element for: .${key}-characteristic-count`);
            }
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
    if (newEvent.type === "event") {
        const eventSlug = newEvent.slug;
        const event = eventData.events.find(event => event.slug === eventSlug);

        if (!event.requirements) {
            return true;
        } else {

            const requirements = event.requirements;

            for (const [key, value] of Object.entries(requirements)) {
                if (playerCharacteristics[key] < value) {
                    const rejection = document.createElement("div");
                    rejection.textContent = event.rejection;
                    adventureLog.prepend(rejection);
                    return false;
                }
            }
        }
    }
    return true;
}