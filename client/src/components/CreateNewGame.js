import { Chess } from "chess.js";
import  React, {Component, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ChessBoard2 from "./ChessBoard";

export default class CreateNew extends Component {
 
      constructor(props) {
		super(props)
		this.state = {
            WagerAmount:111111,
            Player2Address:0,
            Player1Address:this.props.userAddress,
            GamePerTime:0,
            TimeoutTime:2
            
		}

       
	}

   createGame= async (e) => {
       console.log(this.state)
       console.log(e)
     this.props.sendCreateGame(this.state);
   }

//   handleSubmit = async (e) => {
//     //   this.preventDefault();
//    const contract = this.props.contract;
//    let create = await contract.methods.initializeGame(
//        this.state.Player2Address,
//        "0",
//        this.state.GamePerTime,
//        "0",
//        this.state.WagerAmount
//    ).send({ from: this.props.userAddress, value:this.state.WagerAmount })
//    .then(console.log(create))
   


//   }
    
  handleWageChange = (e) => {
    this.setState({WagerAmount: e.target.value})
  }

  handlePlayer2Change = (e) => {
    this.setState({Player2Address: e.target.value})
  }

  handleGamePerTimeChange = (e) => {
    this.setState({GamePerTime: e.target.value})
  }

  handleTimeoutTimeChange = (e) => {
      this.setState({TimeoutTime: e.target.value})
  }
    

    render() {
        if(this.props.blank.gState == "0") {
            return ( 
                <Container>
                    <Row className="justify-content-md-center"> 
                        <Col></Col>
                        <Col>
                    <h3> Create New Game</h3>
                        <Form style={{ width: '500px' }}>
                        <Form.Group className="mb-3" controlId="Player1Address">
                            <Form.Label>Player 1</Form.Label>
                            <Form.Control type="text readonly" value={this.props.userAddress}  readOnly />
                            <Form.Text className="text-muted">
                                Your current address
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Player2Address">
                            <Form.Label>Player 2</Form.Label>
                            <Form.Control type="text" placeholder="0x0000000000000000000000000000000000000000" onChange={this.handlePlayer2Change}/>
                            <Form.Text className="text-muted">
                                Your opponent's address
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="GamePerTime">
                            <Form.Label>Minutes Per Player </Form.Label>
                            {/* <Form.Range type="number" placeholder="5" /> */}
                            <Form.Control type="number" defaultValue="5" min="5" max="30" onChange={this.handleGamePerTimeChange}/>
                            <Form.Text className="text-muted">
                                Minutes per player between (min. 5 max. 30 )
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="WagerAmount">
                            <Form.Label>Wage Amount</Form.Label>
                            {/* <Form.Range type="number" placeholder="5" /> */}
                            <Form.Control type="number" step="100000" defaultValue="1000000" min="10000" max="3060000000000000000000000" onChange={this.handleWageChange}  />
                            <Form.Text className="text-muted">
                                Your half of the pot, in Wei. <br /> 
                                (1 ether = 1,000,000,000,000,000,000 wei ) <br />
                                Sorry about that. 
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="TimeoutTime">
                            <Form.Label>Max Acceptance Time</Form.Label>
                            {/* <Form.Range type="number" placeholder="5" /> */}
                            <Form.Control type="number" defaultValue="2" min="1" max="20" onChange={this.handleTimeoutTimeChange} />
                            <Form.Text className="text-muted">
                            Time limit in Minutes for Invited Player to Accept Game
                            </Form.Text>
                        </Form.Group>
                        
                            <Button variant="outline-dark" size="lg"  onClick={this.createGame}>
                                Create Game
                            </Button>
                        
                        </Form>
                        </Col>
                        <Col></Col>
                    </Row>
                    <br />
                </Container>
                
                )
        } else {
           return( 
               <ChessBoard2 />
            )
        }
        
    }

}
