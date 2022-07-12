import Queue from './queue.js';

// maze info
let size;
let rows;
let columns;
let dx;
let dy;
let del = [0, -1, 0, 1, 0];

let grid = [];
let stack = [];
let queue = new Queue();

let initial;
let current;
let goal;

// dom variables
let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");

function initializeMaze(s, r, c) {
    size = s;
    columns = c;
    rows = r;
    dx = size/columns;
    dy = size/rows;

    for(let i = 0; i < rows; i++) {
        let row = [];

        for(let j = 0; j < columns; j++) {
            let cell = {
                visited: false, 
                walls: [true,true,true,true], 
                rowIndex: i, 
                colIndex: j
            };
            row.push(cell);
        }

        grid.push(row);
    }
}

// removes walls
function removeWall(cell, nextCell) {
    let di = nextCell.rowIndex - cell.rowIndex;
    let dj = nextCell.colIndex - cell.colIndex;

    if(di == -1 && dj == 0) {cell.walls[0] = false; nextCell.walls[1] = false;}
    if(di == 1 && dj == 0) {cell.walls[1] = false; nextCell.walls[0] = false;}
    if(di == 0 && dj == 1) {cell.walls[2] = false; nextCell.walls[3] = false;}
    if(di == 0 && dj == -1) {cell.walls[3] = false; nextCell.walls[2] = false;} 
}

// function to check the neighbours of a cell
function checkNeighbours(cell) {

    let neighbours = [];
    let nrow;
    let ncol;

    for(let i = 0; i < 4; i++) {
        nrow = cell.rowIndex + del[i];
        ncol = cell.colIndex + del[i + 1];
        if(nrow >= 0 && nrow < rows && ncol >= 0 && ncol < columns && !grid[nrow][ncol].visited) neighbours.push(grid[nrow][ncol]);
    }

    let index = Math.floor(Math.random()*neighbours.length);
    
    return neighbours[index];
}

// randomized iterative dfs
function dfsGenerator() {
    current = grid[0][0];
    current.visited = true;
    stack.push(current);
    
    let next; 
    
    while(stack.length != 0) {
         
        current = stack[stack.length - 1]; 
        next = checkNeighbours(current);
        
        if(next) {
            next.visited = true;
            stack.push(next);
            removeWall(current, next);
        }
        else {
            stack.pop();
        }

        draw();
    }
}

function draw() { 
    maze.width = size + 4;
    maze.height = maze.width;
    maze.style.background = "#3B3C37";
    ctx.strokeStyle = "azure";
    ctx.lineWidth = 4;

    for(let row of grid)
        for(let cell of row) {
            let x = ctx.lineWidth/2 + cell.colIndex*dx;
            let y = ctx.lineWidth/2 + cell.rowIndex*dy;
            if(cell.walls[0]) drawWall(x, y, x+dx, y); 
            if(cell.walls[1]) drawWall(x, y+dy, x+dx, y+dy);
            if(cell.walls[2]) drawWall(x+dx, y, x+dx, y+dy);
            if(cell.walls[3]) drawWall(x, y, x, y+dy);
        }            
}

function drawWall(u, v, s, t) {
    ctx.beginPath();
    ctx.moveTo(u, v);
    ctx.lineTo(s, t);
    ctx.stroke()
}


initializeMaze(600, 20, 20);
//draw();
dfsGenerator();
//bfsGenerator();
//kruskalGenerator();
//primGenerator();

// creates walls
// function createWall(cell, nextCell) {}

// randomized bfs
function bfsGenerator() {
    current = grid[0][0];
    current.visited = true;
    queue.enqueue(current);
    
    let next; 
    
    while(queue.size() != 0) {
         
        current = queue.front(); 
        next = checkNeighbours(current);
        
        if(next) {
            next.visited = true;
            queue.enqueue(next);
            removeWall(current, next);
        }
        else {
            queue.dequeue();
        }

        draw();
    }
}