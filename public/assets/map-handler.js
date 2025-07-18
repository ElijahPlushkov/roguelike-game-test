let map = [];
let player = { x: 0, y: 0 };

function loadLevel() {
    fetch("/roguelike-game/load-level")
        .then(response => response.json())
        .then(data => {
            map = data.tilemap;
            console.log(map);
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
                console.log("you can't walk here");
                const newLogEntry = document.createElement("p");
                newLogEntry.textContent = "you can't walk here";
                adventureLog.appendChild(newLogEntry);
            }
            if (map[newY][newX] === "N") {

                initDialogue(currentState);
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

function getDialogueData() {
    return {
        'greetings': {
            'description': 'you see a spider',
            'options': [
                { key: 'talk', label: 'can I help you?' },
                { key: 'fight', label: 'I will fight you' }
            ],
            'outcomes': {
                'fight': 'death',
                'talk': 'talk'
            }
        },
        'death': {
            'description': 'you couldn’t fight the spider, you are now dead',
            'options': []
        },
        'talk': {
            'description': 'you are now friends with the spider',
            'options': []
        }
    };
}

let currentState = 'greetings';

function initDialogue(state) {

    const dialogue = getDialogueData();
    const dialogueState = dialogue[state];
    document.getElementById('description').textContent = dialogueState.description;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    dialogueState.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option.label;
        button.className = 'option-button';
        button.addEventListener("click", ()=> {
            const nextState = dialogueState.outcomes[option.key];
            if (nextState) {
                currentState = nextState;
                initDialogue(currentState);
            }
        });
        optionsDiv.appendChild(button);
    });
}
