import React, { Component } from 'react';
//import { useState } from 'react';
import  Chess  from 'chess.js';
//const { Chess } = require('./chess.js')
import { Chessboard } from 'react-chessboard';
import { Col, Container, Row } from 'react-bootstrap';


export default class ChessBoardComponent extends Component{
  
    constructor(props) {
		super(props)
		this.state = {
            gameb: new Chess(),
            //fen: new Chess().fen()
            fen: this.props.currentboard,
		}
    }
  //const [game, setGame] = useState(new Chess());

  componentDidMount() {
    if (this.props.currentboard == '') {
        this.setState({fen: new Chess().fen()})
        console.log("GOT EMPTY STRING PROP AS FEN", this.props.currentboard)
    }
      const game = new Chess(this.state.fen); 
        



      function safeGameMutate(modify) {
        this.setState({
           game: (g) => {
                const update = { ...g };
                modify(update);
                return update;
              }
        })
      }

    }




//   function makeRandomMove() {
//     const possibleMoves = game.moves();
//     if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return; // @@@@XXXX@!checkmate draw PossibleMoves.length
//     const randomIndex = Math.floor(Math.random() * possibleMoves.length);
//     safeGameMutate((game) => {
//       game.move(possibleMoves[randomIndex]);
//     });
//   }

  onDrop = (sourceSquare, targetSquare) => {
    console.log(sourceSquare, targetSquare)
    
    let move = null;
    let gamex= Chess(this.state.fen);
    
    move = gamex.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to a queen for example simplicity
      });

    if (move === null) {
      console.log("Illegal Move");
    } else {
        this.setState({ gameb: move, fen: gamex.fen()})
        //let move = String(this.state.game.fen());
        //state.setState({'moveToSubmit': move});
        console.log("submitted move", move, gamex.fen());
        
        //push.call();

        this.props.submitmove(gamex.fen());
   
    }
    //setTimeout(makeRandomMove, 200);
  }
  render() {
    return (
        <div>
          <br />
            <Chessboard position={this.state.fen} onPieceDrop={this.onDrop} /> 
          <br />
        </div> 
        )
}

}