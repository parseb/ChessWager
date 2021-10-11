[![My CI Pipeline](https://github.com/parseb/ChessWager/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/parseb/ChessWager/actions/workflows/main.yml) [![Add to Homescreen](https://img.shields.io/badge/Skynet-Add%20To%20Homescreen-00c65e?logo=skynet&labelColor=0d0d0d)](https://homescreen.hns.siasky.net/#/skylink/AABi5oObi10EacrTldI1iVauycKNN6CKqYYgO_ba5rPl3A)

https://00065pk3je5lq139pb9pbkhlh5batie2hkrq12l9gog3ntmqsqpubn0.siasky.net/

## __Chess Wager__
**Themes**: board game, confidence check
<br>

1 vs 1 game indulging the ego of friendly chess rivals by allowing them to stake on their chess prowess.

Every move is is signed and committed to a block. <br>
One player invites another address to a game and submits half of total wager. <br>
Address two accepts (or not) game and pays the other half. <br>
Game starts -> from the common pot a stream is started and continously adjusted as to reflect the on-board material advantage difference relative to the % of total game-time elapsed. (math overflow)

Guess... that's about it. 

<br>

### Known Unknows / Design Choices

* Asymetric denial of service - player 2 denying game nees to pay gas at this stage. Could be refunded out of game creator staked wager. Player 1 pays more gas than player 2... loose a lot -> loose a bit, DoS logic.

* Secret asymetric bet size (requires endgame state player cooperation?)
* No frontend option -> onchain state and execution (problem: material advantage and valid meoves calculated offchain... can be onchain.)
* Identity management (in-browser persistent authentication) (done)
* Storing moves onchain -> unnecessary overhead or worth it (partial history)

* Predeterined third party donation wallet options (EDRi, EFF, WWF) (maybe)  

<br>

### Problems
* Cheating (detection / escrow / blind peer review VS cheaters_be_cheating (it_is_what_it_is) VS cheat as ingame variable)


<br>


### Business model

<br>

### Variations

* Chess Engine (AI) vs Chess Engine (AI) competition with predefined category time limit. (don't think blocktime is an issue as long as they are hashed with submission time in queue - I def. don't yet understand this.)

<br>
### Supply chain 
*   [chess.js](https://github.com/jhlywa/chess.js.git)
<br />
*   [chessboard.js](https://github.com/oakmac/chessboardjs/)
<br>
