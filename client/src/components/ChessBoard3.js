import React, { Component } from 'react';
import { useState } from 'react';
import  Chess  from 'chess.js';
//const { Chess } = require('./chess.js')
import { Chessboard } from 'react-chessboard';
import { Col, Container, Row } from 'react-bootstrap';

export default class ChessBoard3 extends Component {
  
  
        
    
    
    
  
    

    componentWillMount() {
        console.log(new Chess())
        const [game, setGame] = useState(new Chess());
    }

    safeGameMutate = (modify) => {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
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
    console.log(sourceSquare, targetSquare, game.fen())

    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to a queen for example simplicity
      });
    });
    if (move === null) return; // illegal move
    //setTimeout(makeRandomMove, 200);
  }

  render(){

 return(
  
      
        <Chessboard position={game.fen()} onPieceDrop={onDrop} /> 
     
   
  )
}
}