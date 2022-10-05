var globalStartTime = performance.now(); //calculate performance

//Global variables

//start and finish nodes. Could be chosen dynamically
var turn = 1; //player's turn, starts with player 1

//Grid size
var gridWidth = 3;
var gridHeight = 3;
var turns = gridWidth * gridHeight;
var turnsPlayed = 0;

//We call the clickableGrid function and store the result in a grid variable
var grid = clickableGrid(gridWidth, gridHeight, myCallback);
//we append the generated grid to the <div id="grid-container"> tag
document.getElementById('grid-container').appendChild(grid);

///////////////////////////////////////////////////////////////////////////////////////////////////
//Callback function (called on a cell click)
///////////////////////////////////////////////////////////////////////////////////////////////////
function myCallback(node, row, col, i) {
  if (node.innerHTML === '') {
    if (turn == 1 && turnsPlayed <= turns) {
      turnsPlayed++;
      node.innerHTML = "X";
      turn = 2;
      if (turnsPlayed <= turns) player(grid);
    }
    else {
      node.innerHTML = "O";
      turn = 1;
    }
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////

//clear grid on new game button click
document.getElementById('newgame').addEventListener('click', function () {
  turnsPlayed = 0;
  turn = 1;
  document.getElementById('grid-container').removeChild(grid);
  grid = clickableGrid(gridWidth, gridHeight, myCallback);
  document.getElementById('grid-container').appendChild(grid);
});

//simple player, just fill in the next free cell
var BreakException = {}; //needed to break foreach loop
function player(grid) {
  if (turn == 2 && turnsPlayed <= turns) {
    try {
      grid.querySelectorAll('td').forEach(td => {
        if (td.innerHTML === '') {
          td.innerHTML = 'O';
          turn = 1;
          turnsPlayed++;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
  }
}

//test for the win and display message ?
function testWin() {

}

///////////////////////////////////////////////////////////////////////////////////////////////////
//Clickable grid function
///////////////////////////////////////////////////////////////////////////////////////////////////
//It generates an HTML / DOM <table> which triggers a function when a <td> (our nodes) is clicked
function clickableGrid(rows, cols, callback, gridId = 'grid1') {

  let i = 0; //nodes #ID
  let htmlTableGrid = document.createElement('table'); //We create a DOM <table> element
  htmlTableGrid.className = 'grid'; //add the CSS class .grid to the <table> element
  htmlTableGrid.id = gridId;

  for (let c = 0; c < cols; ++c) { //for each column
    let tr = htmlTableGrid.appendChild(document.createElement('tr')); //we create a <tr>

    for (let r = 0; r < rows; ++r) { //for each row

      let node = tr.appendChild(document.createElement('td')); //we create a <td> (our nodes)

      node.id = gridId + '_' + i; //we add an ID attribute to the <td>
      node.setAttribute('row', r); //we set a row attribute with the row value
      node.setAttribute('col', c); //we set a col attribute with the col value

      // node.innerHTML = '[' + r + ',' + c + ']'; //What we display in the <td>

      node.addEventListener('click', (function (node, r, c, i) {
        return function () {
          callback(node, r, c, i);
        }
      })(node, r, c, i), false);

      i++; //increase node #ID

    }
  }

  return htmlTableGrid;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//Nodes functions
///////////////////////////////////////////////////////////////////////////////////////////////////

//Get <td> DOM element from given #ID
function getNode(id) {
  return document.getElementById(id);
}

//Get neighboring <td> DOM elements from given node
//@param: node : current node
//@param: gridId : DOM container #ID, useful if there's more than one grid in the page
function getNodeNeighbors(node, gridId = 'grid1') {

  let neighbors = []; //returned array

  //current node row and col
  let row = parseInt(node.getAttribute('row'));
  let col = parseInt(node.getAttribute('col'));

  // console.log(document.querySelector('#'+gridId+' td[row="'+row+'"][col="'+col+'"]'));

  let neighbor; //local variable

  if (row - 1 >= 0) { //The neighbor above our current node should exist in the grid
    neighbor = document.querySelector('#' + gridId + ' td[row="' + (row - 1) + '"][col="' + col + '"]');
    if (neighbor && !neighbor.hasAttribute('notwalkable')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
  }
  if (col + 1 < gridWidthInput.value) { //The neighbor on the right of our current node should exist in the grid
    neighbor = document.querySelector('#' + gridId + ' td[row="' + row + '"][col="' + (col + 1) + '"]');
    if (neighbor && !neighbor.hasAttribute('notwalkable')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
  }
  if (row + 1 < gridHeightInput.value) { //The neighbor on the bottom of our current node should exist in the grid
    neighbor = document.querySelector('#' + gridId + ' td[row="' + (row + 1) + '"][col="' + col + '"]');
    if (neighbor && !neighbor.hasAttribute('notwalkable')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
  }
  if (col - 1 >= 0) { //The neighbor on the bottom of our current node should exist in the grid
    neighbor = document.querySelector('#' + gridId + ' td[row="' + row + '"][col="' + (col - 1) + '"]');
    if (neighbor && !neighbor.hasAttribute('notwalkable')) neighbors.push(neighbor); //if the neighbor exist and is not a wall
  }
  return neighbors;
}


var globalEndTime = performance.now();
console.log(`Page init took ${globalEndTime - globalStartTime} milliseconds`);