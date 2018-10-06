var interval_rotate;
var frame = 0;
var in_progress = false;

const ColorType = {NONE:0, WHITE:1, BLACK:2};
var whose_turn;

function setUpBoard() 
{
  	clearTiles();
  	resetPieces(12, 12);
  	whose_turn = ColorType.WHITE;
}

function clearTiles() 
{
  	var board = document.getElementById("board");

  	for(var x = 0; x < board.rows.length; x++) 
  	{
    	for(var y = 0; y < board.rows[x].cells.length; y++) 
    	{
			var tile = board.rows[x].cells[y];

			if((x + y) % 2 === 0) 
	        	tile.className = "black square";
	      	else
	        	tile.className = "white square";

	      	tile.onclick = movePiece;
    	}
  	}
}

function resetPieces(n_o_black, n_o_white) 
{
  	var board = document.getElementById("board");

  	var pieces_black = n_o_black;

  	for(var x = 0; x < board.rows.length; x++) 
  	{
    	for(var y = 0; y < board.rows[x].cells.length; y++) 
    	{
      		var tile = board.rows[x].cells[y];

      		if(tile.className === "black square") 
      		{
        		if(pieces_black <= 0) 
          			break;

	        	var piece = document.createElement("div");
	        	piece.className = "piece black";
	        	piece.onclick = pieceHighlightPossibleMoves;
	        	tile.appendChild(piece);

	        	pieces_black--;
	      	}
    	}
  	}

  	var pieces_white = n_o_white;

  	for(var x = board.rows.length-1; x >= 0; x--) 
  	{
    	for(var y = 0; y < board.rows[x].cells.length; y++) 
    	{
      		var tile = board.rows[x].cells[y];

		    if(tile.className === "black square") 
		    {
		    	if(pieces_white <= 0) 
		    	{
		        	break;
		    	}

		        var piece = document.createElement("div");
		        piece.className = "piece white";
		        piece.onclick = pieceHighlightPossibleMoves;
		        tile.appendChild(piece);

		        pieces_white--;
			}
		}
	}
}

function clearPieces() 
{
  	var board = document.getElementById("board");

  	for(var x = 0; x < board.rows.length; x++) 
  	{
    	for(var y = 0; y < board.rows[x].cells.length; y++) 
    	{
      		var tile = board.rows[x].cells[y];

      		if(tile.className === "black square") 
      		{
        		var child = tile.firstChild;

        		if(child != null)
          			tile.removeChild(tile.firstChild);
      		}
    	}
  	}
}

function pieceHighlightPossibleMoves() 
{
  	var board = document.getElementById("board");
	clearTiles();
	clearSelection(board);

  	var x = this.parentNode.parentNode.rowIndex;
  	var y = this.parentNode.cellIndex;
  	var size_x = board.rows.length;
  	var size_y = board.rows[x].cells.length;
  	var piece_color = checkTileContent(board, x, y);

  	if(piece_color === whose_turn) 
  	{
	  	board.rows[x].cells[y].firstChild.className += " selected";

	  	if(piece_color === ColorType.WHITE) 
	  	{
	    	if(checkIfTileExists(x - 1, y - 1, size_x, size_y)) 
	    	{
	      		var tile_content = checkTileContent(board, x - 1, y - 1);

	      		if(tile_content === ColorType.NONE)
	          		board.rows[x - 1].cells[y - 1].className = "avalable square";
	      		else if(tile_content === ColorType.BLACK) {
	        		if(checkIfTileExists(x - 2, y - 2, size_x, size_y) && checkTileContent(board, x - 2, y - 2) === ColorType.NONE) 
	        		{
		          		board.rows[x - 1].cells[y - 1].firstChild.className += "for_taking";
		          		board.rows[x - 2].cells[y - 2].className = "square for_taking";
	        		}
	      		}
	    	}
	    	if(checkIfTileExists(x - 1, y + 1, size_x, size_y)) 
	    	{
	      		var tile_content = checkTileContent(board, x - 1, y + 1);

		      	if(tile_content === ColorType.NONE)
		          	board.rows[x - 1].cells[y + 1].className = "avalable square";
		      	else if(tile_content !== piece_color) 
		      	{
		        	if(checkIfTileExists(x - 2, y + 2, size_x, size_y) && checkTileContent(board, x - 2, y + 2) === ColorType.NONE) 
		        	{
			          	board.rows[x - 1].cells[y + 1].firstChild.className += "for_taking";
			          	board.rows[x - 2].cells[y + 2].className = "square for_taking";
		        	}
		      	}
	    	}
		}
		if(piece_color === ColorType.BLACK) 
		{
		    if(checkIfTileExists(x + 1, y - 1, size_x, size_y)) 
		    {
		      	var tile_content = checkTileContent(board, x + 1, y - 1);

		      	if(tile_content === ColorType.NONE)
		          	board.rows[x + 1].cells[y - 1].className = "avalable square";
		      	else if(tile_content === ColorType.WHITE) 
		      	{
		        	if(checkIfTileExists(x + 2, y - 2, size_x, size_y) && checkTileContent(board, x + 2, y - 2) === ColorType.NONE) 
		        	{
		          		board.rows[x + 1].cells[y - 1].firstChild.className += "for_taking";
		          		board.rows[x + 2].cells[y - 2].className = "square for_taking";
		        	}
		      	}
		    }
		    if(checkIfTileExists(x + 1, y + 1, size_x, size_y)) 
		    {
		      	var tile_content = checkTileContent(board, x + 1, y + 1);

		      	if(tile_content === ColorType.NONE)
		          	board.rows[x + 1].cells[y + 1].className = "avalable square";
		      	else if(tile_content !== piece_color) 
		      	{
		        	if(checkIfTileExists(x + 2, y + 2, size_x, size_y) && checkTileContent(board, x + 2, y + 2) === ColorType.NONE) 
		        	{
		          		board.rows[x + 1].cells[y + 1].firstChild.className += "for_taking";
		          		board.rows[x + 2].cells[y + 2].className = "square for_taking";
		        	}
		      	}
		    }
	  	}
	}
}

function getTileUnderSelectedPiece(board) 
{
  	for(var x = 0; x < board.rows.length; x++) 
  	{
    	for(var y = 0; y < board.rows[x].cells.length; y++) 
    	{
      		var tile = board.rows[x].cells[y];
      		var child = tile.firstChild;

      		if(child !== null && child.className.indexOf("selected") > -1)
        		return tile;
    	}
  	}
}

function getTileUnderPieceForTaking(board) 
{
  	for(var x = 0; x < board.rows.length; x++) 
  	{
	    for(var y = 0; y < board.rows[x].cells.length; y++) 
	    {
	      	var tile = board.rows[x].cells[y];
	      	var child = tile.firstChild;

	      	if(child !== null && child.className.indexOf("for_taking") > -1)
	        	return tile;
	    }
  	}
}

function movePiece() 
{
  	var board = document.getElementById("board");

  	if(this.className.indexOf("avalable") > -1) 
  	{
    	var tile_under_selected = getTileUnderSelectedPiece(board);
    	var piece_to_move = tile_under_selected.firstChild;

    	this.appendChild(piece_to_move);

    	clearTiles();
    	clearSelection(board);
    	rotateBoard();
  	} 
  	else if(this.className.indexOf("for_taking") > -1) 
  	{
	    var tile_under_selected = getTileUnderSelectedPiece(board);
	    var piece_to_move = tile_under_selected.firstChild;
	    var tile_under_piece_for_taking = getTileUnderPieceForTaking(board);
	    var piece_for_taking = tile_under_piece_for_taking.firstChild;

	    tile_under_piece_for_taking.removeChild(piece_for_taking);
	    this.appendChild(piece_to_move);

	    clearTiles();
	    clearSelection(board);
  	}
}

function clearSelection(board) 
{
  	for(var x = 0; x < board.rows.length; x++) 
  	{
	    for(var y = 0; y < board.rows[x].cells.length; y++) 
	    {
	      	var tile = board.rows[x].cells[y];
	      	var child = tile.firstChild;

	      	if(child !== null && child.className.indexOf("selected") > -1) 
	        	child.className = child.className.replace("selected", "");
	      	else if(child !== null && child.className.indexOf("for_taking") > -1) 
	        	child.className = child.className.replace("for_taking", "");
	    }
  	}
}

function checkIfTileExists(x, y, size_x, size_y) 
{
  	return x >= 0 && x < size_x && y >= 0 && y < size_y;
}

function checkTileContent(board, x, y) 
{
  	var content = board.rows[x].cells[y].firstChild;

  	if(content === null)
    	return ColorType.NONE;
  	else if(content.className.indexOf("white") > -1)
    	return ColorType.WHITE;
  	else if(content.className.indexOf("black") > -1)
    	return ColorType.BLACK;
  	return -1;
}

function rotateBoard() 
{
  	if(in_progress === false) 
  	{
	    interval_rotate = setInterval(rotateElement, 5, "board");
	    in_progress = true;
  	}
  	if(whose_turn === ColorType.WHITE)
  		whose_turn = ColorType.BLACK;
  	else
  		whose_turn = ColorType.WHITE;
}
function rotateElement(name, turn) 
{
  	frame += 2;
  	document.getElementById(name).style.transform = "rotate(" + frame + "deg)";
  	if(frame % 180 === 0) 
  	{
	    frame %= 360;
	    clearInterval(interval_rotate);
	    in_progress = false;
  	}
}
