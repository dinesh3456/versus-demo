import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from '../abi.json';

const contractAddress = "0x8EEf2c25853D519a1133fEc8feCd12c89f73fC24";

function MatchmakingApp() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [playerInfo, setPlayerInfo] = useState(null);
    const [requiredWager, setRequiredWager] = useState('0');
    const [isRegistered, setIsRegistered] = useState(false);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [matchHistory, setMatchHistory] = useState([]);
  
    useEffect(() => {
      const init = async () => {
        if (typeof window.ethereum !== 'undefined') {
          try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const address = await signer.getAddress();
  
            setProvider(provider);
            setSigner(signer);
            setContract(contract);
            setAccount(address);
  
            updatePlayerInfo(address, contract);
            updateRequiredWager(contract);
          } catch (err) {
            console.error("Error initializing app:", err);
          }
        } else {
          console.log('Please install MetaMask!');
        }
      };
  
      init();
    }, []);
  
    const updatePlayerInfo = async (address, contract) => {
      try {
        const player = await contract.players(address);
        if (player.skillRating.toString() !== '0') {
          setIsRegistered(true);
          setPlayerInfo({
            skillRating: player.skillRating.toString(),
            balance: ethers.utils.formatEther(player.balance),
            lookingForMatch: player.lookingForMatch
          });
          updateCurrentMatch(address, contract);
          updateMatchHistory(address, contract);
        } else {
          setIsRegistered(false);
          setPlayerInfo(null);
        }
      } catch (err) {
        console.error("Error fetching player info:", err);
      }
    };
  
    const updateRequiredWager = async (contract) => {
      try {
        const wager = await contract.getRequiredWager();
        setRequiredWager(ethers.utils.formatEther(wager));
      } catch (err) {
        console.error("Error fetching required wager:", err);
      }
    };
  
    const updateCurrentMatch = async (address, contract) => {
      try {
        const opponent = await contract.currentMatches(address);
        if (opponent !== ethers.constants.AddressZero) {
          setCurrentMatch({ opponent });
        } else {
          setCurrentMatch(null);
        }
      } catch (err) {
        console.error("Error fetching current match:", err);
      }
    };
  
    const updateMatchHistory = async (address, contract) => {
      try {
        const matchIds = await contract.getPlayerMatches(address);
        const matchDetails = await Promise.all(
          matchIds.map(id => contract.getMatchDetails(id))
        );
        setMatchHistory(matchDetails);
      } catch (err) {
        console.error("Error fetching match history:", err);
      }
    };
  
    const registerPlayer = async () => {
      try {
        const tx = await contract.registerPlayer();
        await tx.wait();
        updatePlayerInfo(account, contract);
      } catch (err) {
        console.error("Error registering player:", err);
      }
    };
  
    const requestMatch = async () => {
      try {
        const wagerInWei = ethers.utils.parseEther(requiredWager);
        const tx = await contract.requestMatch({ value: wagerInWei });
        await tx.wait();
        updatePlayerInfo(account, contract);
      } catch (err) {
        console.error("Error requesting match:", err);
      }
    };
  
    const submitResult = async (winner, loser, matchId) => {
      try {
        const tx = await contract.submitResult(winner, loser, matchId);
        await tx.wait();
        updatePlayerInfo(account, contract);
      } catch (err) {
        console.error("Error submitting result:", err);
      }
    };
  
    const withdraw = async () => {
      try {
        const tx = await contract.withdraw();
        await tx.wait();
        updatePlayerInfo(account, contract);
      } catch (err) {
        console.error("Error withdrawing funds:", err);
      }
    };
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Versus Matchmaking Demo</h1>
        {account ? (
          <div>
            <p className="mb-2">Connected Account: {account}</p>
            {isRegistered ? (
              <div>
                {playerInfo && (
                  <div className="mb-4">
                    <p>Skill Rating: {playerInfo.skillRating}</p>
                    <p>Balance: {playerInfo.balance} ETH</p>
                    <p>Looking for Match: {playerInfo.lookingForMatch ? 'Yes' : 'No'}</p>
                  </div>
                )}
                <div className="mb-4">
                  <p>Required Wager: {requiredWager} ETH</p>
                  <button onClick={requestMatch} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
                    Request Match
                  </button>
                </div>
                <button onClick={withdraw} className="bg-yellow-500 text-white px-4 py-2 rounded">
                  Withdraw Balance
                </button>
                {currentMatch && (
                  <div className="mb-4 mt-4">
                    <h2 className="text-xl font-bold">Current Match</h2>
                    <p>Opponent: {currentMatch.opponent}</p>
                    <button
                      onClick={() => submitResult(account, currentMatch.opponent, matchHistory.length - 1)}
                      className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                    >
                      I Won
                    </button>
                    <button
                      onClick={() => submitResult(currentMatch.opponent, account, matchHistory.length - 1)}
                      className="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2"
                    >
                      I Lost
                    </button>
                  </div>
                )}
                <div className="mb-4 mt-4">
                  <h2 className="text-xl font-bold">Match History</h2>
                  {matchHistory.map((match, index) => (
                    <div key={index} className="mb-2">
                      <p>Match {index + 1}: {match.player1} vs {match.player2}</p>
                      {match.completed && (
                        <p>Winner: {match.winner === account ? 'You' : match.winner}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <button onClick={registerPlayer} className="bg-blue-500 text-white px-4 py-2 rounded">
                Register Player
              </button>
            )}
          </div>
        ) : (
          <p>Please connect your wallet to use this app.</p>
        )}
      </div>
    );
  }
  
  export default MatchmakingApp;