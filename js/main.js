// importing
import {DisjointSets} from './dataStructures.js';
import {dfsSolver, bfsSolver, aStarSolver} from './solver.js';

// maze info
let size; // size of the maze in pixels
export let rows;  // no of rows in the maze
export let columns; // no of columns in the maze
export let d = [0, -1, 0, 1, 0]; // a list used to compute neighbouring cell indices
let dx; // cell width
let dy; // cell height

let stack = [];
let visited = []; // a list which stores whether a cell is visited or not

export let horizontalWalls  = []; // a list of horizontal walls, entries are false for passages and true for walls 
export let verticalWalls = []; // a list of vertical walls, entries are false for passages and true for walls 

let initial; // initial cell
let current; // current cell
let next; // next cell
let k, ni, nj, di, dj, u, v;
let goal; // goal cell

// dom objects
let canvas = document.querySelector(".maze"); // canvas object
let context = canvas.getContext("2d"); // context

// function for initializing the maze info
function initializeMaze(s, r, c) {
    size = s;
    rows = r;
    columns = c;
    dx = size/columns;
    dy = size/rows;

    for(let i = 0; i < rows; i++) {
        let visitedRow = [];
        for(let j = 0; j < columns; j++) visitedRow.push(false);
        visited.push(visitedRow);
    }

    current = [0, 0];
    visited[0][0] = true;
    stack.push(current);

    canvas.width = size + 4;
    canvas.height = canvas.width;
    canvas.style.background = "#3B3C37";
    context.strokeStyle = "azure";
    context.lineWidth = 4;

    context.strokeRect(2, 2, size, size);

    for(let i = 0; i < rows - 1; i++) {
        let horizontalWallsInRow = [];
        for(let j = 0; j < columns; j++)  {
            horizontalWallsInRow.push(true);
            showWall(context.lineWidth/2 + (j)*dx, context.lineWidth/2 + (i + 1)*dy, context.lineWidth/2 + (j + 1)*dx, context.lineWidth/2 + (i + 1)*dy);
        }
        horizontalWalls.push(horizontalWallsInRow);
    }

    for(let i = 0; i < rows; i++) {
        let verticalWallsInRow = [];
        for(let j = 0; j < columns - 1; j++) {
            verticalWallsInRow.push(true);
            showWall(context.lineWidth/2 + (j + 1)*dx, context.lineWidth/2 + (i)*dy, context.lineWidth/2 + (j + 1)*dx, context.lineWidth/2 + (i + 1)*dy);  
        }
        verticalWalls.push(verticalWallsInRow);
    }

    context.strokeStyle = "#3B3C37";
    context.lineWidth = 4;
}

// randomized Kruskal's algorithm using disjoint sets
function kruskalGenerator(s, r, c) {
   
}

// randomized prim's algorithm
function primGenerator(s, r, c) {

}

// randomized iterative depth first search
function dfsGenerator() {

    let neighbours = [];
   
    if(stack.length != 0) {

        context.fillStyle = "#3B3C37";
        context.fillRect(current[1]*dx + 6, current[0]*dy + 6, dx - 8, dy - 8);

        current = stack[stack.length - 1]; 
        neighbours = [];

        context.fillStyle = "cornflowerblue";
        context.fillRect(current[1]*dx + 6, current[0]*dy + 6, dx - 8, dy - 8);

        for(k = 0; k < 4; k++) {
            ni = current[0] + d[k]; 
            nj = current[1] + d[k + 1];
            if(ni >= 0 && ni < rows && nj >= 0 && nj < columns && !visited[ni][nj]) {neighbours.push([ni, nj]);}
        }

        next = neighbours[Math.floor(Math.random()*neighbours.length)];
        
        if(next) {
            visited[next[0]][next[1]] = true;
            stack.push(next);
            di = next[0] - current[0];
            dj = next[1] - current[1];

            u = Math.floor((next[0] + current[0])/2);
            v = Math.floor((next[1] + current[1])/2);

            if(di == 0) {
                verticalWalls[u][v] = false;
                showWall(context.lineWidth/2 + (v + 1)*dx, context.lineWidth + (u)*dy, context.lineWidth/2 + (v + 1)*dx, (u + 1)*dy);
            }

            if(dj == 0) {
                horizontalWalls[u][v] = false;
                showWall(context.lineWidth + (v)*dx, context.lineWidth/2 + (u + 1)*dy, (v + 1)*dx, context.lineWidth/2 + (u + 1)*dy);
            }
            
        }
        else {stack.pop();}

        setTimeout(dfsGenerator, 10);
    }

    else return;

}

// draws/erases walls
function showWall(u, v, s, t) {
    context.beginPath();
    context.moveTo(u, v);
    context.lineTo(s, t);
    context.stroke();
}

// draws the path
export function showPath(path, i) {
    let x, y;

    context.fillStyle = "#16AE58";
    
    x = path[i][1]*dx + 6;
    y = path[i][0]*dy + 6;
    
    context.fillRect(x, y, dx - 8, dy - 8);
    i++;
    if(i == path.length) return;

    setTimeout(showPath, 40, path, i);
}

initializeMaze(600, 20, 20);
dfsGenerator();
//kruskalGenerator(600, 20, 20);
//primGenerator(600, 20, 20);

//setTimeout(bfsSolver,37*1000, [0, 0], [19, 19]);
//aStarSolver([0, 0], [19, 19]);
//dfsSolver([0, 0], [19, 19]);

/*
// draws on the canvas
function showCanvas() { 
    canvas.width = size + 4;
    canvas.height = canvas.width;
    canvas.style.background = "#3B3C37";
    context.strokeStyle = "azure";
    context.lineWidth = 4;

    context.strokeRect(2, 2, size, size);

    for(let i = 0; i < rows - 1; i++) 
        for(let j = 0; j < columns; j++) 
            if(horizontalWalls[i][j]) 
                showWall(context.lineWidth/2 + (j)*dx, context.lineWidth/2 + (i + 1)*dy, context.lineWidth/2 + (j + 1)*dx, context.lineWidth/2 + (i + 1)*dy);
            
    for(let i = 0; i < rows; i++) 
        for(let j = 0; j < columns - 1; j++) 
            if(verticalWalls[i][j]) 
                showWall(context.lineWidth/2 + (j + 1)*dx, context.lineWidth/2 + (i)*dy, context.lineWidth/2 + (j + 1)*dx, context.lineWidth/2 + (i + 1)*dy);

}
*/