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
  renderSquare(i, bgType) {   // int i = index identifier; string bgType = className of the square's bg shade
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

  squareClick(squareIndex) {  
    // when a square is clicked, add a piece if there's nothing inside and remove a piece if there's already a piece there
    const squares = this.state.squareStatus;    // get all square statuses
    const values = ["X", "E", "W"];   // values of squares if a piece is inside

    if (values.includes(squares[squareIndex])) {  // if the square already has a value, then clicking it again removes the value
      squares[squareIndex] = null;
    }
    else {  // else the square is empty, then place a piece there
      squares[squareIndex] = "X"; 
    }

    this.setState({
      squareStatus: squares,  // set new square status
    });
  }

  render() {
    // render the game info and chessboard
    const squares = this.state.squareStatus;
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
