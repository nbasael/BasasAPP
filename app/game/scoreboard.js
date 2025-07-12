import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { ScoreboardTable } from '@/components/ScoreboardTable';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { useGameStore } from '@/store/gameStore';

export default function ScoreboardScreen() {
    const {
        players,
        rounds,
        currentRoundIndex,
        gameCompleted,
        biddingPhase,
        trickTrackingPhase,
        resetGame,
    } = useGameStore();

    // Sort players by total score (highest first)
    const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

    const handleContinue = () => {
        if (biddingPhase) {
            router.replace('/game/betting');
        } else if (trickTrackingPhase) {
            router.replace('/game/tricks');
        } else if (gameCompleted) {
            router.replace('/game/results');
        } else {
            router.replace('/game/betting');
        }
    };

    const handleNewGame = () => {
        resetGame();
        router.replace('/game/setup');
    };

    const getContinueButtonTitle = () => {
        if (biddingPhase) return translations.continueBetting;
        if (trickTrackingPhase) return translations.continueTrickTracking;
        if (gameCompleted) return translations.viewResults;
        return translations.nextRound;
    };

    return (
        <View style={styles.container}>
            {gameCompleted ? (
                <View style={styles.winnerContainer}>
                    <Text style={styles.winnerLabel}>{translations.winner}</Text>
                    <Text style={styles.winnerName}>{sortedPlayers[0]?.name}</Text>
                    <Text style={styles.winnerScore}>
                        {translations.points.replace('{points}', sortedPlayers[0]?.totalScore)}
                    </Text>
                </View>
            ) : (
                <View style={styles.header}>
                    <Text style={styles.title}>{translations.currentStandings}</Text>
                    <Text style={styles.subtitle}>
                        {translations.afterRound
                            .replace('{current}', currentRoundIndex)
                            .replace('{total}', rounds.length)}
                    </Text>
                </View>
            )}

            <View style={styles.tableContainer}>
                <ScoreboardTable
                    players={sortedPlayers}
                    rounds={rounds}
                    currentRoundIndex={currentRoundIndex}
                />
            </View>

            <View style={styles.footer}>
                <Button
                    title={getContinueButtonTitle()}
                    onPress={handleContinue}
                    size="large"
                    style={styles.button}
                />

                {gameCompleted ? (
                    <Button
                        title={translations.newGame}
                        onPress={handleNewGame}
                        variant="secondary"
                        style={styles.button}
                    />
                ) : null}

                <Button
                    title={translations.backToHome}
                    onPress={() => router.replace('/')}
                    variant="outline"
                    style={styles.button}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 4,
    },
    winnerContainer: {
        alignItems: 'center',
        marginVertical: 16,
        padding: 24,
        backgroundColor: colors.success + '20',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.success + '40',
    },
    winnerLabel: {
        fontSize: 20,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    winnerName: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.success,
        marginBottom: 4,
    },
    winnerScore: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    tableContainer: {
        flex: 1,
        marginVertical: 16,
    },
    footer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    button: {
        marginBottom: 12,
    },
});