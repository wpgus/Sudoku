let Origin = Array.from({length: 10}, ()=>Array(10).fill(0));
let board = Array.from({length: 10}, ()=>Array(10).fill(0));
let memo = false;
let posTable = {f:-1, e:-1};
let e = {x:0, y:0};
var mistake = 0;
const difficulty = 40;

function Sudoku() {
    const SIZE = 9;
    const pan = Array.from({ length: SIZE }, () =>
        Array(SIZE).fill(0)
    );
    function isValid(row, col, num) {
        // 행 검사
        for (let x = 0; x < SIZE; x++) {
            if (pan[row][x] === num) return false;
        }

        // 열 검사
        for (let x = 0; x < SIZE; x++) {
            if (pan[x][col] === num) return false;
        }

        // 3x3 박스 검사
        const startRow = row - (row % 3);
        const startCol = col - (col % 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (pan[startRow + i][startCol + j] === num) {
                return false;
                }
            }
        }

        return true;
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function fillBoard(row = 0, col = 0) {
        if (row === 9) return true;
        if (col === 9) return fillBoard(row + 1, 0);

        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const num of numbers) {
            if (isValid(row, col, num)) {
                pan[row][col] = num;
                if (fillBoard(row, col + 1)) return true;
                pan[row][col] = 0;
            }
        }
        return false;
    }

    fillBoard();
    return pan;
}

function reset() {
    const temp = Sudoku();
    for (i = 1; i <= 9; i+=1) {
        for (j = 1; j <= 9; j+=1) {
            Origin[i][j] = temp[i-1][j-1];
        }
    }

    for (i = 1; i <= 9; i+=1) {
        for (j = 1; j <= 9; j+=1) {
            var x = Math.floor(Math.random()*100)%100+1;
            if (x <= difficulty) board[i][j] = Origin[i][j];
            else board[i][j] = 0;
            //최소 20은 넘겨야함
        }
    }
}

function clicking(pos) {
    posTable.f = posTable.e;
    posTable.e = pos;
    let rf, cf, re, ce;
    let f = {x:0, y:0};
    // 1차원 데이터 2차원으로 변환
    for (i = 0; i < 9; i+=1) {
        for (j = 0; j < 9; j+=1) {
            if (convertTable[i][j] == posTable.f) {
                rf = Math.floor(i/3)*3+1;
                cf = Math.floor(j/3)*3+1;
                f.x = i;
                f.y = j;
            }
            if (convertTable[i][j] == posTable.e) {
                re = Math.floor(i/3)*3+1;
                ce = Math.floor(j/3)*3+1;
                e.x = i;
                e.y = j;
            }
        }
    }
    // 색상 제거
    table[posTable.f+728].classList.remove('clicked-tile');
    for (i = rf; i <= rf+2; i+=1) {
        for (j = cf; j <= cf+2; j+=1) {
            let value = convertTable[i-1][j-1]+728;
            table[value].classList.remove('surroundings');
        }
    }
    for (i = 1; i <= 9; i+=1) {
        let horizon = convertTable[f.x][i-1]+728;
        let vertical = convertTable[i-1][f.y]+728;
        if (horizon-728 !== posTable.f) table[horizon].classList.remove('surroundings');
        if (vertical-728 !== posTable.f) table[vertical].classList.remove('surroundings');
    }
    
    // 3X3, 가로, 세로 색상 추가
    table[posTable.e+728].classList.add('clicked-tile');
    for (i = re; i <= re+2; i+=1) {
        for (j = ce; j <= ce+2; j+=1) {
            let value = convertTable[i-1][j-1]+728;
            if (value-728 == posTable.e) continue;
            table[value].classList.add('surroundings');
        }
    }
    for (i = 1; i <= 9; i+=1) {
        let horizon = convertTable[e.x][i-1]+728;
        let vertical = convertTable[i-1][e.y]+728;
        if (horizon-728 !== posTable.e) table[horizon].classList.add('surroundings');
        if (vertical-728 !== posTable.e) table[vertical].classList.add('surroundings');
    }

}

function changeMemo() {
    memo = memo^1;
    const isMemo = document.getElementById("note");
    if (memo) {
        isMemo.style.backgroundColor = '#cfe2f3';
    }
    else {
        isMemo.style.backgroundColor = '#efefef';
    }
}

function inputNumber(number) {
    // 아 어떻게 하지
    let val = convertTable[e.x][e.y]+728;
    if (memo) {
        if (board[e.x+1][e.y+1]) return;
        var x = (val-729)*9+number-1;
        if (table[x].textContent == number) {
            table[x].textContent = '';
        }
        else table[x].textContent = number;
        return;
    }
    if (Origin[e.x+1][e.y+1] !== number) {
        mistake += 1;
        miss.textContent = '실수: '+ mistake;
        return;
    }
    table[val].textContent = number;
    table[val].classList.add('new-number');
    board[e.x+1][e.y+1] = number;

    var cnt = 0;
    for (i = 1; i <= 9; i+=1) {
        for (j = 1; j <= 9; j+=1) {
            if (board[i][j]) cnt+=1;
        }
    }
    if (cnt == 81) alert('완성');
}

reset();
var cnt = 0;
do {
    reset();
    for (i = 1; i <= 9; i+=1) {
        for (j = 1; j <= 9; j+=1) {
            if (board[i][j]) cnt+=1;
        }
    }
} while(cnt < 17);

var table = document.querySelectorAll("td");

let convertTable = [
    [1, 2, 3, 10, 11, 12, 19, 20, 21],
    [4, 5, 6, 13, 14, 15, 22, 23, 24],
    [7, 8, 9, 16, 17, 18, 25, 26, 27],
    [28, 29, 30, 37, 38, 39, 46, 47, 48],
    [31, 32, 33, 40, 41, 42, 49, 50, 51],
    [34, 35, 36, 43, 44, 45, 52, 53, 54],
    [55, 56, 57, 64, 65, 66, 73, 74, 75],
    [58, 59, 60, 67, 68, 69, 76, 77, 78],
    [61, 62, 63, 70, 71, 72, 79, 80, 81]
];

let miss = document.querySelector('div.mistake');
miss.textContent = '실수: '+ mistake;

for (i = 1; i <= 9; i+=1) {
    for (j = 1; j <= 9; j+=1) {
        if (board[i][j]) {
            let value = convertTable[i-1][j-1]+728;
            table[value].textContent = board[i][j];
        }
    }
}