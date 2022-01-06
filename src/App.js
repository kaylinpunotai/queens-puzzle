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

    const rowIndices = [  // all indices in each row
      [ 0,  1,  2,  3], 
      [ 4,  5,  6,  7],
      [ 8,  9, 10, 11],
      [12, 13, 14, 15]
    ]

    const colIndices = [  // all indices in each column
      [ 0,  4,  8, 12],
      [ 1,  5,  9, 13],
      [ 2,  6, 10, 14],
      [ 3,  7, 11, 15]
    ]

    const diagIndices = new Map([ // all indices in each diagonal
      [0,  [ 5, 10, 15]],
      [1,  [ 4,  6, 11]],
      [2,  [ 5,  7,  8]],
      [3,  [ 6,  9, 12]],
      [4,  [ 1,  9, 14]],
      [5,  [ 0,  2,  8, 10, 15]],
      [6,  [ 1,  3,  9, 11, 12]],
      [7,  [ 2, 10, 13]],
      [8,  [ 2,  5, 13]],
      [9,  [ 3,  4,  6, 12, 14]],
      [10, [ 0,  5,  7, 13, 15]],
      [11, [ 1,  6, 14]],
      [12, [ 3,  6,  9]],
      [13, [ 7,  8, 10]],
      [14, [ 4,  9, 11]],
      [15, [ 0,  5, 10]]
    ])

    var count = [];        // counter to store occupied pieces
    var errPieces = [];   // store indices of pieces that are in error
    var squares = this.state.squareStatus;    // get all square statuses
    const occupied = ["X", "E", "W"]  // values of occupied squares

    // check if more than one queen is in each row
    for (let row = 0; row < rowIndices.length; row++) {   // go through each row
      for (let i = 0; i < rowIndices[row].length; i++) {   // go through each index in a row
        var index = rowIndices[row][i];
        if (occupied.includes(squares[index])) {  // if the square is occupied, add to the piece count for the row
          count.push(index);
        }
      }
      if (count.length > 1) {  // if there are more than 1 pieces in a row, there is an error
        errPieces = errPieces.concat(count);  // add the counted pieces as errors
      }
      count = [];   // empty the counter array for the next check
    }

    // check if more than one queen is in each column
    for (let col = 0; col < colIndices.length; col++) {   // go through each column
      for (let i = 0; i < colIndices[col].length; i++) {   // go through each index in a column
        var index = colIndices[col][i];
        if (occupied.includes(squares[index])) {  // if the square is occupied, add to the piece count for the column
          count.push(index);
        }
      }
      if (count.length > 1) {  // if there are more than 1 pieces in a column, there is an error
        errPieces = errPieces.concat(count);  // add the counted pieces as errors
      }
      count = [];   // empty the counter array for the next check
    }

    // check if more than one queen is in each diagonal
    for (let i = 0; i < squares.length; i++) {   // go through each square
      if (occupied.includes(squares[i])) {  // if the square is occupied, get its diagonals
        var diag = diagIndices.get(i);    // get the diagonal indices of the square
        for (let d = 0; d < diag.length; d++) {
          var index = diag[d];
          if (occupied.includes(squares[index])) {  // if the diagonals are also occupied, add to both errors
            errPieces.push(i);
            errPieces.push(index);
          }
        }
      }
    }

    // adjust square values for for errors, non-errors, or winning
    for (let i = 0; i < squares.length; i++) { 
      if ((errPieces.length === 0) && (this.state.piecesPlaced === this.state.boardSize) && (occupied.includes(squares[i]))) {  // if all necessary pieces are placed and there are no errors, then user won
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
    this.checkPlacement();

    return (
      <div className="app">
        <div className="game-title">
          Queens Puzzle
        </div>
        <div className="game-description">
          Place queens on the chessboard without any of the pieces attacking another. A queen can move down the length of a column, row, and diagonal.
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
    )
  }
}

export default App;
