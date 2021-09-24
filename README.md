

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
* Best game state for wager deposit (at creation and at join VS at end execution)
* Secret asymetric bet size (requires endgame state player cooperation?)
* No frontend option -> onchain state and execution
* Identity management (in-browser persistent authentication)
* Storing moves onchain -> unnecessary overhead or worth it
* Game parametes: {global_time_limit, on_move_time_increment, timeout_nomove, timeout_noshow, bet_size, color_random, third_party_address, player1_address, player2_address}
* Predeterined third party donation wallet options (EDRi, EFF, WWF)

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
*   [chessboard.js](https://github.com/oakmac/chessboardjs/)
<br>
