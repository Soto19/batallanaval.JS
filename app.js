const board = document.querySelector("#board");
const boardAttack = document.querySelector("#boardAttack");
const position = document.querySelectorAll(".position");

let matrix = [];
let matrixAttack = [];

const sizeShip = [5, 4, 3, 2];
const positionArray = ["horizontal", "vertical"]

let quantityShip = [1, 1, 1, 2];
let quantityShipPC = [1, 1, 1, 2];
let ship = {};
let shipRandom = {}; 

//Función para creación de tableros
function createMatrix(boardType, matrixType, func, type) {
    for (let i = 0; i < 10; i++) {
        let list = []
        let row = document.createElement("div");
        boardType.appendChild(row);
        row.className = "myRow"
        for (let j = 0; j < 10; j++) {
            let grid = document.createElement("div");
            row.appendChild(grid);
            grid.className = "grid";
            grid.id = i + "," + j + "," + type;
            grid.addEventListener("click", func);
            list.push("");
        }
        matrixType.push(list)
    }
}

//Función para seleccionar el barco
function selectShip(event) {
    shipData = event.target.className.split(" ");
    ship.position = shipData[0];
    ship.size = sizeShip[shipData[1]];
    ship.quantity = quantityShip[shipData[1]];
    ship.id = shipData[1];
} 

//Creación de tablero del jugador
createMatrix(board, matrix, selectPosition, "player");
//Creación de barcos
for (let i = 0; i < position.length; i++) {
    let horizontal = document.createElement("button");
    horizontal.innerHTML = "Horizontal";
    position[i].appendChild(horizontal);
    horizontal.className = "horizontal " + i;
    horizontal.addEventListener("click", selectShip)
    let vertical = document.createElement("button");
    vertical.innerHTML = "Vertical";
    position[i].appendChild(vertical);
    vertical.className = "vertical " + i;
    vertical.addEventListener("click", selectShip)
}

//Función para seleccionar la posición de los barcos
function selectPosition(event) {
    if (ship.quantity > 0) {
        let grid = event.target
        let gridID = grid.id.split(",");
        let x = parseInt(gridID[0]);
        let y = parseInt(gridID[1]);
        if (ship.position === "horizontal") {
            if ((y + (ship.size - 1)) < 10) {
                for (let i = y; i < (y + ship.size); i++) {
                    matrix[x][i] = "ship";
                    document.getElementById(x + "," + i + "," + "player").className += " selected";
                }
                quantityShip[ship.id] -= 1;
                ship = {}
            }
            else {
                alert("Selecciona una posición válida");
            }
        }
        else if (ship.position === "vertical") {
            if ((x + (ship.size - 1)) < 10) {
                for (let i = x; i < (x + ship.size); i++) {
                    matrix[i][y] = "ship";
                    document.getElementById(i + "," + y + "," + "player").className += " selected";
                }
                quantityShip[ship.id] -= 1;
                ship = {}
            }
            else {
                alert("Selecciona una posición válida");
            }
        }
    }
    else {
        alert("Debes seleccionar un barco disponible");
    }
}


//Función para el botón para iniciar juego
function startGame() {
    createMatrix(boardAttack, matrixAttack, checkShot, "pc");
    selectPositionRandom()
    document.querySelector("#button").disabled = true;
}
//Generar la posición random de los barcos
function selectPositionRandom() {
    for (let i = 0; i < quantityShipPC.length; i++) {
        while (quantityShipPC[i] > 0) {
            random(i);
            quantityShipPC[i] -= 1;
        }
    }
}


//Verificación de posición válida
function checkPosition(pos, axis, size) {
    if (shipRandom.position === pos) {
        if ((axis + (size - 1)) < 10) {
            return true;
        }
        else {
            return false;
        }
    }
}

//Función para crear barco random
function random(i) {
    shipRandom.position = positionArray[Math.floor(Math.random() * Math.floor(positionArray.length))];
    shipRandom.x = Math.floor(Math.random() * Math.floor(10));
    shipRandom.y = Math.floor(Math.random() * Math.floor(10));
    if (checkPosition("horizontal", shipRandom.y, sizeShip[i])) {
        for (let j = shipRandom.y; j < (shipRandom.y + sizeShip[i]); j++) {
            if (matrixAttack[shipRandom.x][j] === "ship") {
                return random(i)
            }
        }
        for (let j = shipRandom.y; j < (shipRandom.y + sizeShip[i]); j++) {
            matrixAttack[shipRandom.x][j] = "ship";
        }
    }
    else if (checkPosition("vertical", shipRandom.x, sizeShip[i])) {
        for (let j = shipRandom.x; j < (shipRandom.x + sizeShip[i]); j++) {
            if (matrixAttack[j][shipRandom.y] === "ship") {
                return random(i)
            }
        }
        for (let j = shipRandom.x; j < (shipRandom.x + sizeShip[i]); j++) {
            matrixAttack[j][shipRandom.y] = "ship";
        }
    }
    else {
        return random(i)
    }
}

//Verificar tiro del jugador
function checkShot(event) {
    let grid = event.target
    let gridID = grid.id.split(",");
    let x = parseInt(gridID[0]);
    let y = parseInt(gridID[1]);
    if (matrixAttack[x][y] === "ship") {
        setTimeout(() => {
            checkWinner(matrixAttack, "player")
        }, 2000);
        swal({
            title: "¡Acertaste!",
            text: "Diste en el blanco. Vuelve a jugar",
            timer: 2000,
            button: null
        });
        matrixAttack[x][y] = "hit";
        document.getElementById(x + "," + y + "," + "pc").className += " hit";
        checkWinner(matrixAttack, "player")
    }
    else {
        swal({
            title: "¡Fallaste!",
            text: "Tu disparo cayo al agua",
            timer: 2000,
            button: null
        });
        matrixAttack[x][y] = "miss";
        document.getElementById(x + "," + y + "," + "pc").className += " miss";
        setTimeout(() => {
            shotPc()
        }, 2500);
    }
}

//Jugada del PC
function shotPc() {
    let x = Math.floor(Math.random() * Math.floor(10));
    let y = Math.floor(Math.random() * Math.floor(10));
    if (matrix[x][y] === "ship") {
        swal({
            title: "¡Acerto PC!",
            text: "Su disparo dio en el blanco",
            timer: 2000,
            button: null

        });
        matrix[x][y] = "hit";
        document.getElementById(x + "," + y + "," + "player").className += " hit";
        checkWinner(matrix, "pc");
        setTimeout(() => {
            return shotPc();
        }, 2000); setTimeout(() => {
            return shotPc();
        }, 2000);
    }
    else if (matrix[x][y] === "hit" || matrix[x][y] === "miss") {
        return shotPc();
    }
    else {
        swal({
            title: "¡Fallo PC!",
            text: "El disparo del cayo al agua",
            timer: 2000,
            button: null
        });
        matrix[x][y] = "miss";
        document.getElementById(x + "," + y + "," + "player").className += " miss";
    }
}

//Funcion para ver el ganador o perderdor del juego
function checkWinner(matrix, player) {
    for (let i = 0; i < 8; i++) {
        let arraychecked = matrix[i].filter((index) => { return index === "ship" })
        if (arraychecked.length > 0) {
            return
        }
    }
    if (player === "pc") {
        swal({
            title: "¡Gano PC!",
            timer: 2000,
            button: null
        });
    }
    else {
        swal({
            title: "¡Ganaste!",
            timer: 2000,
            button: null
        });
    }
}

