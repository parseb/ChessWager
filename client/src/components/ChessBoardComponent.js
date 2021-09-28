import React, { Component } from 'react';
//import { useState } from 'react';
import  Chess  from 'chess.js';
//const { Chess } = require('./chess.js')
import { Chessboard } from 'react-chessboard';
import { Col, Container, Row, Card } from 'react-bootstrap';


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
    //console.log('game OVER: ', this.state.game.fen(), Chess(this.props.currentboard).fen())

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
    
    move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' //
      });
    
    if (game.game_over() ) {
      console.log('game OVER: ', game.game_over())

      //this.props.resign()
      alert("game over. please resign")
    }

    if (move === null) {
      console.log("Illegal Move");
      console.log("gamex :", game, "submitted:", game.fen(), "move:", move, "currentfen:",this.state.fen, this.state.game.turn())
      console.log('game OVER: ', game.game_over())
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
              <Card.Body >
              <Chessboard position={this.props.currentboard} onPieceDrop={this.onDrop} boardOrientation={this.props.color}	/>
              </Card.Body>                     
        )
}

}