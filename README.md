# Versus Matchmaking Demo

## Overview

Versus Matchmaking Demo is a decentralized application (dApp) that demonstrates a skill-based matchmaking system for competitive gaming. Built on the Ethereum blockchain (Sepolia testnet), it allows players to register, request matches, compete, and earn rewards based on their performance.

## Features

- Player registration with initial skill rating
- Skill-based matchmaking
- Wagering system with fixed wager amounts
- Match result submission
- Player statistics tracking (skill rating, balance)
- Match history
- Withdrawal of earnings

## Technical Stack

- Blockchain: Ethereum (Sepolia Testnet)
- Smart Contract: Solidity
- Frontend: React.js
- Styling: Tailwind CSS
- Blockchain Interaction: ethers.js

## How It Works

1. **Player Registration**: 
   Users register as players, receiving an initial skill rating of 1000.

2. **Requesting a Match**: 
   Players can request a match by wagering a fixed amount of ETH (0.01 ETH). The system then looks for an opponent with a similar skill rating.

3. **Matchmaking**: 
   When two suitable players are found, a match is created. Both players are notified of their opponent.

4. **Match Outcome**: 
   After the match, players submit the result. The winner's skill rating and balance increase, while the loser's decrease.

5. **Match History**: 
   All matches are recorded on the blockchain, allowing players to view their match history.

6. **Withdrawing Earnings**: 
   Players can withdraw their earnings (balance) at any time.

## Smart Contract Functions

- `registerPlayer()`: Register a new player
- `requestMatch()`: Request a match and place a wager
- `submitResult(winner, loser, matchId)`: Submit the result of a match
- `withdraw()`: Withdraw balance
- `getPlayerMatches(player)`: Get a player's match history
- `getMatchDetails(matchId)`: Get details of a specific match

## Frontend Functionality

- Connect wallet (MetaMask)
- Register as a player
- View player information (skill rating, balance)
- Request a match
- Submit match results
- View current match
- View match history
- Withdraw balance

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure MetaMask for Sepolia testnet
4. Update the contract address in `MatchmakingApp.js`
5. Start the application: `npm start`

## Usage

1. Connect your MetaMask wallet to the application
2. Register as a player
3. Request a match by placing a wager
4. Wait for an opponent to be matched
5. Play your match off-chain
6. Submit the match result
7. View your updated skill rating and balance
8. Withdraw your earnings when desired

## Future Improvements

- Implement a more sophisticated skill rating system (e.g., Elo or Glicko-2)
- Add a dispute resolution mechanism for contested match results
- Implement a global leaderboard
- Extend support for multiple game types
- Optimize gas usage for scalability
- Implement additional security measures to prevent cheating

## Security Considerations

- This is a demo application and should not be used with real funds
- The smart contract has not been audited and may contain vulnerabilities
- Always interact with blockchain applications cautiously and understand the risks involved

## Contributing

Contributions to improve the Versus Matchmaking Demo are welcome. Please submit issues and pull requests on the project's GitHub repository.

## License

[MIT License](LICENSE)