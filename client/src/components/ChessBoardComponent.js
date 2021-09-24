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




  componentDidMount() {

    }

    componentWillReceiveProps(nextprops){

      this.setState({
          fen: nextprops.currentboard,
          game: new Chess(nextprops.currentboard),
          });
       
    }
  
  

  onDrop = (sourceSquare, targetSquare) => {
    console.log(sourceSquare, targetSquare)
    
    let move = null;
    let game= this.state.game
    console.log(game, "move not a function?")
    move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' //
      });

    if (move === null) {
      console.log("Illegal Move");
      console.log(game,move, game.turn())
      console.log("gamex :", game, "submitted:", game.fen(), "move:", move, "currentfen:",this.state.fen, this.state.game.turn())
    } else {
     
        
        // //push.call();
        console.log("gamex :", game, "submitted:", game.fen(), "move:", move, "currentfen:",this.state.fen)
        //this.setState({game: game})
        this.props.submitmove(game.fen());
        //this.setState({ game: game})
        
   
    }
    
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