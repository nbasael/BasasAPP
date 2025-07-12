import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the round structure based on game rules
const createRoundStructure = (maxCards = 8) => {
    const rounds = [];

    // Ascending rounds (1 to maxCards)
    for (let i = 1; i <= maxCards; i++) {
        rounds.push({
            roundNumber: i,
            trumpCards: i,
            isSpecial: false,
            scores: [],
        });
    }

    // Special round (no preset trump)
    rounds.push({
        roundNumber: maxCards + 1,
        trumpCards: 0,
        isSpecial: true,
        scores: [],
    });

    // Descending rounds (maxCards to 1)
    for (let i = maxCards; i >= 1; i--) {
        rounds.push({
            roundNumber: (maxCards * 2 + 2) - i,
            trumpCards: i,
            isSpecial: false,
            scores: [],
        });
    }

    return rounds;
};

// Calculate score based on bid and tricks - FIXED for 0 bid success
const calculateScore = (bid, tricks) => {
    if (bid === null || tricks === null) return 0;
    // If bid matches tricks exactly, award 10 + tricks points
    // This correctly handles 0 bid + 0 tricks = 10 + 0 = 10 points
    return bid === tricks ? 10 + tricks : 0;
};

export const useGameStore = create()(
    persist(
        (set, get) => ({
            players: [],
            rounds: createRoundStructure(),
            currentRoundIndex: 0,
            gameStarted: false,
            gameCompleted: false,
            dealerId: null,
            currentBettingPlayerIndex: 0,
            biddingPhase: false,
            trickTrackingPhase: false,
            tricksRemaining: 0,
            maxCards: 8,
            gameHistory: [], // Store for undo functionality

            setPlayers: (players) => {
                const { maxCards } = get();
                const rounds = createRoundStructure(maxCards);

                // Initialize scores for each round
                rounds.forEach(round => {
                    round.scores = players.map(player => ({
                        playerId: player.id,
                        bid: null,
                        tricks: null,
                        score: 0,
                    }));
                });

                set({ players, rounds });
            },

            setMaxCards: (maxCards) => {
                set({ maxCards });
            },

            setDealer: (dealerId) => set({ dealerId }),

            startGame: () => {
                const { players, dealerId } = get();
                const dealerIndex = players.findIndex(p => p.id === dealerId);
                const firstBettingPlayerIndex = (dealerIndex + 1) % players.length;

                // Save initial state for undo
                const currentState = get();
                set({
                    gameStarted: true,
                    biddingPhase: true,
                    currentBettingPlayerIndex: firstBettingPlayerIndex,
                    gameHistory: [{ ...currentState, action: 'startGame', timestamp: Date.now() }]
                });
            },

            resetGame: () => {
                const { maxCards } = get();
                set({
                    players: [],
                    rounds: createRoundStructure(maxCards),
                    currentRoundIndex: 0,
                    gameStarted: false,
                    gameCompleted: false,
                    dealerId: null,
                    currentBettingPlayerIndex: 0,
                    biddingPhase: false,
                    trickTrackingPhase: false,
                    tricksRemaining: 0,
                    gameHistory: [],
                });
            },

            endGameEarly: () => {
                // Save state before ending game
                get().saveStateForUndo('endGameEarly');
                set({ gameCompleted: true, biddingPhase: false, trickTrackingPhase: false });
            },

            restartRound: () => {
                const { rounds, currentRoundIndex, players, dealerId } = get();

                // Save state before restarting
                get().saveStateForUndo('restartRound');

                const updatedRounds = [...rounds];

                // Reset current round scores
                updatedRounds[currentRoundIndex].scores = players.map(player => ({
                    playerId: player.id,
                    bid: null,
                    tricks: null,
                    score: 0,
                }));

                // Reset to betting phase
                const dealerIndex = players.findIndex(p => p.id === dealerId);
                const firstBettingPlayerIndex = (dealerIndex + 1) % players.length;

                set({
                    rounds: updatedRounds,
                    biddingPhase: true,
                    trickTrackingPhase: false,
                    currentBettingPlayerIndex: firstBettingPlayerIndex,
                    tricksRemaining: 0,
                });
            },

            updateBid: (playerId, bid) => {
                // Save state before updating bid
                get().saveStateForUndo('updateBid');

                const { rounds, currentRoundIndex } = get();
                const updatedRounds = [...rounds];
                const playerScoreIndex = updatedRounds[currentRoundIndex].scores.findIndex(
                    score => score.playerId === playerId
                );

                if (playerScoreIndex !== -1) {
                    updatedRounds[currentRoundIndex].scores[playerScoreIndex].bid = bid;
                    set({ rounds: updatedRounds });
                }
            },

            advanceToNextBetter: () => {
                const { players, currentBettingPlayerIndex } = get();
                const nextIndex = (currentBettingPlayerIndex + 1) % players.length;
                set({ currentBettingPlayerIndex: nextIndex });
            },

            goToPreviousBetter: () => {
                const { players, currentBettingPlayerIndex } = get();
                const prevIndex = currentBettingPlayerIndex === 0
                    ? players.length - 1
                    : currentBettingPlayerIndex - 1;
                set({ currentBettingPlayerIndex: prevIndex });
            },

            completeBiddingPhase: () => {
                // Save state before completing bidding
                get().saveStateForUndo('completeBiddingPhase');

                const { rounds, currentRoundIndex, maxCards } = get();
                const currentRound = rounds[currentRoundIndex];
                const tricksRemaining = currentRound.trumpCards || maxCards;

                set({
                    biddingPhase: false,
                    trickTrackingPhase: true,
                    tricksRemaining
                });
            },

            addTrick: (playerId) => {
                // Save state before adding trick
                get().saveStateForUndo('addTrick');

                const { rounds, currentRoundIndex, tricksRemaining } = get();
                const updatedRounds = [...rounds];
                const playerScoreIndex = updatedRounds[currentRoundIndex].scores.findIndex(
                    score => score.playerId === playerId
                );

                if (playerScoreIndex !== -1 && tricksRemaining > 0) {
                    const currentTricks = updatedRounds[currentRoundIndex].scores[playerScoreIndex].tricks || 0;
                    updatedRounds[currentRoundIndex].scores[playerScoreIndex].tricks = currentTricks + 1;

                    set({
                        rounds: updatedRounds,
                        tricksRemaining: tricksRemaining - 1
                    });
                }
            },

            removeTrick: (playerId) => {
                // Save state before removing trick
                get().saveStateForUndo('removeTrick');

                const { rounds, currentRoundIndex, tricksRemaining, maxCards } = get();
                const updatedRounds = [...rounds];
                const playerScoreIndex = updatedRounds[currentRoundIndex].scores.findIndex(
                    score => score.playerId === playerId
                );

                if (playerScoreIndex !== -1) {
                    const currentTricks = updatedRounds[currentRoundIndex].scores[playerScoreIndex].tricks || 0;
                    if (currentTricks > 0) {
                        updatedRounds[currentRoundIndex].scores[playerScoreIndex].tricks = currentTricks - 1;
                        const currentRound = rounds[currentRoundIndex];
                        const totalTricks = currentRound.trumpCards || maxCards;

                        set({
                            rounds: updatedRounds,
                            tricksRemaining: Math.min(tricksRemaining + 1, totalTricks)
                        });
                    }
                }
            },

            completeTrickTracking: () => {
                // Save state before completing trick tracking
                get().saveStateForUndo('completeTrickTracking');

                const { rounds, currentRoundIndex, players } = get();
                const currentRound = rounds[currentRoundIndex];

                // Calculate scores for this round
                const updatedRounds = [...rounds];
                updatedRounds[currentRoundIndex].scores.forEach(playerScore => {
                    playerScore.score = calculateScore(playerScore.bid, playerScore.tricks);
                });

                // Update total scores for all players
                const updatedPlayers = players.map(player => {
                    const playerRoundScore = currentRound.scores.find(
                        score => score.playerId === player.id
                    );

                    return {
                        ...player,
                        totalScore: player.totalScore + (playerRoundScore?.score || 0),
                    };
                });

                // Move to next round or complete game
                const isLastRound = currentRoundIndex === rounds.length - 1;

                // Rotate dealer for next round
                const { dealerId } = get();
                const currentDealerIndex = players.findIndex(p => p.id === dealerId);
                const nextDealerIndex = (currentDealerIndex + 1) % players.length;
                const nextDealerId = players[nextDealerIndex].id;
                const nextFirstBettingPlayerIndex = (nextDealerIndex + 1) % players.length;

                set({
                    players: updatedPlayers,
                    rounds: updatedRounds,
                    currentRoundIndex: isLastRound ? currentRoundIndex : currentRoundIndex + 1,
                    gameCompleted: isLastRound,
                    trickTrackingPhase: false,
                    biddingPhase: !isLastRound,
                    dealerId: isLastRound ? dealerId : nextDealerId,
                    currentBettingPlayerIndex: nextFirstBettingPlayerIndex,
                    tricksRemaining: 0,
                });
            },

            getCurrentRound: () => {
                const { rounds, currentRoundIndex } = get();
                return rounds[currentRoundIndex];
            },

            getPlayerScore: (playerId) => {
                const { players } = get();
                const player = players.find(p => p.id === playerId);
                return player?.totalScore || 0;
            },

            getRoundScores: (roundIndex) => {
                const { rounds } = get();
                return rounds[roundIndex]?.scores || [];
            },

            getAvailableBidsForDealer: () => {
                const { rounds, currentRoundIndex, players, dealerId, maxCards } = get();
                const currentRound = rounds[currentRoundIndex];
                const totalTricks = currentRound.trumpCards || maxCards;

                // Get sum of all other players' bids
                const otherPlayersBidsSum = currentRound.scores
                    .filter(score => score.playerId !== dealerId)
                    .reduce((sum, score) => sum + (score.bid || 0), 0);

                // The forbidden bid is the one that would make total equal to total tricks
                const forbiddenBid = totalTricks - otherPlayersBidsSum;

                // Return all possible bids except the forbidden one
                const availableBids = [];
                for (let i = 0; i <= totalTricks; i++) {
                    if (i !== forbiddenBid) {
                        availableBids.push(i);
                    }
                }

                return availableBids;
            },

            isCurrentPlayerDealer: () => {
                const { players, currentBettingPlayerIndex, dealerId } = get();
                return players[currentBettingPlayerIndex]?.id === dealerId;
            },

            getAllBidsEntered: () => {
                const { rounds, currentRoundIndex } = get();
                const currentRound = rounds[currentRoundIndex];
                return currentRound.scores.every(score => score.bid !== null);
            },

            // Enhanced Undo functionality
            saveStateForUndo: (action) => {
                const currentState = get();
                const { gameHistory } = currentState;
                const newHistory = [...gameHistory, {
                    ...currentState,
                    action,
                    timestamp: Date.now(),
                    // Don't include gameHistory in the saved state to avoid circular reference
                    gameHistory: undefined
                }];
                // Keep only last 20 states to prevent memory issues
                if (newHistory.length > 20) {
                    newHistory.shift();
                }
                set({ gameHistory: newHistory });
            },

            undo: () => {
                const { gameHistory } = get();
                if (gameHistory.length > 0) {
                    const previousState = gameHistory[gameHistory.length - 1];
                    const newHistory = gameHistory.slice(0, -1);

                    // Restore previous state but keep the new history
                    const { action, timestamp, ...stateToRestore } = previousState;
                    set({
                        ...stateToRestore,
                        gameHistory: newHistory,
                    });

                    return { action, timestamp };
                }
                return null;
            },

            canUndo: () => {
                const { gameHistory } = get();
                return gameHistory.length > 0;
            },

            getLastAction: () => {
                const { gameHistory } = get();
                if (gameHistory.length > 0) {
                    return gameHistory[gameHistory.length - 1].action;
                }
                return null;
            },
        }),
        {
            name: 'basas-game-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);