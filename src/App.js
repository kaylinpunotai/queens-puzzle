import './App.css';
import React from 'react';

class Square extends React.Component {
  // Render individual board squares as buttons that show a placed piece when clicked
  render() {
    return (
      <button
        className={this.props.shade}  // define the background shade of each square
        onClick={this.props.onClick}
      >
        {this.props.icon}
      </button>
    );
  }
}

class Board extends React.Component {
  // Render squares with a background shade and icon of the piece inside. 
  renderSquare(i, bgType) {   // int i = index of square; string bgType = className of the square's bg shade
    let icon = null;
    if (this.props.squares[i] === "X") {  // placed piece icon
      icon = (
        <img className="queen-icon"
        src="Images/queenIcon.png"/>
      );
    }
    else if (this.props.squares[i] === "E") {  // error icon
      icon = (
        <img className="queen-icon"
        src="Images/errorIcon.png"/>
      );
    }
    else if (this.props.squares[i] === "W") {  // win icon
      icon = (
        <img className="queen-icon"
        src="Images/winIcon.png"/>
      );
    }

    return (
      <Square
        key={i}
        shade={bgType}
        icon={icon}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  // Render the chessboard with alternating background shades
  render() {
    const size = this.props.boardSize;
    var board = []; // board will have this.state.boardSize items (columns) and each item will be an array of renderSquares of size this.state.boardSize (rows)

    for (let row = 0; row < size; row++) { // create a row of squares and push into board
      var squares = [];   // squares will contain the row of renderSquares
      for (let col = 0; col < size; col++) {
        let index = size * row + col;   // calculate the index of the current square
        if (size % 2 === 1) {   // if the board size is odd, then square will alternate between shades cleanly based on index even/oddness
          if (index % 2 === 0) {  // even number squares will be light-shaded
            squares.push(this.renderSquare(index, "lightSquare"));
          }
          else {  // odd number squares will be dark-shaded
            squares.push(this.renderSquare(index, "darkSquare"));
          }
        }
        else {  // else if the board size is even, then squares will alternate between shades based on if the index row and column is XOR even/odd
          if ((row % 2 === 0 || col % 2 === 0) && !(row % 2 === 0 && col % 2 === 0)) {  // if the index's row and col are XOR even, then the square will be dark-shaded
            squares.push(this.renderSquare(index, "darkSquare"));
          }
          else {  // else, the square will be light-shaded
            squares.push(this.renderSquare(index, "lightSquare"));
          }
        }
      }

      // once the row is done, push into board as a single item with <div> to separate from the next row
      board.push(
        <div key={row}>
          {squares}
        </div>
      );
    }

    return (
      <div>
        {board}
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSize: 4,       // changeable board size
      squareStatus: [],  // store status of each square
      piecesPlaced: 0,    // total # of pieces placed on the board
    };
  }

  squareClick(i) {    // int i = index of square;
    // when a square is clicked, add a piece if there's nothing inside and remove a piece if there's already a piece there
    var squares = this.state.squareStatus;    // get all square statuses
    var pieces = this.state.piecesPlaced;
    const occupied = ["X", "E", "W"];   // values of occupied squares

    if (occupied.includes(squares[i])) {  // if the square already has a value, then clicking it again removes the value
      squares[i] = null;
      pieces--;
    }
    else {  // else the square is empty, then place a piece there
      squares[i] = "X"; 
      pieces++;
    }

    this.setState({
      squareStatus: squares,  // set new square status
      piecesPlaced: pieces,   // set new # pieces
    });
  }

  checkPlacement() {
    // check to make sure only one queen occupies each row, colunn, and diagonal

    // for each square, map the other squares that would cause an error
    const boardSize = this.state.boardSize; // get the number of squares per length of the board
    const errorIndices = new Map(); // store the values of all indices that lead to an error if the key index piece is placed

    for (let index = 0; index < (boardSize ** 2); index++) {
      var err = [];   // store all error values for the index

      var indexRow = Math.floor(index / boardSize);    // get row of the index
      var indexCol = index - (indexRow * boardSize);   // get column of the index

      for (let x = 0; x < boardSize; x++) {
        // add all squares in the same row as index
        var sameRow = (indexRow * boardSize) + x;
        if (sameRow !== index) {  // to prevent adding index to error list
          err.push(sameRow);
        }

        // add all squares in the same column as index
        var sameCol = (x * boardSize) + indexCol;
        if (sameCol !== index) {  // to prevent adding index to error list
          err.push(sameCol);
        }

        // add all squares diagonal to the index
        var prevRow = indexRow - (x + 1); // get row numbers to the left of the index
        var nextRow = indexRow + (x + 1); // get row numbers to the right of the index
        var prevCol = indexCol - (x + 1); // get column numbers above the index
        var nextCol = indexCol + (x + 1); // get column numbers under the index

        if ((prevRow >= 0) && (prevCol >= 0)) {         // ifs are to make sure indices are within the boundaries of the board
          err.push((prevRow * boardSize) + prevCol);  // top-left

        }
        if ((prevRow >= 0) && (nextCol < boardSize)) {
          err.push((prevRow * boardSize) + nextCol);  // top-right
        }
        if ((nextRow < boardSize) && (prevCol >= 0)) {
          err.push((nextRow * boardSize) + prevCol);  // bottom-left
        }
        if ((nextRow < boardSize) && (nextCol < boardSize)) {
          err.push((nextRow * boardSize) + nextCol);  // bottom-right
        }
      }
      
      // add new map entry with key: index and value: err[]
      errorIndices.set(index, err);
    }

    var count = [];        // counter to store occupied pieces
    var errPieces = [];   // store indices of pieces that are in error
    var squares = this.state.squareStatus;    // get all square statuses
    const occupied = ["X", "E", "W"]  // values of occupied squares

    // check if there are any errors
    for (let i = 0; i < squares.length; i++) {   // go through each square
      if (occupied.includes(squares[i])) {  // if the square is occupied, get its list of indices that will cause an error
        var errs = errorIndices.get(i);    

        for (let d = 0; d < errs.length; d++) { // iterate thru the error list
          var errIndex = errs[d];  // get the index of the error
          if (occupied.includes(squares[errIndex])) {  // if the diagonals are also occupied, add to both the current square and the index that caused the error
            errPieces.push(i);
            errPieces.push(errIndex);
          }
        }
      }
    }

    
    // adjust square values for for errors, non-errors, or winning
    for (let i = 0; i < squares.length; i++) { 
      if ((errPieces.length === 0) && (this.state.piecesPlaced == boardSize) && (occupied.includes(squares[i]))) {  // if all necessary pieces are placed and there are no errors, then user won
        squares[i] = "W";
      }
      else if (errPieces.includes(i)) {         // set all pieces in error to E icon
        squares[i] = "E";
      }
      else if (occupied.includes(squares[i])) { // else, set all non-error pieces to X icon
        squares[i] = "X";
      }
    }
  }

  startOver() {
    // reset all squares to empty
    this.setState({
      squareStatus: [],
      piecesPlaced: 0,
    });
  }
  
  changeBoardSize(event) {
    // adjust board size and reset
    this.setState({
      boardSize: event.target.value
    })
    this.startOver();
  }

  render() {
    // render the game info and chessboard
    const squares = this.state.squareStatus;
    const piecesLeft = this.state.boardSize - this.state.piecesPlaced;
    this.checkPlacement();

    return (
      <div className="app">
        <div className="game-title">
          Queens Puzzle
        </div>
        <div className="game-description">
          Place queens on the chessboard without any of the pieces attacking another. A queen can move down the length of a column, row, and diagonal.
        </div>
        <div className="game-area">
          <div className="game-options">
            <div className="change-boardsize">
              Change Board Size:
              <div onChange={(event) => this.changeBoardSize(event)}>
                <label><input type="radio" value={4} name="boardsize" defaultChecked/>4x4</label><br/>
                <label><input type="radio" value={5} name="boardsize" />5x5</label><br/>
                <label><input type="radio" value={6} name="boardsize" />6x6</label><br/>
                <label><input type="radio" value={7} name="boardsize" />7x7</label><br/>
                <label><input type="radio" value={8} name="boardsize" />8x8</label><br/>
              </div>
            </div>
            <div>
              Remaining pieces: {piecesLeft}
            </div>
            <button id="restart-button" onClick={() => this.startOver()}>
              Start Over
            </button>
          </div>
          <div id="board">
            <Board
              squares={squares}
              onClick={(i) => this.squareClick(i)}
              boardSize={this.state.boardSize}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
