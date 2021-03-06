// SPDX-License-Identifier: MIT
//pragma solidity >=0.4.22 <0.9.0;
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

contract GameContract {

  //address owner3;
  address owner;
  address owner2;
  uint public gameId;
  
//////// Constructor 
//compiler requires public
  constructor() {
    owner= msg.sender;
    owner2= address(0x49A3e9f02E8b0a6076f8568361926D54d17730Cb);
    gameId=1;
  }

  //  function setNewOwner(address _newOwner) isOwner external {
  //    owner3= _newOwner;
  // }
/////// Constructor END
  uint[2] flowrate;

  enum gameState {NoAssignedState, Staged, InProgress, Ended, Rejected }
  
  struct gameSettings {
    uint totalTime;
    uint timeoutTime;
    uint wageSize; 
    uint gameBalance;
  }



  struct gameData {
    address playerOne;
    address playerTwo;
    gameState gState;
    string currentGameBoard;
    address lastMover;
    gameSettings settings;
    
    bool player2accepted;
    uint totalGameTime;
    uint p1Time;
    uint p2Time;
    uint[5] materialState;
    uint lastMoveTime;
    address firstToZero;
  }
  
  mapping (uint => gameData) public games; 
  mapping (address => uint) myLastGame;

///////////BulkHudiStart

  event newGameCreatedEvent(address indexed _playerOne, address indexed _playerTwo);

////// Modifiers Start 
  modifier isOwner() {
    require (msg.sender == owner|| msg.sender == owner2 , "Not an Owner");
    _; 
  }

  function otherPlayer(uint _gameId) view internal returns (address othr) {
    gameData memory thisGame = games[_gameId];
    require(myLastGame[msg.sender]== _gameId);
    if (thisGame.playerOne == msg.sender){
      othr = thisGame.playerTwo;
    } else {
      othr= thisGame.playerOne;
    }
  }  

  function onMoveStateCheck(uint _gameid ) internal view returns(bool) {
    //do not need it, do I?
    gameData memory game=games[_gameid];
    bool g= (  game.gState == gameState.InProgress || game.gState == gameState.Staged  );
    bool notLastMover = !(msg.sender == game.lastMover); 
    require( g && notLastMover , "Game State: Unavailable." );
    return true;
  }


  function noGameOnCreate(address player) internal view returns(bool) {
    gameData memory lastPlayerGame = games[myLastGame[player]]; 

    if( (lastPlayerGame.gState == gameState.Ended) || (lastPlayerGame.gState == gameState.NoAssignedState) || myLastGame[player] == 0 ){
      return true;
    } else {
      return false;
    }
  }
////// Modifiers END
  function initializeGame(address _playerTwo,
                          uint16 _totalTime,
                          uint _timeoutTime,
                          uint _wageSize,
                          string memory _currentGameBoard
                      ) public payable returns(uint justCreatedGameId) {
    
  
    games[gameId]= gameData({
                            playerOne: msg.sender,
                            playerTwo: _playerTwo,
                            gState: gameState.Staged,
                            currentGameBoard:_currentGameBoard,
                            lastMover: address(0),
                            settings: gameSettings ({
                                              totalTime: _totalTime,
                                              timeoutTime: _timeoutTime + block.timestamp,
                                              wageSize:  _wageSize,
                                              gameBalance: msg.value }), ///not decreasing
                             
                            player2accepted: false,
                            totalGameTime: 600,
                            p1Time: 300,
                            p2Time: 300,
                            materialState: [uint(1),uint(1),uint(1),uint(1),uint(1)],
                            lastMoveTime:0,
                            firstToZero: address(0)   
                            });
//playerTwo is always white

    require((noGameOnCreate(msg.sender) && noGameOnCreate(_playerTwo)), "One of the players has a game in progress.");
    myLastGame[msg.sender]= gameId;
    myLastGame[_playerTwo]= gameId;
    
    justCreatedGameId = gameId;
  
    emit newGameCreatedEvent(msg.sender,_playerTwo);
    gameId++;

    return gameId;
  }
  //getter function available as replacement
  function getLastGameId() public view returns(uint) {
    return gameId-1; 
  }

  function getGame(uint gId) public view returns(gameData memory )  {
      return games[gId];
  }
 
  function checkAndReturnCurrentGame() public view returns (gameData memory game) {
    game= games[myLastGame[msg.sender]];
   }

    event gameCanceled(address indexed submittedby, uint refundedAmount);


   function cancelGame() public payable {
     gameData memory game = games[myLastGame[msg.sender]];
     if((! game.player2accepted) && (game.settings.timeoutTime < block.timestamp) && (msg.sender == game.playerOne)) {
      myLastGame[game.playerOne]= 0;
      myLastGame[game.playerTwo]= 0; 
      uint refundAmount = game.settings.wageSize - (game.settings.wageSize / 99); 
      // a proper gas risk approch would be cool
      // case: player2 accept on player1 cancel? unlikely - possible?
      // a game balance mapping would be cool
      (bool success, ) = msg.sender.call{value:refundAmount}("");
      if(!success){
        revert();
      }
        

      emit gameCanceled(msg.sender, refundAmount);  
    }
   }

     function payCallerGameBalance(address caller) private returns( bool success) {
  
    uint howmuch = games[myLastGame[caller]].settings.gameBalance;
    games[myLastGame[msg.sender]].settings.gameBalance = 0;
  
    (success,) = msg.sender.call{value:howmuch}("");
      if (! success) {
        revert();
      }
  }


  
  event player2Accepted(address indexed _player1, address indexed _player2, bool _accepted);
  

  function playerTwoAccepted(bool _accepted) public payable  {
    if (! _accepted) {
      gameData storage game =  games[myLastGame[msg.sender]];
      require(game.playerTwo == msg.sender);
      game.player2accepted = false;
      game.gState = gameState.Rejected;

      myLastGame[game.playerOne]= 0;
      myLastGame[game.playerTwo]= 0;

      myLastGame[msg.sender] = 0; 

      emit player2Accepted(game.playerOne, game.playerTwo, false);
    } else {
      gameData storage game = games[myLastGame[msg.sender]];
      require(msg.value == game.settings.wageSize);
      require(game.playerTwo == msg.sender);
      game.player2accepted = true;
      game.gState = gameState.InProgress;
      game.settings.gameBalance += msg.value;

      emit player2Accepted(game.playerOne, game.playerTwo, true);
    }
  }
  
  function claculateStreamFlowRate(uint _availableBudget, 
                                uint _totalTimeRemaining,
                                uint[5] memory _materialShare)
                                internal returns( bool calculated) {
  uint p01Switch;

  if (otherPlayer(myLastGame[msg.sender]) == games[myLastGame[msg.sender]].playerTwo) {
    p01Switch = 0;
  } else {
    p01Switch = 1;
  }
  
  uint rawFlowRate= (uint(_availableBudget)*100 / uint(_totalTimeRemaining)*100) * (uint(_materialShare[p01Switch])*100 / (uint(_materialShare[2])*100));

  uint pswitch= p01Switch +3;
  // uint[2] memory pswitchFlowRate = ;
  // pswitchFlowRate.push(pswitch);
  // pswitchFlowRate.push(rawFlowRate);
  flowrate = [pswitch, rawFlowRate];

  calculated= true;                              
                           }
  
  event newMoveInGame(address indexed submittedby, address indexed otherPlayer, string indexed prevState, gameData current);

  function submitMove(string memory _submittedMove, uint[5] memory _material) public {

    string memory submitted = _submittedMove;
    require(games[myLastGame[msg.sender]].player2accepted, "Player2 did not accept yet.");
    require(onMoveStateCheck(myLastGame[msg.sender]));
    
    gameData storage game= games[myLastGame[msg.sender]]; 
    
    string memory prevState= string(game.currentGameBoard); //????
    game.materialState[0] = _material[0];
    game.materialState[1]= _material[1];
    game.materialState[2]=_material[2];  
   
    game.lastMover= msg.sender;
    game.currentGameBoard = submitted; 
    //game.materialState = _material;
    if( game.lastMoveTime > 0) {
      
    claculateStreamFlowRate(uint(game.settings.gameBalance), uint(game.totalGameTime), game.materialState);

      if(otherPlayer(myLastGame[msg.sender]) == game.playerTwo) {
      //  this is player1
        if ((block.timestamp - game.lastMoveTime) > game.p1Time) { 
          game.p1Time = 0;
          game.firstToZero = game.playerOne;
          // pay other player on 0
        } else {
          game.materialState[3] = game.materialState[flowrate[0]] + (flowrate[1] *  (block.timestamp - game.lastMoveTime));
          game.p1Time = game.p1Time - (block.timestamp - game.lastMoveTime);
          
        }
      
    } else {
      // this is player2
      if ((block.timestamp - game.lastMoveTime) > game.p2Time) { 
          game.p2Time = 0;
          game.firstToZero = game.playerTwo;
        } else {
          game.materialState[4] = game.materialState[flowrate[0]] + (flowrate[1] *  (block.timestamp - game.lastMoveTime));
          game.p2Time = game.p2Time - (block.timestamp - game.lastMoveTime);
        }
    }

         game.totalGameTime = game.p1Time + game.p2Time;
         
    
         //game.materialState[3] = game.materialState[flowrate[0]] + (flowrate[1] *  (block.timestamp - game.lastMoveTime));
         uint g= uint(game.settings.gameBalance) - ( flowrate[1] *  (block.timestamp - game.lastMoveTime));
         game.settings.gameBalance = g;
         
 

         
    } 
    
    game.lastMoveTime = block.timestamp; 

    


    emit newMoveInGame( msg.sender, otherPlayer(myLastGame[msg.sender]), string(prevState), game );


  ///calculate stream flowrate
    
  // claculateStreamFlowRate(game.settings.gameBalance, game.totalGameTime, game.materialState);
  
  /// starts / modifies stream 

  /// stop stream on low gamebalance
  
  }




event playerResigned(address indexed submittedby, address indexed OtherPlayer, address PlayerNotLastMovedThatResigned);

  function resignGame() public {
    
    if ( onMoveStateCheck(myLastGame[msg.sender]) ) {

      payCallerGameBalance(otherPlayer(myLastGame[msg.sender]));

      if (games[myLastGame[msg.sender]].settings.gameBalance == 0) {
        myLastGame[otherPlayer(myLastGame[msg.sender])] = 0;
        myLastGame[msg.sender]= 0;
      } else {
        revert("Something went wrong.");
      }
      emit playerResigned(msg.sender, otherPlayer(myLastGame[msg.sender]), msg.sender);   
    }
  
  }

  function otherPlayerTimedOut() public {
      // covers edge cases
      require( (otherPlayer(myLastGame[msg.sender]) == games[myLastGame[msg.sender]].firstToZero) ||  ( (games[myLastGame[msg.sender]].settings.timeoutTime < (block.timestamp + 60)) && (games[myLastGame[msg.sender]].lastMover == address(0)) ), "Adversary did not timeout yet");

      payCallerGameBalance(msg.sender);

      myLastGame[msg.sender] = 0;
      myLastGame[otherPlayer(myLastGame[msg.sender])] = 0;

  }
}
