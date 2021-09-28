import React, {Component} from "react";
import {Col, Row, Container} from "react-bootstrap";

export default class ChessTitle extends Component {
  constructor() {
    super();
  }
    render(){
        return(
            <Container>
            <Col></Col>
            <Col>
            <div className="Title" style={{padding:20, fontFamily: 'monospace'}}>
            
              <Row><h3>♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖ </h3></Row>
              <Row><h3>♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙</h3></Row>
              <Row><h1> Chess Wager </h1></Row>
              <Row><h3>♟︎ ♟︎ ♟︎ ♟︎ ♟︎ ♟︎ ♟︎ ♟︎</h3></Row>
              <Row><h3>♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜</h3></Row>
              
            </div>
            </Col>
            <Col></Col>
            <hr style={{
            color: "black",
            height: 3
        }}/>
            </Container>
        )}
}