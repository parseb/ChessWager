import React from 'react';
import { useState } from 'react';
import  Chess  from 'chess.js';
//const { Chess } = require('./chess.js')
import { Chessboard } from 'react-chessboard';
import { Col, Container, Row } from 'react-bootstrap';


export default function ChessBoard2(context, state, submitM) {
  const [game, setGame] = useState(new Chess());

  

  function safeGameMutate(modify) {
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

  function onDrop(sourceSquare, targetSquare,context) {
    console.log(sourceSquare, targetSquare, game.fen(), context)
    
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to a queen for example simplicity
      });
    });


    if (move === null) {
      console.log("Illegal Move");
    } else {
      
        let move = String(game.fen());
        //state.setState({'moveToSubmit': move});
        console.log("submitted move", move, context);
        
        //push.call();
   
    }
    //setTimeout(makeRandomMove, 200);
  }

  return (
    <div>
      <br />
        <Chessboard position={game.fen()} onPieceDrop={onDrop} /> 
      <br />
    </div> 
    
  )
}