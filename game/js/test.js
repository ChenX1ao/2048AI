function Test(grid){
	this.grid = new Grid(grid.serialize().size, grid.serialize().cells);
}

// Minimax Search with alphabeta pruning
Test.prototype.alphabeta = function(node, depth, alpha, beta, maximizingPlayer) {

	if (depth == 0 || node.isTerminal()) {
		return {bestValue: node.heuristic()};	
	}
	
	// Player choose a direction and move 
	if (maximizingPlayer) {
		var bestValue = Number.NEGATIVE_INFINITY;	
		var bestMove = -1;
		var moved = false;
		
		for (var direction = 0; direction < 4; direction++) {
			if (node.move(direction).moved) {
				moved = true;
				var child = node.move(direction).node;
				var result = this.alphabeta(child, depth-1, alpha, beta, false).bestValue;
				console.log("direction: " + direction + ", v: " + result);
				if (result > bestValue) {
					bestMove = direction;
				}
				bestValue = Math.max(bestValue, result);				
				alpha = Math.max(alpha, bestValue);
				if (beta <= alpha) {
					break;	// Beta cut-off	
				}
			}
		}
		
		// The current node cannot be moved toward any direction
		if (moved === false) {
			bestValue = node.heuristic();
		}
		
		return {bestValue: bestValue,
						bestMove:  bestMove};
	}
	// Computer generate a random number at a random available position 
	else {
		//var bestValue = Number.POSITIVE_INFINITY;
		//return v;		
	}
	
}

Test.prototype.getBest = function() {
	return Math.floor(Math.random()*4);
	
}

// Move tiles on the grid in the specified direction
Test.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

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

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};


// Get the vector representing the chosen direction
Test.prototype.getVector = function (direction) {
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
Test.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

Test.prototype.findFarthestPosition = function (cell, vector) {
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
