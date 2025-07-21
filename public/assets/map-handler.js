let map = [];
let player = { x: 0, y: 0 };
let dialogueData = {};
let currentState = "greetings";
let eventActive = false;

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

        const adventureLog = document.getElementById("adventure-log");

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
                player.x = player.x - dx;
                player.y = player.y - dy;
                const newLogEntry = document.createElement("p");
                newLogEntry.textContent = "you can't walk here";
                adventureLog.appendChild(newLogEntry);
            }
            if (map[newY][newX] === "N") {
                const slug = "spider_talk_1";
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
    // const tileTypes = {
    //     "T": { "type": "tree", "walkable": false },
    //     "#": { "type": "wall", "walkable": false },
    //     ".": { "type": "floor", "walkable": true },
    //     "E": { "type": "enemy", "walkable": true },
    //     "D": { "type": "door", "walkable": true },
    //     "N": { "type": "npc", "walkable": true },
    //     "o": { "type": "item", "walkable": true }
    // };

    let output = "";

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (x === player.x && y === player.y) {
                output += "@";
            }
            else if (map[y][x] === "#") {
                output += "#";
            }
            else if (map[y][x] === ".") {
                output += ".";
            }
            else if (map[y][x] === "T") {
                output += "T";
            }
            else if (map[y][x] === "N") {
                output += "N";
            }
            else if (map[y][x] === "o") {
                output += "o";
            }
            else if (map[y][x] === "D") {
                output += "D";
            }
            else if (map[y][x] === "E") {
                output += "E";
            }
        }
        output += "\n";
    }

    document.getElementById("game").textContent = output;
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