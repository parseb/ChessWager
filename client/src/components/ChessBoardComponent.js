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
            //fen: new Chess().fen()
            fen: this.props.currentboard,
            game: new Chess(this.props.currentboard),
            color:'black'
            
		}
    
   

  }


  //const [game, setGame] = useState(new Chess());

  componentDidMount() {
    // if (this.props.currentboard == '') {
    //     this.setState({fen: new Chess().fen()})
    //     console.log("GOT EMPTY STRING PROP AS FEN", this.props.currentboard)
        
    // }

   



      // let validfen= Chess.validate_fen(this.props.currentboard)
      // if (validfen) { console.log(this.props.currentboard, "fen is valid")}
      // else {console.log(this.props.currentboard, "THIS FEN IS INVALID")}
      // const game = new Chess().load(this.state.fen); 
      
      // const currentpostition= async () => {   return ( this.props.getcurrent()) }
      // let currentfen =  currentpostition.returnValues[3][3]
      // console.log(currentpostition)
      // this.setState({fen: currentfen })
      // function safeGameMutate(modify) {
      //   this.setState({
      //      game: (g) => {
      //           const update = { ...g };
      //           modify(update);
      //           return update;
      //         }
      //   })
      // }

    }

    componentWillReceiveProps(nextprops){

      this.setState({
          fen: nextprops.currentboard,
          game: new Chess(nextprops.currentboard),
          });
      // if (this.props.currentgame.playerTwo == this.props.account ) {
      //   this.setState({color: "white"})
      // } else {
      //   this.setState({color: "black"})
      //   console.log("I WASSS HHEEEEEEEEEEEEEEEEEEEEEEEEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEee", this.props.currentgame.playerTwo, this.props.account)
      // }    
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
    let game= this.state.game
    console.log(game, "move not a function?")
    move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to a queen for example simplicity
      });

    if (move === null) {
      console.log("Illegal Move");
      console.log(game,move, game.turn())
      console.log("gamex :", game, "submitted:", game.fen(), "move:", move, "currentfen:",this.state.fen, this.state.game.turn())
    } else {
        // this.setState({ gameb: move, fen: gamex.fen()})
        // //let move = String(this.state.game.fen());
        // //state.setState({'moveToSubmit': move});
        // console.log("submitted move", move, gamex.fen());
        
        // //push.call();
        console.log("gamex :", game, "submitted:", game.fen(), "move:", move, "currentfen:",this.state.fen)
        //this.setState({game: game})
        this.props.submitmove(game.fen());
        //this.setState({ game: game})
        
   
    }
    //setTimeout(makeRandomMove, 200);
  }
  render() {
   
    return (
        <div>
          <br />
            <Chessboard position={this.props.currentboard} onPieceDrop={this.onDrop} boardOrientation={this.props.color}	/> 
          <br />
        </div> 
        )
}

}