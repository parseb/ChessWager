import React, { Component } from "react";
import Countdown from 'react-countdown';

import getWeb3 from "./getWeb3";
import  Chess  from 'chess.js';

import HomeFooter from "./components/HomeFooter";
import ChessTitle from  "./components/ChessTitle";
import "./App.css";
import { Container, Row, Spinner, Col, Button, Card, ProgressBar }  from 'react-bootstrap';
import GameContract from "./contracts/GameContract.json";
import CreateNew from "./components/CreateNewGame";

import ChessBoardComponent from "./components/ChessBoardComponent";

class App extends Component {
  constructor() {
  super()
  this.state = { 
             web3: null, 
             accounts: null, 
             contract: null,
             gamesTotalCount: 0,
             openGamesList: [],
             currentGame: '',
             currentGameBoard:new Chess().fen(),
             color: "black",
             g_state:"0",
             stableTimeleft:0
            }
  }
  

  componentDidMount = async () => {
    try {

      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = GameContract.networks[networkId];
      const instance = new web3.eth.Contract(
        GameContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance });


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

    this.getGameCount();
      
    this.getCurrentGame();

    this.eventListen(); 
  }

  getGameCount = async () => {
    let contract  = this.state.contract;
    let count = await contract.methods.getLastGameId().call();
    this.setState({gamesTotalCount: count});
  }

  getCurrentGame = async () => {
    const { accounts, contract, web3js } = this.state;
    const currentgame = await this.state.contract.methods.checkAndReturnCurrentGame().call();
<<<<<<< HEAD
    // let color= this.state.currentGame[1] == this.state.accounts[0] 
    // if (color) { this.setState({ color:"black" })}
    //let playcolor = (currentgame.Player2Address == accounts[0]) ? ("white") : ("black") 
    this.setState({ currentGame: currentgame, currentGameBoard: currentgame.currentGameBoard, g_state: currentgame.gState });
=======
    //let color= this.state.currentGame[1] == accounts[0] 
    //if (color) { this.setState({ color:"white" })}
    let playcolor = (currentgame.Player2Address == accounts[0]) ? ("white") : ("black") 
    this.setState({ currentGame: currentgame, currentGameBoard: currentgame.currentGameBoard, color: color, g_state: currentgame.gState });
>>>>>>> main
    console.log("this is current game")
    console.log(currentgame, currentgame.currentGameBoard, this.state.currentGameBoard); 

  }

  sendCreateGame = async (s) => {
  
    const { accounts, contract, web3js } = this.state;
    //s.WagerAmount = this.state.web3.utils.toWei(s.WagerAmount)
 
    let createCall= await contract.methods.initializeGame(s.Player2Address,s.GamePerTime,s.TimeoutTime,s.WagerAmount,new Chess().fen())
    .send({ from: accounts[0], value: s.WagerAmount })
  }

  acceptGameInvite= async () =>{
    console.log("clicked Accepted")
    const { accounts, contract, web3js } = this.state;
    await contract.methods.playerTwoAccepted(true)
    .send({from: accounts[0], value: this.state.currentGame.settings.wageSize});
    
    
    //this.setState({color:'white'})
  }

  declineGameInvite= async () =>{
    console.log("declined game invite")
    const { accounts, contract, web3js } = this.state;
    let createCall= await contract.methods.playerTwoAccepted(false)
    .send({from: accounts[0], value: 0});

  }

  submitsMove = async (f) =>{
    this.setState({currentGameBoard: f});
    let materialscore=[0,0,0];
    let numbers= ['1','2','3','4','5','6','7','8']
    const valsdict = {  'p':1, 'P':1,
                        'b':3, 'B':3, 
                        'n':3, 'N':3, 
                        'r':5, 'R':5,
                        'q':9, 'Q':9, '/':0, 'k':0, 'K': 0 
                      }
    let white= 0
    let black=0
    console.log("submitted move", f);
    const f2= f.split(" ")[0].split("")
    f2.forEach(c => {
      if (! parseInt(c)){
        if (c == c.toLowerCase()) {
          white += valsdict[c] 
        } else {
          black += valsdict[c] 
        }
      console.log(c, white, black)
      } 
    });

   
    materialscore=[white,black,white + black,1,1]
    console.log(white, black);
   // 'r1bqkbnr/pppp1ppp/8/4B3/8/8/PPP1PPPP/RN1QKBNR b KQkq - 0 4'
    
    await this.state.contract.methods.submitMove(f, materialscore).send({from: this.state.accounts[0]})
    // .then(
    //   this.getCurrentGame()
    // )
    // this.eventListen();
  }

  resignGame = async () => {
    await this.state.contract.methods.resignGame().send({from: this.state.accounts[0]})
    this.setState({ g_state: "0" })
  }
  

  cancelGame = async () => {
    await this.state.contract.methods.cancelGame().send({from:this.state.accounts[0]});
    console.log("Cancel Game request sent")
  }

  otherPlayerTimedOut = async () => {
    await this.state.contract.methods.otherPlayerTimedOut().send({from:this.state.accounts[0]})
    console.log("Adversary timeout request submitted.")
  }


  eventListen= async () => {
    let contract  = await this.state.contract;
    console.log("CONNNTRRACTT", contract)

    contract.events.allEvents({
      //filter: {_otherPlayer: this.state.accounts[0]}, // Using an array means OR: e.g. 20 or 23
      // fromBlock: 'latest'
      
  }, async (error, event) => { 
    console.log('this is event', event); 
    // const { accounts, contract, web3js } = this.state;
    // const currentgame = await this.state.contract.methods.checkAndReturnCurrentGame().call();
    // this.setState({ currentGame: currentgame, currentGameBoard: currentgame.currentGameBoard });
    // console.log("id did set state:", this.state.currentGameBoard )
  })
  
  //this.checkAndReturnCurrentGame();//////////!!!!!!!!!!!!!!!
  
  
  .on("connected", function(subscriptionId){
      console.log(subscriptionId);
  })
  .on('data', async (event) => {
      
      console.log(event); 
      if (event.event === "newMoveInGame") {
        const currentgame = await this.state.contract.methods.checkAndReturnCurrentGame().call();
        this.setState({ currentGame: currentgame, currentGameBoard: currentgame.currentGameBoard });
        console.log("NewMove Event - state:", this.state.currentGameBoard );
        console.log("returned game", event.returnValues)
      }

      if(event.event === "newGameCreatedEvent") {
        const currentgame = await this.state.contract.methods.checkAndReturnCurrentGame().call();
        this.setState({ currentGame: currentgame, currentGameBoard: currentgame.currentGameBoard });
        console.log("NewGame Event - state:", this.state.currentGameBoard )
      }

      if(event.event === "player2Accepted") {
        //accord= event.returnValues._accepted;
        const currentgame = await this.state.contract.methods.checkAndReturnCurrentGame().call();
        this.setState({ currentGame: currentgame, currentGameBoard: currentgame.currentGameBoard });
        console.log("Player Accept - state:",event.returnValues._accepted ,this.state.currentGameBoard )
      }

      if(event.event === "playerResigned") {
        console.log("Player " + event.returnValues[0]  + " Resigned")
        const currentgame = await this.state.contract.methods.checkAndReturnCurrentGame().call();
        this.setState({ currentGame: currentgame, currentGameBoard: currentgame.currentGameBoard, g_state: "0" });
        
      }

      if(event.event === "gameCanceled") {
        console.log("Game Cancelled")
        const currentgame = await this.state.contract.methods.checkAndReturnCurrentGame().call();
        this.setState({ currentGame: currentgame, currentGameBoard: currentgame.currentGameBoard, g_state: "0" });
        
      }
    
     
      
  })
  .on("newMoveInGame", function(e){
      console.log("in new move event", e);
      // this.setState({currentGameBoard : e.returnValues.nextState })

  })
  .on('error', function(error, receipt) {
      console.log("Error Event:", error)
  });
  
  // const currentgame = await this.state.contract.methods.checkAndReturnCurrentGame().call();
  // this.setState({ currentGame: currentgame });
  // console.log("in envents", currentgame)

  };
  
  render() {
  //chessb end
    const gamestates= {0:"Stateless", 1: "Staged", 2:"In Progress", 3: "Ended", 4: "Rejected"}
    const createGame=  () => {
      
      if((this.state.g_state === "0" || this.state.g_state === "4") && !this.state.currentGame.player2accepted ){
        return  <CreateNew contract={this.state.contract} sendCreateGame={this.sendCreateGame} blank={this.state.currentGame} userAddress={this.state.accounts[0]} /> 
      } else {
        return <ChessBoardComponent submitmove={this.submitsMove} currentboard={this.state.currentGameBoard} currentgame={this.state.currentGame} account={this.state.accounts[0]}  />
      }
    }

    const cancelGameButton= () => {
      // needed? maybe later
      if (this.state.currentGame[0] == this.state.accounts[0] && parseInt(this.state.currentGame[5][1]) < Date.now() && (this.state.g_state == "1" ) ) {
        return (
          <Row>
            <Button variant="outline-warning" size="lg"  onClick={this.cancelGame}>
             Cancel Game and get Refund <br /> 
            </Button>
          </Row>
        )
      }
    }

    const acceptGameButton = () => {
      if (this.state.currentGame[0] === this.state.accounts[0]) {
        return  ( <h6> Invite Accepted: {String(this.state.currentGame.player2accepted)} </h6>)
      } else if (this.state.currentGame[1] === this.state.accounts[0] && ( !this.state.currentGame.player2accepted)) {
          
        return(
      <Col>
        <Row> 
            
            <Col>
              <Button variant="outline-success" size="lg"  onClick={this.acceptGameInvite}>
                Accept Game  <br /> 
                Ξ { this.state.web3.utils.fromWei(this.state.currentGame.settings.wageSize, 'ether' )}
              </Button>
            </Col>
            <Col>
              <Button variant="outline-danger" size="lg"  onClick={this.declineGameInvite}>
                Decline Game <br />
                ❌
              </Button>
            </Col>
        </Row>
        <br />
        <Row>
          <p className="text text-muted">X minutes remaining to accept invite</p>
        </Row>
      </Col>
        )
      } else {
        return  ( <h6> Invite Accepted: {String(this.state.currentGame.player2accepted)} </h6>)
        //@# debt - refactor
      }
    }

    // const blackTurnStyle = (playeraddress) => {
    //   if (this.state.currentGame[7]){
    //     if (this.state.currentGame[4] !== playeraddress ) {
    //       return(
            
    //         <div className="thisplayer" color='white' backgroundColor='black' >
    //           {{playeraddress}}
    //         </div>
    //         )
    //     }
    //   }
    //   else {
    //     return ( playeraddress)
    //   }
    // }

    const otherPlayer = () => {
      if ( this.state.currentGame.gState === "0") { return "◪"  }
      else if( this.state.currentGame[0] === this.state.accounts[0] ) {
        return ( this.state.currentGame[1] )
      } else { return this.state.currentGame[0]}
    }

    const thisPlayer = () => {
      if ( this.state.currentGame.gState === "0") { 
        return "◩"  
      }
     else { return this.state.accounts[0]}
    }

    const resignGameButton= () => {
      if ((this.state.currentGame[4] !== this.state.accounts[0]) && parseInt(this.state.currentGame[2]) > 1 && ( this.state.currentGame[4] !== "0x0000000000000000000000000000000000000000")  ) 
      {
        return ( <Button variant="danger" size="lg" onClick={this.resignGame} > Resign </Button> )   
      }
    }

    const progressBar= () => {
      let thisplayer, other;
      if (this.state.currentGame.Player2Address == this.state.accounts[0]) {
       thisplayer = 0;
       other = 1;

      } else {
        thisplayer = 1;
        other = 0;
      
      }
      let colors= ["success", "black"]
      let gamebalance= (this.state.currentGame.settings.gameBalance / (this.state.currentGame.settings.wageSize*2)) *100;
      return(
        <ProgressBar>
            <ProgressBar striped variant={colors[thisplayer]} now={this.state.currentGame.materialState[thisplayer+3] / (this.state.currentGame.settings.wageSize*2) *100} key={1} />
            <ProgressBar variant="warning" now={gamebalance} key={2} />
            <ProgressBar striped variant={colors[other]} now={this.state.currentGame.materialState[other+3] / (this.state.currentGame.settings.wageSize*2) *100 } key={3} />
        </ProgressBar>
      )
    }
    
    const gameInfoCol = () => {
      if ( this.state.currentGame.gState > 0 ) {
        return (
          
          <Col xs lg="5">
            <Container> 
            <Card>
              <Card.Title> </Card.Title>
              <br />
              <Row>
                <h6> Game State: {gamestates[this.state.currentGame.gState]} </h6>
              </Row>
              <hr /> 
              <Row>
                {acceptGameButton()}
              </Row>
              <hr />
              <Row>
                <Col> {resignGameButton()}</Col>
                <Col>{cancelGameButton()}</Col>
              </Row>
              <hr />
              <Row>
               {claimTimeoutVictory()}
              </Row>
              <hr />
              <Row>
              {progressBar()}
              </Row>
            </Card>
            </Container>
            </Col> 
        )
      }
    }

    const otherPlayerCounter = () => {
      let isTurn = (this.state.currentGame[4] !== this.state.accounts[0]) && parseInt(this.state.currentGame[2]) > 1 && ( this.state.currentGame[4] !== "0x0000000000000000000000000000000000000000")
      // if (this.state.color === "black" && !isTurn)   
      // {
      //   return ( <Countdown date={Date.now() + parseInt(this.state.currentGame[8]) * 1000 } /> )
      // }
      //   else if (this.state.color === "white" && !isTurn)
      // {
      //   return ( <Countdown date={Date.now() + parseInt(this.state.currentGame[9]) * 1000 } /> )
      // }
      if (this.state.currentGame[4] !== "0x0000000000000000000000000000000000000000") {
        if (this.state.currentGame[1] === this.state.accounts[0]) { 
          
          let minutes = Math.floor(parseInt(this.state.currentGame[9]) / 60)
          let secs= parseInt(this.state.currentGame[9]) - minutes * 60
          return( <p>{minutes}:{secs}</p>)
        } else {
          
          let minutes = Math.floor(parseInt(this.state.currentGame[8]) / 60)
          let secs= parseInt(this.state.currentGame[8]) - minutes * 60
          return( <p>{minutes}:{secs}</p>)
        }
      }
      
    }

    const claimTimeoutVictory = () => {
      if (parseInt(this.state.currentGame[8])< 1 || parseInt(this.state.currentGame[9]) < 1) {
        if(this.state.accounts[0] !== this.state.currentGame.settings.firstToZero) {
          return( 
            <Button variant="warning" size="lg" onClick={this.otherPlayerTimedOut} > Flag Oponent (time elapsed) </Button> 
          )
        }
      }
    }

    const thisPlayerCounter = () => {
      let isTurn = (this.state.currentGame[4] !== this.state.accounts[0]) && parseInt(this.state.currentGame[2]) > 1 && ( this.state.currentGame[4] !== "0x0000000000000000000000000000000000000000")
      if (this.state.color === "black" && isTurn) {
        return ( <Countdown date={Date.now() + parseInt(this.state.currentGame[8]) * 1000 } /> )
      } else if (this.state.color === "white" && isTurn)
      {
        return ( <Countdown date={Date.now() + parseInt(this.state.currentGame[9]) * 1000 } /> )  
      }
    }
    

     if (!this.state.web3) {
       return (  
         <Container>
           <Row id='loading spinners'> 
              <Spinner animation="grow" variant="danger"  />
              <Spinner animation="grow" variant="warning" />
              <Spinner animation="grow" variant="primary" />
              <Spinner animation="grow" variant="secondary" />
              <Spinner animation="grow" variant="success" />
              <Spinner animation="grow" variant="danger" />
              <Spinner animation="grow" variant="warning" />
              <Spinner animation="grow" variant="info" />
           </Row>
           <br />
          <h3> Loading Web3, accounts, and contract...   </h3>
         </Container>
            );
     }

    return (
      
        <div className="App">
          <Container>
          <ChessTitle />
          <Row> 
            <Col>
            <Card>
              
              { otherPlayer() } <br />
              { otherPlayerCounter()}
           
           
            <hr />
            <Row>
              <Col>  </Col>
              <Col>{createGame()}</Col>
              <Col>  </Col>
              </Row>
              <hr />
              { thisPlayerCounter() }
              { thisPlayer() }
           
            </Card>
            </Col>
            { gameInfoCol() }     
            <br />
          </Row>
          {/* get user account accounts[0] might return wrong one --check @#TODO */}
          <HomeFooter state={this.state} />
          </Container>
        </div>
    );
  }
}

export default App;


