import './App.css';
import React from 'react';

class Square extends React.Component {
  // Render individual board squares as buttons that show a placed piece when clicked
  render() {
    return (
      <button
        className = {this.props.shade}  // define the background shade of each square
        onClick = {this.props.onClick}
      >
        {this.props.pieceImg}
      </button>
    );
  }
}

class Board extends React.Component {
  // Render squares with a background shade and icon of the piece inside. 
  renderSquare(i, bgType) {   // int i = index of square; string bgType = className of the square's bg shade
    let piece = null;
    if (this.props.squares[i] === "X") {  // placed piece icon
      piece = (
        <img className = "queen-icon"
        src = "Images/queenIcon.png"/>
      );
    }
    if (this.props.squares[i] === "E") {  // error icon
      piece = (
        <img className = "queen-icon"
        src = "Images/errorIcon.png"/>
      );
    }
    if (this.props.squares[i] === "W") {  // win icon
      piece = (
        <img className = "queen-icon"
        src = "Images/winIcon.png"/>
      );
    }

    return (
      <Square
        shade = {bgType}
        pieceImg = {piece}
        onClick = {() => this.props.onClick(i)}
      />
    )
  }

  // Render the chessboard with alternating background shades
  render() {
    return (
      <div>
        <div className = "row1">
          {this.renderSquare(0, "lightSquare")}
          {this.renderSquare(1, "darkSquare")}
          {this.renderSquare(2, "lightSquare")}
          {this.renderSquare(3, "darkSquare")}
        </div>
        <div className = "row2">
          {this.renderSquare(4, "darkSquare")}
          {this.renderSquare(5, "lightSquare")}
          {this.renderSquare(6, "darkSquare")}
          {this.renderSquare(7, "lightSquare")}
        </div>
        <div className = "row3">
          {this.renderSquare(8, "lightSquare")}
          {this.renderSquare(9, "darkSquare")}
          {this.renderSquare(10, "lightSquare")}
          {this.renderSquare(11, "darkSquare")}
        </div>
        <div className = "row4">
          {this.renderSquare(12, "darkSquare")}
          {this.renderSquare(13, "lightSquare")}
          {this.renderSquare(14, "darkSquare")}
          {this.renderSquare(15, "lightSquare")}
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squareStatus: Array(4).fill(null),  // store status of each square
    };
  }

  squareClick(i) {    // int i = index of square;
    // when a square is clicked, add a piece if there's nothing inside and remove a piece if there's already a piece there
    var squares = this.state.squareStatus;    // get all square statuses
    const occupied = ["X", "E", "W"];   // values of occupied squares

    if (occupied.includes(squares[i])) {  // if the square already has a value, then clicking it again removes the value
      squares[i] = null;
    }
    else {  // else the square is empty, then place a piece there
      squares[i] = "X"; 
    }

    this.setState({
      squareStatus: squares,  // set new square status
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

    for (let i = 0; i < squares.length; i++) {
      if (errPieces.includes(i)) {  // set all pieces in error to E icon
        squares[i] = "E";
      }
      else if (occupied.includes(squares[i])) {
        squares[i] = "X";   // else, set all non-error pieces to X icon
      }
    }

    
  }

  render() {
    // render the game info and chessboard
    const squares = this.state.squareStatus;
    this.checkPlacement();
    return (
      <div className = "app">
        <div className = "game-title">
          Queens Puzzle
        </div>
        <div className = "game-description">
          Place queens on the chessboard without any of the pieces attacking another. A queen can move down the length of a column, row, and diagonal.
        </div>
        <div id="board">
          <Board
            squares = {squares}
            onClick = {(i) => this.squareClick(i)}
          />
        </div>
      </div>
    )
  }
}

export default App;
