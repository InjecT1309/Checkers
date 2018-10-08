//Made by Adam Składanek 7 X 2018

var interval_rotate;
var frame = 0;
var in_progress = false;

const ColorType = {NONE:0, WHITE:1, BLACK:2};
var whose_turn = ColorType.WHITE;
var selection_lock = false;
var capture_avalable = false;

function setUpBoard() 
{
	var board = document.getElementById("board");

  	resetTiles(board);
  	resetPieces(board, 12, 12);
}

function resetTiles(board) 
{
  	for(var r = 0; r < board.rows.length; r++) 
  	{
    	for(var c = 0; c < board.rows[r].cells.length; c++) 
    	{
			var tile = board.rows[r].cells[c];

			if((r + c) % 2 === 0) 
	        	tile.className = "black square";
	      	else
	        	tile.className = "white square";

	      	tile.onclick = pieceAction;
    	}
  	}
}

function resetPieces(board, n_o_black, n_o_white) 
{
  	var pieces_black = n_o_black;

  	for(var r = 0; r < board.rows.length; r++) 
  	{
    	for(var c = 0; c < board.rows[r].cells.length; c++) 
    	{
      		var tile = board.rows[r].cells[c];

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

  	for(var r = board.rows.length-1; r >= 0; r--) 
  	{
    	for(var c = 0; c < board.rows[r].cells.length; c++) 
    	{
      		var tile = board.rows[r].cells[c];

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

function clearHighlight(board) 
{
  	for(var r = 0; r < board.rows.length; r++) 
  	{
    	for(var c = 0; c < board.rows[r].cells.length; c++) 
    	{
			var tile = board.rows[r].cells[c];

			if((r + c) % 2 === 0) 
	        	tile.className = "black square";
	      	else
	        	tile.className = "white square";
    	}
  	}
}

function clearSelection(board) 
{
  	for(var r = 0; r < board.rows.length; r++) 
  	{
	    for(var c = 0; c < board.rows[r].cells.length; c++) 
	    {
	      	var tile = board.rows[r].cells[c];
	      	var piece = tile.firstChild;

	      	if(piece !== null && piece.className.indexOf(" selected") > -1) 
	        	piece.className = piece.className.replace(" selected", "");
	    }
  	}
}
function clearCaptureHighlight(board) 
{
  	for(var r = 0; r < board.rows.length; r++) 
  	{
	    for(var c = 0; c < board.rows[r].cells.length; c++) 
	    {
	      	var tile = board.rows[r].cells[c];
	      	var piece = tile.firstChild;

	      	if(piece !== null && piece.className.indexOf(" for_capture") > -1) 
	        	piece.className = piece.className.replace(" for_capture", "");
	    }
  	}
}

function pieceHighlightPossibleMoves() 
{
	if(!selection_lock)
  	{
  		var board = document.getElementById("board");
  		clearHighlight(board);
  		clearSelection(board);
  		clearCaptureHighlight(board);
  	
  	  	if(capture_avalable)
  	  		highlightCaptures.call(this, board)
  	  	else
  	  		highlightMoves.call(this, board);
  	}
  	
}

function highlightCaptures(board)
{
	var r = this.parentNode.parentNode.rowIndex;
  	var c = this.parentNode.cellIndex;
  	var size_x = board.rows.length;
  	var size_y = board.rows[r].cells.length;
  	var piece_color = checkTileContent(board, r, c);
  	var any_avalable = false;

  	if(piece_color === whose_turn) 
  	{
  		if(board.rows[r].cells[c].firstChild.className.indexOf(" selected") <= -1)
  			board.rows[r].cells[c].firstChild.className += " selected";
  		
	    if(checkIfTileExists(r - 1, c - 1, size_x, size_y) && checkTileContent(board, r - 1, c - 1) !== piece_color 
	    	&& checkTileContent(board, r - 1, c - 1) !== ColorType.NONE)
	    {
	    	if(checkIfTileExists(r - 2, c - 2, size_x, size_y) && checkTileContent(board, r - 2, c - 2) === ColorType.NONE)
	    	{
		    	board.rows[r - 1].cells[c - 1].firstChild.className += " for_capture";
			    board.rows[r - 2].cells[c - 2].className = "square for_capture";
			    any_avalable = true;
			}
	    }
	    if(checkIfTileExists(r - 1, c + 1, size_x, size_y) && checkTileContent(board, r - 1, c + 1) !== piece_color
	    	&& checkTileContent(board, r - 1, c + 1) !== ColorType.NONE)
	    {
	    	if(checkIfTileExists(r - 2, c + 2, size_x, size_y) && checkTileContent(board, r - 2, c + 2) === ColorType.NONE)
	    	{
		    	board.rows[r - 1].cells[c + 1].firstChild.className += " for_capture";
			    board.rows[r - 2].cells[c + 2].className = "square for_capture";
			    any_avalable = true;
			}
	    } 
		if(checkIfTileExists(r + 1, c - 1, size_x, size_y) && checkTileContent(board, r + 1, c - 1) !== piece_color
	    	&& checkTileContent(board, r + 1, c - 1) !== ColorType.NONE)
	    {
	    	if(checkIfTileExists(r + 2, c - 2, size_x, size_y) && checkTileContent(board, r + 2, c - 2) === ColorType.NONE)
	    	{
		    	board.rows[r + 1].cells[c - 1].firstChild.className += " for_capture";
			    board.rows[r + 2].cells[c - 2].className = "square for_capture";
			    any_avalable = true;
			}
	    }
		if(checkIfTileExists(r + 1, c + 1, size_x, size_y) && checkTileContent(board, r + 1, c + 1) !== piece_color
	    	&& checkTileContent(board, r + 1, c + 1) !== ColorType.NONE)
	    {
	    	if(checkIfTileExists(r + 2, c + 2, size_x, size_y) && checkTileContent(board, r + 2, c + 2) === ColorType.NONE)
	    	{
		    	board.rows[r + 1].cells[c + 1].firstChild.className += " for_capture";
			    board.rows[r + 2].cells[c + 2].className = "square for_capture";
			    any_avalable = true;
			}
	    }
	}

	return any_avalable;
}

function highlightMoves(board)
{
	var r = this.parentNode.parentNode.rowIndex;
  	var c = this.parentNode.cellIndex;
  	var size_x = board.rows.length;
  	var size_y = board.rows[r].cells.length;
  	var piece_color = checkTileContent(board, r, c);
  	var promotion_token = this.firstChild;
  	var is_promoted = (promotion_token !== null && promotion_token.className === "token promoted");
  	var moved = false;

  	if(piece_color === whose_turn) 
  	{
  		if(board.rows[r].cells[c].firstChild.className.indexOf(" selected") <= -1)
  			board.rows[r].cells[c].firstChild.className += " selected";

	  	if(piece_color === ColorType.WHITE || is_promoted)
	  	{
	    	if(checkIfTileExists(r - 1, c - 1, size_x, size_y) && checkTileContent(board, r - 1, c - 1) === ColorType.NONE)
				board.rows[r - 1].cells[c - 1].className = "avalable square";
	    	if(checkIfTileExists(r - 1, c + 1, size_x, size_y) && checkTileContent(board, r - 1, c + 1) === ColorType.NONE)
				board.rows[r - 1].cells[c + 1].className = "avalable square";
		}
		if(piece_color === ColorType.BLACK || is_promoted)
		{
		    if(checkIfTileExists(r + 1, c - 1, size_x, size_y) && checkTileContent(board, r + 1, c - 1) === ColorType.NONE) 
				board.rows[r + 1].cells[c - 1].className = "avalable square";
		    if(checkIfTileExists(r + 1, c + 1, size_x, size_y) && checkTileContent(board, r + 1, c + 1) === ColorType.NONE) 
				board.rows[r + 1].cells[c + 1].className = "avalable square";
	  	}
	}
}

function pieceAction()
{
	var board = document.getElementById("board");

	movePiece.call(this, board);
	capturePiece.call(this, board);
}

function movePiece() 
{
	var board = document.getElementById("board");

  	if(this.className.indexOf("avalable") > -1) 
  	{
    	var tile_under_selected = getTileUnderSelectedPiece(board);
    	var piece_to_move = tile_under_selected.firstChild;

    	this.appendChild(piece_to_move);

    	var row_index = this.parentNode.rowIndex;
	    if(row_index === 0 || row_index === 7)
    	{
    		var token = document.createElement("div");
    		token.className = "token promoted";
    		piece_to_move.appendChild(token);
    	}

    	clearHighlight(board);
    	clearSelection(board);
    	clearCaptureHighlight(board);
    	endTurn();
  	} 
}

function capturePiece(board)
{
	if(this.className.indexOf(" for_capture") > -1) 
  	{
  		selection_lock = true;

	    var tile_under_selected = getTileUnderSelectedPiece(board);
	    var piece_to_move = tile_under_selected.firstChild;
	    var tile_under_piece_for_capture = getTileUnderPieceForCapture(board);
	    var piece_for_capture = tile_under_piece_for_capture.firstChild;

	    tile_under_piece_for_capture.removeChild(piece_for_capture);
	    this.appendChild(piece_to_move);
	    capture_avalable = false;

	    var row_index = this.parentNode.rowIndex;
	    if(row_index === 0 || row_index === 7)
    	{
    		var token = document.createElement("div");
    		token.className = "token promoted";
    		piece_to_move.appendChild(token);

    		//after promotion turn ends
    		clearSelection(board);
	    	clearCaptureHighlight(board);
	    	endTurn();
	    	return;
    	}

	    clearHighlight(board);

	    if(!highlightCaptures.call(piece_to_move, board))
	    {
	    	selection_lock = false;
	    	clearSelection(board);
	    	clearCaptureHighlight(board);
	    	endTurn();
	    }
  	}
}

function getTileUnderSelectedPiece(board) 
{
  	for(var r = 0; r < board.rows.length; r++) 
  	{
    	for(var c = 0; c < board.rows[r].cells.length; c++) 
    	{
      		var tile = board.rows[r].cells[c];
      		var piece = tile.firstChild;

      		if(piece !== null && piece.className.indexOf(" selected") > -1)
        		return tile;
    	}
  	}
}

function getTileUnderPieceForCapture(board) 
{
  	for(var r = 0; r < board.rows.length; r++) 
  	{
	    for(var c = 0; c < board.rows[r].cells.length; c++) 
	    {
	      	var tile = board.rows[r].cells[c];
	      	var piece = tile.firstChild;

	      	if(piece !== null && piece.className.indexOf(" for_capture") > -1)
	        	return tile;
	    }
  	}
}

function checkIfTileExists(r, c, size_x, size_y) 
{
  	return r >= 0 && r < size_x && c >= 0 && c < size_y;
}

function checkTileContent(board, r, c) 
{
  	var content = board.rows[r].cells[c].firstChild;

  	if(content === null)
    	return ColorType.NONE;
  	else if(content.className.indexOf("white") > -1)
    	return ColorType.WHITE;
  	else if(content.className.indexOf("black") > -1)
    	return ColorType.BLACK;
  	return -1;
}

function checkIfCaptureAvalable(board)
{
	var output = false
	for(var r = 0; r < board.rows.length; r++) 
  	{
    	for(var c = 0; c < board.rows[r].cells.length; c++) 
    	{
      		var tile = board.rows[r].cells[c];
      		var piece = tile.firstChild;
      		var piece_color = checkTileContent(board, r, c);

      		if(piece !== null && piece_color === whose_turn && highlightCaptures.call(piece, board))
        		output = true;
    	}
  	}
  	clearHighlight(board);
	clearSelection(board);
	return output;
}

function endTurn() 
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

  	var board = document.getElementById("board");
  	capture_avalable = checkIfCaptureAvalable(board);
}
function rotateElement(name, turn) 
{
	if(whose_turn === ColorType.WHITE)
  		frame += 2;
  	else
  		frame -= 2;

  	document.getElementById(name).style.transform = "rotate(" + frame + "deg)";
  	if(frame % 180 === 0) 
  	{
	    frame %= 360;
	    clearInterval(interval_rotate);
	    in_progress = false;
  	}
}
