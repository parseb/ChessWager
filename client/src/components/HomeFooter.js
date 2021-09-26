import React, { Component } from "react";
//import { Chessboard } from 'react-chessboard';
import { Container, Row, Button, Card, Col, Navbar  } from 'react-bootstrap';



export default class HomeFooter extends Component {


    render() {
       
        return (
            <Container>
                <br />
                <hr />
                <Row> 
                
                    <Col></Col>
                    
                    <Col>

                <Navbar float="bottom" >
                    <Card>
                        <Card.Title>?</Card.Title>
                        <Card.Body >
                            <p> 
                            Chess Wager is first of all an experiement in tweeking Chess gameplay. 
                            The aim here is to experiment with in-game time and material advantage
                            as determinants of a continously enacted win/loss ratio.   
                            </p> 
                            
                            <h6> Total games played: {this.props.state.gamesTotalCount} </h6>
                            
                            <hr />
                        </Card.Body>                     
                    </Card>
                </Navbar>
                    </Col>
                    <Col></Col>
                </Row>
            </Container> 
        ); 
        
    }
}

