// SPDX-License-Identifier: MIT
//pragma solidity >=0.4.22 <0.9.0;
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

contract GameContract {

  address owner3;
  address owner;
  address owner2;
  uint gameId;
  
//////// Constructor 
//compiler requires public
  constructor() {
    owner= msg.sender;
    owner2= address(0x49A3e9f02E8b0a6076f8568361926D54d17730Cb);
    gameId=1;
  }

   function setNewOwner(address _newOwner) isOwner external {
     owner3= _newOwner;
  }
/////// Constructor END
  
  enum gameState {NoAssignedState, Staged, InProgress, Ended, Rejected }
  
  struct gameSettings {
    uint16 startsAt;
    bool openInvite;
    uint totalTime;
    uint timeoutTime;
    uint wageSize;
    uint8 p1color;
    uint8 p2color; 
  }

  struct gameData {
    address playerOne;
    address playerTwo;
    gameState gState;
    string currentGameBoard;
    address lastMover;
    gameSettings settings;
    uint gameBalance;
    bool player2accepted;
  }
  
  mapping (uint => gameData) public games; 
  mapping (address => uint) myLastGame;
  address[32] gameOwners;
  address[32] gamePlayers;

  event newGameCreatedEvent(address indexed _playerOne, address indexed _playerTwo);

////// Modifiers Start 
  modifier isOwner() {
    require (msg.sender == owner|| msg.sender == owner2 || msg.sender == owner3, "Not an Owner");
    _; 
  }

  function otherPlayer(uint _gameId) view internal returns (address other) {
    gameData memory thisGame = games[_gameId];
    require(myLastGame[msg.sender]== _gameId);
    if (thisGame.playerOne == msg.sender){
      other= thisGame.playerTwo;
    } else {
      other= thisGame.playerOne;
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

  // function player2NotInAGame(uint _gameid) internal view returns (bool) {
  //   gameData memory game = games[_gameId];
  //   require(myLastGame[game.playerTwo] == 0, "Player Two already in a game");
  //   return true;
  // } 

  function noOtherGameOnCreate(address player) internal view returns(bool) {
    gameData memory lastPlayerGame = games[myLastGame[player]]; 

    if( (lastPlayerGame.gState == gameState.Ended) || (lastPlayerGame.gState == gameState.NoAssignedState) || myLastGame[player] == 0 ){
      return true;
    } else {
      return false;
    }
  }
////// Modifiers END
  function initializeGame(address _playerTwo,
                          uint16 _startsAt,
                          uint16 _totalTime,
                          uint _timeoutTime,
                          uint _wageSize,
                          string memory _currentGameBoard,
                          uint8 _p1color ,
                          uint8 _p2color) public payable returns(uint justCreatedGameId) {
    bool openGame;
  
    games[gameId]= gameData({
                            playerOne: msg.sender,
                            playerTwo: _playerTwo,
                            gState: gameState.Staged,
                            currentGameBoard:_currentGameBoard,
                            lastMover: address(0),
                            settings: gameSettings ({ startsAt: _startsAt,
                                              openInvite: openGame,
                                              totalTime: _totalTime,
                                              timeoutTime:  block.timestamp + _timeoutTime * 1 minutes,
                                              wageSize:  _wageSize, 
                                              p1color: _p1color,
                                              p2color: _p2color}),
                            gameBalance: msg.value,
                            player2accepted: false
                            });
//playerTwo is always white

    require((noOtherGameOnCreate(msg.sender) && noOtherGameOnCreate(_playerTwo)), "One of the players has a game in progress.");
    myLastGame[msg.sender]= gameId;
    myLastGame[_playerTwo]= gameId;
    
    justCreatedGameId = gameId;
  
    emit newGameCreatedEvent(msg.sender,_playerTwo);
    gameId++;

    return gameId;
  }

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
      require(success, "Refund failed.");  

      emit gameCanceled(msg.sender, refundAmount);  
    }
   }
  
  event player2Accepted(address indexed _player1, address indexed _player2, bool _accepted);
  
  function timeOutforAccept() public {}

  function playerTwoAccepted(bool _accepted) public payable  {
    if (! _accepted) {
      gameData storage game =  games[myLastGame[msg.sender]];
      require(game.playerTwo == msg.sender);
      game.player2accepted = false;
      game.gState = gameState.Rejected;
      //or cancel? w\ no refund?
      myLastGame[game.playerOne]= 0;
      myLastGame[game.playerTwo]= 0;
      //uint tenpercent = 
      myLastGame[msg.sender] = 0; 
      //(bool success,) = msg.sender.call.value(//%palyer1deposit/gascost)()
      //norefund for now.
      emit player2Accepted(game.playerOne, game.playerTwo, false);
    } else {
      gameData storage game = games[myLastGame[msg.sender]];
      require(msg.value == game.settings.wageSize);
      require(game.playerTwo == msg.sender);
      game.player2accepted = true;
      game.gState = gameState.InProgress;
      game.gameBalance += msg.value;

      emit player2Accepted(game.playerOne, game.playerTwo, true);
    }
  }
  
  
  
  event newMoveInGame(address indexed submittedby, address indexed otherPlayer, string indexed prevState, gameData current);

  function submitMove(string memory _submittedMove) public {
    string memory submitted = _submittedMove;
    require(games[myLastGame[msg.sender]].player2accepted, "Player2 did not accept yet.");
    gameData storage game= games[myLastGame[msg.sender]]; 
    
    string memory prevState= string(game.currentGameBoard);
    if(onMoveStateCheck(myLastGame[msg.sender])) {
      game.lastMover= msg.sender;
      game.currentGameBoard = submitted; 
    }
    address other = otherPlayer(myLastGame[msg.sender]); 
    emit newMoveInGame( msg.sender, other, string(prevState), game );
  }


event playerResigned(address indexed submittedby, address indexed otherPlayer, address OtherPlayerNotLastMovedThatResigned);

  function resignGame() public {
    gameData storage game = games[myLastGame[msg.sender]];
    
    if ( onMoveStateCheck(myLastGame[msg.sender]) ) {

      myLastGame[game.playerOne]= 0;
      myLastGame[game.playerTwo] = 0;
      //reverse order
      emit playerResigned(msg.sender, otherPlayer(myLastGame[msg.sender]), msg.sender);    
      
     
    }
  
  }

}
