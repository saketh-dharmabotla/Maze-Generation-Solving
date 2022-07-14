// importing
import {DisjointSets} from './dataStructures.js';
import {dfsSolver, bfsSolver, aStarSolver} from './solver.js';

// maze info
let size; // size of the maze in pixels
export let rows;  // no of rows in the maze
export let columns; // no of columns in the maze
let dx; // cell width
let dy; // cell height

export let horizontalWalls  = []; // a list of horizontal walls, entries are false for passages and true for walls 
export let verticalWalls = []; // a list of vertical walls, entries are false for passages and true for walls 

let visited = []; // a list which stores whether a cell is visited or not

let disjointSets = new DisjointSets(); // a disjoint set data structure of cells for randomized Kruskal's algorithm
let walls = [null]; // a list of walls for Kruskal's algorithm
let wallsSize = 0; // the size of the list of walls for Kruskal's algorithm

let wallList = [null]; // a list of walls for randomized Prim's algorithm
let wallListSize = 0; // the size of the wall list for Prim's algorithm

let stack = []; // a stack for the dfsGenerator function

export let d = [0, -1, 0, 1, 0]; // a list used to compute neighbouring cell indices
let k, ni, nj, di, dj, u, v;

let initial; // initial cell
let current; // current cell
let next; // next cell
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
    
    disjointSets.create(rows*columns);

    for(let i = 0; i < rows - 1; i++) 
        for(let j = 0; j < columns; j++) 
            walls.push({
                indices: [i, j],
                type: 0
            });        

    for(let i = 0; i < rows; i++) 
        for(let j = 0; j < columns - 1; j++) 
            walls.push({
                indices: [i, j],
                type: 1
            });        

    wallsSize = 2*rows*columns - rows - columns;

    wallList.push({
        indices: [0, 0],
        type: 0 
    });

    wallList.push({
        indices: [0, 0],
        type: 1
    });

    wallListSize = 2;

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
function kruskalGenerator(i = 0, j = 0, t = 0) {
   
    let index;

    // coloring the cells black
    context.fillStyle = "#3B3C37";
    context.fillRect(j*dx + 4, i*dy + 4, dx - 4, dy - 4);
    if(t == 0) {context.fillRect(j*dx + 4, (i + 1)*dy + 4, dx - 4, dy - 4);}
    else if(t == 1) {context.fillRect((j + 1)*dx + 4, i*dy + 4, dx - 4, dy - 4);}

    if(disjointSets.noOfSets != 1) {

        // pick a wall at random
        index = Math.floor(Math.random()*wallsSize) + 1;

        i = walls[index].indices[0];
        j = walls[index].indices[1];
        t = walls[index].type;

        // check the wall and make changes
        if(t == 0 && disjointSets.find(i*columns + j) != disjointSets.find((i + 1)*columns + j)) {
            disjointSets.union(i*columns + j, (i + 1)*columns + j);
            horizontalWalls[i][j] = false;
            context.fillStyle = "cornflowerblue";
            context.fillRect(j*dx + 4, i*dy + 4, dx - 4, dy - 4);
            context.fillStyle = "coral";
            context.fillRect(j*dx + 4, (i + 1)*dy + 4, dx - 4, dy - 4);
            showWall(context.lineWidth + (j)*dx, context.lineWidth/2 + (i + 1)*dy, (j + 1)*dx, context.lineWidth/2 + (i + 1)*dy);
        }
        else if(t == 1 && disjointSets.find(i*columns + j) != disjointSets.find(i*columns + j + 1)) {
            disjointSets.union(i*columns + j, i*columns + j + 1);
            verticalWalls[i][j] = false;
            context.fillStyle = "cornflowerblue";
            context.fillRect(j*dx + 4, i*dy + 4, dx - 4, dy - 4);
            context.fillStyle = "coral";
            context.fillRect((j + 1)*dx + 4, i*dy + 4, dx - 4, dy - 4);
            showWall(context.lineWidth/2 + (j + 1)*dx, context.lineWidth + (i)*dy, context.lineWidth/2 + (j + 1)*dx, (i + 1)*dy);
        }
        
        //remove the wall   
        wallsSize--;

        if(walls.length > 2) {
            walls[index] = walls[walls.length - 1];
            walls.splice(walls.length - 1);
        } 
        else if(walls.length == 2) {
            walls.splice(1, 1);
        }

        // repeat
        setTimeout(() => {kruskalGenerator(i, j, t);}, 20)
    }
    else {bfsSolver([0, 0], [39, 39]); return;}
}

// randomized prim's algorithm
function primGenerator(i = 0, j = 0) {
    
    let index, t;
    console.log("Prim's");
    context.fillStyle = "#3B3C37";
    context.fillRect(j*dx + 4, i*dy + 4, dx - 4, dy - 4);

    if(wallListSize != 0) {

        // pick a wall at random
        index = Math.floor(Math.random()*wallListSize) + 1;
        
        i =  wallList[index].indices[0]; 
        j =  wallList[index].indices[1];
        t = wallList[index].type;

        // check the wall and make changes 
    
        if(t == 0 && visited[i][j] != visited[i + 1][j] && !visited[i][j]) {
            visited[i][j] = true;
            horizontalWalls[i][j] = false;
            showWall(context.lineWidth + (j)*dx, context.lineWidth/2 + (i + 1)*dy, (j + 1)*dx, context.lineWidth/2 + (i + 1)*dy);    
            addWalls(i, j);
        }
            
        else if(t == 0 && visited[i][j] != visited[i + 1][j] && !visited[i + 1][j]) {
            visited[i + 1][j] = true;
            horizontalWalls[i][j] = false;
            showWall(context.lineWidth + (j)*dx, context.lineWidth/2 + (i + 1)*dy, (j + 1)*dx, context.lineWidth/2 + (i + 1)*dy);
            i = i + 1;
            addWalls(i, j);
        } 
        
        else if(t == 1 && visited[i][j] != visited[i][j + 1] && !visited[i][j]) {
            visited[i][j] = true;
            verticalWalls[i][j] = false;
            showWall(context.lineWidth/2 + (j + 1)*dx, context.lineWidth + (i)*dy, context.lineWidth/2 + (j + 1)*dx, (i + 1)*dy);
            addWalls(i, j);
        }
        else if(t == 1 && visited[i][j] != visited[i][j + 1] && !visited[i][j + 1]) {
            visited[i][j + 1] = true;
            verticalWalls[i][j] = false;
            showWall(context.lineWidth/2 + (j + 1)*dx, context.lineWidth + (i)*dy, context.lineWidth/2 + (j + 1)*dx, (i + 1)*dy);
            j = j + 1;
            addWalls(i, j);
        } 
    
        // remove the wall
        wallListSize--;

        if(wallList.length > 2) {
            wallList[index] = wallList[wallList.length - 1];
            wallList.splice(wallList.length - 1);
        } 
        else if(wallList.length == 2) {
            wallList.splice(1, 1);
        }

        // repeat
        setTimeout(() => {primGenerator(i, j);}, 10);
    }
    else {bfsSolver([0, 0], [39, 39]); return;}

}

function addWalls(i, j) {    
    if(i < rows - 1 && horizontalWalls[i][j]) {wallListSize++; wallList.push({indices: [i, j], type: 0});}
    if(j < columns - 1 && verticalWalls[i][j]) {wallListSize++; wallList.push({indices: [i, j], type: 1});}
    if(i > 0 && horizontalWalls[i - 1][j]) {wallListSize++; wallList.push({indices: [i - 1, j], type: 0});}
    if(j > 0 && verticalWalls[i][j - 1]) {wallListSize++; wallList.push({indices: [i, j - 1], type: 1});}
    context.fillStyle = "coral";
    context.fillRect(j*dx + 4, i*dy + 4, dx - 4, dy - 4);
}

// randomized iterative depth first search
function dfsGenerator() {

    let neighbours = [];
   
    if(stack.length != 0) {

        context.fillStyle = "#3B3C37";
        context.fillRect(current[1]*dx + 4, current[0]*dy + 4, dx - 4, dy - 4);

        current = stack[stack.length - 1]; 
        neighbours = [];

        context.fillStyle = "cornflowerblue";
        context.fillRect(current[1]*dx + 4, current[0]*dy + 4, dx - 4, dy - 4);

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

            if(dj == 0) {
                horizontalWalls[u][v] = false;
                showWall(context.lineWidth + (v)*dx, context.lineWidth/2 + (u + 1)*dy, (v + 1)*dx, context.lineWidth/2 + (u + 1)*dy);
            }

            if(di == 0) {
                verticalWalls[u][v] = false;
                showWall(context.lineWidth/2 + (v + 1)*dx, context.lineWidth + (u)*dy, context.lineWidth/2 + (v + 1)*dx, (u + 1)*dy);
            }

        }
        else {stack.pop();}

        setTimeout(dfsGenerator, 20);
    }
    else {bfsSolver([0, 0], [39, 39]); return};

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
    
    x = path[i][1]*dx + 4;
    y = path[i][0]*dy + 4;
    
    context.fillRect(x, y, dx - 4, dy - 4);
    i++;
    if(i == path.length) return;

    setTimeout(showPath, 40, path, i);
}

initializeMaze(600, 40, 40);

//canvas.style.background ="#16AE58";
//kruskalGenerator(600, 20, 20);

canvas.style.background = "#16AE58";
primGenerator();

//canvas.style.background = "#FFA630";
//dfsGenerator();

//bfsSolver([0, 0], [19, 19]);
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