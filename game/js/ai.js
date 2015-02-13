function AI(){
}

// Minimax Search with alphabeta pruning
AI.prototype.alphabeta = function(node, depth, alpha, beta, maximizingPlayer) {

	if (depth == 0 || node.isTerminal()) {
		return {bestValue: node.heuristic()};	
	}
	
	// Player choose a direction and move 
	if (maximizingPlayer) {
		var bestValue = Number.NEGATIVE_INFINITY;	
		var bestMove;
		var moved = false;
		
		for (var direction = 0; direction < 4; direction++) {
			if (node.move(direction).moved) {
				moved = true;
				var child = node.move(direction).node;				
				var result = this.alphabeta(child, depth-1, alpha, beta, false).bestValue;
				
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
		var bestValue = Number.POSITIVE_INFINITY;
		
		var cells = node.grid.availableCells();
		var scores = {2: [], 4: [] };
		for (var value in scores) {
			for (var i in cells) {
				var tile = new Tile(cells[i], parseInt(value));
				var child = new Node(node.grid);
				child.grid.insertTile(tile);
				
				var result = this.alphabeta(child, depth-1, alpha, beta, true).bestValue;
				bestValue = Math.min(bestValue, result);				
				beta = Math.min(beta, bestValue);
				if (beta <= alpha) {
					break;	// Alpha cut-off	
				}
			}
		}
		
		return {bestValue: bestValue};		
	}
	
}

AI.prototype.getBest = function() {
	return Math.floor(Math.random()*4);
	
}