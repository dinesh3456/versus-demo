// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract SkillBasedMatchmaking {
    struct Player {
        uint256 skillRating;
        uint256 balance;
        bool lookingForMatch;
    }

    struct Match {
        address player1;
        address player2;
        address winner;
        bool completed;
    }

    mapping(address => Player) public players;
    mapping(address => address) public currentMatches;
    address[] public waitingPlayers;
    Match[] public matches;
    mapping(address => uint256[]) public playerMatches;

    event MatchCreated(address player1, address player2, uint256 wagerAmount, uint256 matchId);
    event MatchResult(address winner, address loser, uint256 amount, uint256 matchId);

    function registerPlayer() external {
        require(players[msg.sender].skillRating == 0, "Player already registered");
        players[msg.sender] = Player(1000, 0, false);
    }

    function getRequiredWager() public pure returns (uint256) {
        return 0.01 ether; // Set a fixed wager amount
    }

    function requestMatch() external payable {
        require(players[msg.sender].skillRating > 0, "Player not registered");
        require(msg.value == getRequiredWager(), "Incorrect wager amount");

        players[msg.sender].balance += msg.value;
        players[msg.sender].lookingForMatch = true;

        waitingPlayers.push(msg.sender);

        address opponent = findOpponent(msg.sender);
        if (opponent != address(0)) {
            startMatch(msg.sender, opponent);
        }
    }

    function findOpponent(address player) internal view returns (address) {
        uint256 playerRating = players[player].skillRating;
        for (uint256 i = 0; i < waitingPlayers.length; i++) {
            address potentialOpponent = waitingPlayers[i];
            if (potentialOpponent != player && players[potentialOpponent].lookingForMatch) {
                uint256 opponentRating = players[potentialOpponent].skillRating;
                if (abs(int(playerRating - opponentRating)) <= 100) {
                    return potentialOpponent;
                }
            }
        }
        return address(0);
    }

    function startMatch(address player1, address player2) internal {
        currentMatches[player1] = player2;
        currentMatches[player2] = player1;
        players[player1].lookingForMatch = false;
        players[player2].lookingForMatch = false;
        
        uint256 matchId = matches.length;
        matches.push(Match(player1, player2, address(0), false));
        playerMatches[player1].push(matchId);
        playerMatches[player2].push(matchId);
        
        emit MatchCreated(player1, player2, getRequiredWager(), matchId);
    }

    function submitResult(address winner, address loser, uint256 matchId) external {
        require(currentMatches[winner] == loser, "No active match");
        require(currentMatches[loser] == winner, "No active match");
        require(matchId < matches.length, "Invalid match ID");
        require(!matches[matchId].completed, "Match already completed");
        require(matches[matchId].player1 == winner || matches[matchId].player2 == winner, "Winner not in this match");

        uint256 wagerAmount = getRequiredWager();

        players[winner].balance += wagerAmount;
        players[loser].balance -= wagerAmount;

        players[winner].skillRating += 20;
        players[loser].skillRating -= 20;

        currentMatches[winner] = address(0);
        currentMatches[loser] = address(0);

        matches[matchId].winner = winner;
        matches[matchId].completed = true;

        emit MatchResult(winner, loser, wagerAmount, matchId);
    }

    function withdraw() external {
        uint256 amount = players[msg.sender].balance;
        require(amount > 0, "No balance to withdraw");
        players[msg.sender].balance = 0;
        payable(msg.sender).transfer(amount);
    }

    function getPlayerMatches(address player) external view returns (uint256[] memory) {
        return playerMatches[player];
    }

    function getMatchDetails(uint256 matchId) external view returns (Match memory) {
        require(matchId < matches.length, "Invalid match ID");
        return matches[matchId];
    }

    function abs(int x) private pure returns (uint) {
        return x >= 0 ? uint(x) : uint(-x);
    }
}