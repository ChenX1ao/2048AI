function Test(grid){
	this.grid = grid;
}

Test.prototype.getBest = function() {
	return Math.floor(Math.random()*4);
	
}