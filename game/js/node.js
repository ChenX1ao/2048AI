function Node(grid){
	this.grid = new Grid(grid.serialize().size, grid.serialize().cells);
}

//Static heuristic function
Node.prototype.heuristic = function() {
	return 0
			 + this.largestNumberAtCorner()           * 1000
			 + this.mainLineOnEdge()                  * 1000
			 + this.mainLineSumRatio()                * 200
			 + this.mainLineSmoothness()              * 70
			 + this.smoothnessNormalized()            * 5
       + this.emptyCellsNormalized()            * 5
	;
};

// Return the number of empty cells
Node.prototype.emptyCells = function() {
	return this.grid.availableCells().length;
};

Node.prototype.emptyCellsNormalized = function() {
	// Return 0 for 0 empty cells and return 1 for 16 empty cells if the grid size is 4
	return (1 + this.grid.availableCells().length/Math.pow(this.grid.size,2));
};

// Return the largest number
Node.prototype.largestNumber = function() {
	var largestNumber = 0;
	this.grid.eachCell(function (x, y, tile) {
		if (tile) {
			if (tile.value > largestNumber) {
				largestNumber = tile.value;
			}
		}	
	});
	return largestNumber;
};

Node.prototype.largestNumberNormalized = function() {
	// Return 1/16 for 2 and return 1 for 65536
	return (1 + Math.log(this.largestNumber())/(Math.log(2)*Math.pow(this.grid.size,2)));
};

// Return the largest number of a line
Node.prototype.oneLineLargestNumber = function(lineNumber, lineType) {
	var largestNumber = 0;
	var tile = this.grid.cells;
	if (lineType === "Row") {
		var y = lineNumber;
		for (var x = 0; x < this.grid.size; x++) {
			if (tile[x][y]) {
				if (tile[x][y].value > largestNumber) {
					largestNumber = tile[x][y].value;
				}
			}
		}
	} else {
		var x = lineNumber;
		for (var y = 0; y < this.grid.size; y++) {
			if (tile[x][y]) {
				if (tile[x][y].value > largestNumber) {
					largestNumber = tile[x][y].value;
				}
			}
		}
	}
	return largestNumber;
};

Node.prototype.oneLineLargestNumberNormalized = function(lineNumber, lineType) {
	// Return 1/16 for 2 and return 1 for 65536
	return (1 + Math.log(this.oneLineLargestNumber(lineNumber, lineType))/(Math.log(2)*Math.pow(this.grid.size,2)));
};

// Return 1 if the largest Number is at Corner else return 0
Node.prototype.largestNumberAtCorner = function() {
	var largestNumberAtCorner = 0;
	var largestNumber = this.largestNumber();	
	this.grid.eachCell(function (x, y, tile) {
		if (tile) {
			if (tile.value === largestNumber) {
				if ((x == 0 && y == 0) || (x == 0 && y == 3) ||  (x == 3 && y == 0) ||  (x == 3 && y == 3)) {
					largestNumberAtCorner = 1;
				} 			
			}
		}
	});
	return (1 + largestNumberAtCorner);
};

// Find the sum of all the numbers
Node.prototype.sum = function() {
	var sum = 0;
	this.grid.eachCell(function (x, y, tile) {
		if (tile) {
			sum += tile.value;	
		}	
	});
	return sum;	
};

// Find the amount of largest numbers
Node.prototype.amountOfLargestNumbers = function() {
	var amount = 0;
	var largestNumber = this.largestNumber();
	this.grid.eachCell(function (x, y, tile) {
		if (tile) {
			if (tile.value === largestNumber) {
				amount += 1;			
			}
		}
	});
	return amount;
};

// Find a row or column of which the sum is largest
Node.prototype.findMainLine = function() {
	var mainRow = this.findMainRow();
	var mainColumn = this.findMainColumn();
	var mainLine;	
	
	var mainRowSum = mainRow.sum;
	var mainColumnSum = mainColumn.sum;
	if (mainRowSum >= mainColumnSum) {
		mainLine = {pos: mainRow.pos, sum: mainRow.sum, type: "Row"};	
	} else {
		mainLine = {pos: mainColumn.pos, sum: mainColumn.sum, type: "Column"};		
	}
	return mainLine;
};

Node.prototype.findMainRow = function() {
	var pos;
	var sum = 0;
	
	var tile = this.grid.cells;
	for (var y = 0; y < this.grid.size; y++) {
		var tempSum = 0;
		for (var x = 0; x < this.grid.size; x++) {
			if(tile[x][y]) {
				tempSum += tile[x][y].value;
			}
		}
		if (tempSum > sum) {
			pos = y;	
			sum = tempSum;
		}
	}	
	return {pos: pos, sum: sum};
};

Node.prototype.findMainColumn = function() {
	var pos;
	var sum = 0;
	
	var tile = this.grid.cells;
	for (var x = 0; x < this.grid.size; x++) {
		var tempSum = 0;
		for (var y = 0; y < this.grid.size; y++) {
			if(tile[x][y]) {
				tempSum += tile[x][y].value;
			}
		}
		if (tempSum > sum) {
			pos = x;	
			sum = tempSum;
		}
	}	
	return {pos: pos, sum: sum};
};

Node.prototype.oneLineSmoothness = function (linePos, lineType) {
	var smoothness = 0;
	var tile = this.grid.cells;
	
	if (lineType === "Row") {
		var y = linePos;
		for (var x = 0; x < this.grid.size - 1 ; x++) {
			if (tile[x][y]) {
				var left = Math.log(tile[x][y].value)/Math.log(2);		
			} else {
				var left = 0;
			}
			
			if (tile[x+1][y]) {
				var right = Math.log(tile[x+1][y].value)/Math.log(2);
			} else {
				var right = 0;
			}				
			smoothness += Math.abs(left - right);
		}		
	} else {
		var x = linePos;
		for (var y = 0; y < this.grid.size; y++) {
			if (tile[x][y]) {
				var up = Math.log(tile[x][y].value)/Math.log(2);
			} else {
				var up = 0;
			}
				
			if (tile[x][y+1]) {
				var down = Math.log(tile[x][y+1].value)/Math.log(2);
			} else {
				var down = 0;
			}
			smoothness += Math.abs(up - down);
		}
	}
	return smoothness;
}

Node.prototype.oneLineSmoothnessNormalized = function(linePos, lineType) {
	var smoothnessNormalized = 0;
	var smoothness = this.oneLineSmoothness(linePos, lineType);
	if (smoothness == 0) {
		smoothnessNormalized = 1;
	} else {
		smoothnessNormalized = 1/smoothness;		
	}
	return (1 + smoothnessNormalized);
};

Node.prototype.smoothness = function() {
	var smoothness = 0;
	for (var i = 0; i < this.grid.size; i++) {
		smoothness += this.oneLineSmoothness(i, "Row");	
		smoothness += this.oneLineSmoothness(i, "Column");		
	}	
	return smoothness;
}

Node.prototype.smoothnessNormalized = function() {
	var smoothnessNormalized = 0;
	var smoothness = this.smoothness();
	if (smoothness == 0) {
		smoothnessNormalized = 1;
	} else {
		smoothnessNormalized = 1/smoothness;		
	}
	return (1 + smoothnessNormalized);
};

Node.prototype.mainLineSmoothness = function() {
	var mainLine = this.findMainLine();
	return this.oneLineSmoothnessNormalized(mainLine.pos, mainLine.type);
};

Node.prototype.mainLineOnEdge = function() {
	var mainLineOnEdge = 0;
	var mainLine = this.findMainLine();
	if (mainLine.pos === 0 || mainLine.pos === 3) {
		mainLineOnEdge = 1;
	}
	return (1 + mainLineOnEdge);
};

Node.prototype.mainLineSumRatio = function() {
	var mainLineSum = this.findMainLine().sum;
	var sum = this.sum();
	return (1 + mainLineSum/sum); 
};

// Move tiles on the grid in the specified direction
Node.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = new Node(this.grid);

  var cell, tile;

  var vector     = self.getVector(direction);
  var traversals = self.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  self.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });
	
	return {node : self,
					moved: moved};
};


// Get the vector representing the chosen direction
Node.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
Node.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.grid.serialize().size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

Node.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

// Save all tile positions and remove merger info
Node.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
Node.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

Node.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};

// Check if the node is a terminal
Node.prototype.isTerminal = function () {
	return false;
};

