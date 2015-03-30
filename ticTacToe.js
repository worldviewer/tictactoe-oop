$(document).ready(function() {
	// Initialize Console.js, which just makes console logs a bit easier to read.

	// INSTRUCTIONS ON USING console.js
	// Step 1: override console methods and enable String.prototype styles
	Console.attach();
	Console.styles.attach();

	// Step 2: register your styles
	Console.styles.register({
	    bold: 'font-weight:bold',
	    underline: 'text-decoration:underline',

	    red: 'color:#de4f2a',
	    blue: 'color:#1795de',
	    green: 'color:green',
	    grey: 'color:grey',

	    code: 'background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1); line-height: 18px; text-decoration:underline;'
	});

	// test out console.log.bind()
	var info = console.log.bind(console, '\nINFO:');
	var warn = console.warn.bind(console, '\nWARN:');
	var error = console.error.bind(console, '\nERROR: ');
	var testing = console.log.bind(console, '\nTEST:'.underline.bold.green + ' ');

	// TIC TAC TOE CODE BEGINS HERE

	// Player object represents both players
	function Player() {
		this.move = 'x'; // Initialize first move to 'x'
	}

	Player.prototype.makeMove = function (game, row, column) {
		// makeMove assumes that the state is set to 'none'

		var $box = game.getBox(row, column);
		testing($box);

		$box.addClass(this.move);

		// Change box's state
		game.board[row][column]['state'] = this.move;

		// Check to see if there's a winner
		var winner = game.isWinner();
		if(winner) {

			// Show win banner + messages ...
			$('#move').html(winner.toUpperCase() + " HAS WON!");
			$('#message').addClass('win');
			$("#win").addClass('fadeIn');
		} else {
			// Alternate the current move
			this.move = (this.move === 'o') ? 'x' : 'o';

			// Change turn message
			$('#move').html("(It is " + this.move + "'s turn ...)");
		}
	};

	function TicTacToe(player) {

		// IMPORTANT: Save the context into thisGame to prevent jQuery from destroying it ...
		var thisGame = this;


		// First, grab references to all of the elements, and place them into
		// an array of three rows.  Each row is represented by an array of
		// 3 columns.  So, to reference a particular box, use:
		//
		// thisGame.board[x][y];

		// Initialize tiles to the 'none' state ...

		thisGame.board = [[{id:thisGame.getBox(0,0), state:'none'},
					  	   {id:thisGame.getBox(0,1), state:'none'},
					  	   {id:thisGame.getBox(0,2), state:'none'}],

					      [{id:thisGame.getBox(1,0), state:'none'},
					       {id:thisGame.getBox(1,1), state:'none'},
					       {id:thisGame.getBox(1,2), state:'none'}],

					      [{id:thisGame.getBox(2,0), state:'none'},
					       {id:thisGame.getBox(2,1), state:'none'},
					       {id:thisGame.getBox(2,2), state:'none'}]];

		testing(thisGame.board[0][0]['id']); // testing array structure
		testing(thisGame.board[1][2]['id']); // testing array structure

		// Next, make each box clickable
		var $boxes = $('.box');

		// IMPORTANT: Context changing to jQuery ...
		$boxes.on('click', function(e) {
			// Test the Event Listener ...
			// Store the target's ID into a variable
			var target = e.target.id;

			testing("clicked " + target);

			// When a board box is pressed, make a move based upon the current
			// state -- but only if there is no winner
			if (!thisGame.isWinner()) {
				switch(thisGame.board[thisGame.getRow(target)][thisGame.getColumn(target)]['state']){
					case 'none':
						testing('state is none, changing state');
						player.makeMove(thisGame, thisGame.getRow(target), thisGame.getColumn(target), player.move);
						break;
					case 'x':
						// Do nothing, because this box is already checked
						testing('state is already x!');
						break;
					case 'o':
						// Do nothing, because this box is already checked
						testing('state is already o!');
						break;
					default:
						testing('something went wrong!');
						break;
				}
			}
		});

		// Now, set up the Reset button ...
		// IMPORTANT: Note that to avoid executing the function within the constructor itself, we have
		// to wrap this function with its passed parameter into a wrapper function
		$('#reset').on('click', function() { thisGame.resetGame(player) });
	}

	// Checks to see if any of the array sums are either 3 or -3
	TicTacToe.prototype.three = function (arr) {
		var isWinner = 'false';
		var winner = 'none';

		for (var i = 0; i < arr.length; i++) {
			if (Math.abs(arr[i]) === 3) {
				return { isWinner:true, winner:((arr[i] === 3) ? 'x' : 'o') }
			}
		};

		return { isWinner:false, winner:'none' };
	};

	// Generates semantic name for board box based upon row + column numbers
	TicTacToe.prototype.getBox = function (row, column) {
		var id = '';

		// Convert semantic CSS id's into numeric array format
		switch(row){
			case 0:
				id = 'top';
				break;
			case 1:
				id = 'middle';
				break;
			case 2:
				id = 'bottom';
				break;
		}

		switch(column){
			case 0:
				id += '-left';
				break;
			case 1:
				id += '-middle';
				break;
			case 2:
				id += '-right';
				break;
		}

		return $('#'+ id);
	};

	// converts a text-based tile ID into HTML semantic row
	TicTacToe.prototype.getRow = function (id) {
		switch(id.split('-')[0]){
			case 'top':
				return 0;
			case 'middle':
				return 1;
			case 'bottom':
				return 2;
		}
	};

	// converts a text-based tile ID into HTML semantic column
	TicTacToe.prototype.getColumn = function (id) {
		switch(id.split('-')[1]){
			case 'left':
				return 0;
			case 'middle':
				return 1;
			case 'right':
				return 2;
		}
	};

	// returns the current state for a row/column combination
	TicTacToe.prototype.getState = function (row, column) {
		switch(this.board[row][column]['state']){
			case 'none':
				return 0;
			case 'x':
				return 1;
			case 'o':
				return -1;
		}
	};

	TicTacToe.prototype.isWinner = function () {
		// There are 8 total ways to win for each player.  To check for victory, add
		// 1 to checkWin for 'x', subtract 1 for 'o'

		// Check the row sums
		var rowSums = [this.getState(0,0) + this.getState(0,1) + this.getState(0,2),
					   this.getState(1,0) + this.getState(1,1) + this.getState(1,2),
					   this.getState(2,0) + this.getState(2,1) + this.getState(2,2)];

		// Check the columns
		var columnSums = [this.getState(0,0) + this.getState(1,0) + this.getState(2,0),
					   	  this.getState(0,1) + this.getState(1,1) + this.getState(2,1),
					      this.getState(0,2) + this.getState(1,2) + this.getState(2,2)];


		// Check the diagonals
		var diagonalSums = [this.getState(0,0) + this.getState(1,1) + this.getState(2,2),
					  		this.getState(0,2) + this.getState(1,1) + this.getState(2,0)]

		// Check all array sums for -3 or 3
		if (this.three(rowSums)['isWinner']) {
			info('Winner: ' + this.three(rowSums)['winner'])
			return this.three(rowSums)['winner'];
		}

		if (this.three(columnSums)['isWinner']) {
			info('Winner: ' + this.three(columnSums)['winner'])
			return this.three(columnSums)['winner'];
		}

		if (this.three(diagonalSums)['isWinner']) {
			info('Winner: ' + this.three(diagonalSums)['winner'])
			return this.three(diagonalSums)['winner'];
		}
	};

	TicTacToe.prototype.resetGame = function (player) {
		info("Reseting Game ...");

		// Clear out states on board
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				this.board[i][j]['state'] = 'none';
			};
		};

		// Reset the box styles
		var $boxes = $('.box');
		$boxes.removeClass('x o');

		// Reset move on player object
		player.move = 'x';

		// Reset the move and win messages ...
		$('#move').html("(It is " + player.move + "'s turn ...)");
		$('#message').removeClass('win');
		$('#win').removeClass('fadeIn');
	};

	var gamePlayer = new Player();
	var game = new TicTacToe(gamePlayer);

	console.log(game);
});
