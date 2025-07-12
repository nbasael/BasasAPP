import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useHistoryStore = create()(
    persist(
        (set, get) => ({
            gameHistory: [],

            saveCompletedGame: (gameData) => {
                const { gameHistory } = get();
                const newGame = {
                    id: Date.now().toString(),
                    date: new Date().toISOString(),
                    players: gameData.players,
                    rounds: gameData.rounds,
                    totalRounds: gameData.rounds.length,
                    winner: gameData.players.reduce((prev, current) =>
                        (prev.totalScore > current.totalScore) ? prev : current
                    ),
                    maxCards: gameData.maxCards || 8,
                };

                set({ gameHistory: [newGame, ...gameHistory] });
            },

            clearHistory: () => {
                set({ gameHistory: [] });
            },

            deleteGame: (gameId) => {
                const { gameHistory } = get();
                set({ gameHistory: gameHistory.filter(game => game.id !== gameId) });
            },

            getGameById: (gameId) => {
                const { gameHistory } = get();
                return gameHistory.find(game => game.id === gameId);
            },
        }),
        {
            name: 'basas-history-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);