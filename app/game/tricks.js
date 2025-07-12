import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PlayerCard } from '@/components/PlayerCard';
import { UndoButton } from '@/components/UndoButton';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { useGameStore } from '@/store/gameStore';

export default function TricksScreen() {
    const {
        players,
        getCurrentRound,
        addTrick,
        removeTrick,
        completeTrickTracking,
        tricksRemaining,
        endGameEarly,
        canUndo,
        undo,
        getLastAction,
        maxCards,
    } = useGameStore();

    const currentRound = getCurrentRound();

    const handlePlayerAddTrick = (playerId) => {
        if (tricksRemaining > 0) {
            addTrick(playerId);
        }
    };

    const handlePlayerRemoveTrick = (playerId) => {
        removeTrick(playerId);
    };

    const handleCompleteRound = () => {
        completeTrickTracking();
        router.replace('/game/scoreboard');
    };

    const handleEndGameEarly = () => {
        Alert.alert(
            translations.endGameEarlyTitle,
            translations.endGameEarlyMessage,
            [
                { text: translations.cancel, style: "cancel" },
                {
                    text: translations.endGame,
                    style: "destructive",
                    onPress: () => {
                        endGameEarly();
                        router.replace('/game/results');
                    }
                }
            ]
        );
    };

    const handleUndo = () => {
        undo();
    };

    const getPlayerTricks = (playerId) => {
        const playerScore = currentRound?.scores.find(score => score.playerId === playerId);
        return playerScore?.tricks || 0;
    };

    const getPlayerBid = (playerId) => {
        const playerScore = currentRound?.scores.find(score => score.playerId === playerId);
        return playerScore?.bid || 0;
    };

    if (!currentRound) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>{translations.loading}</Text>
            </View>
        );
    }

    const totalTricks = currentRound.trumpCards || maxCards;
    const allTricksAssigned = tricksRemaining === 0;

    return (
        <View style={styles.container}>
            <Card style={styles.headerCard}>
                <Text style={styles.roundTitle}>
                    {translations.round.replace('{number}', currentRound.roundNumber)} - {translations.trackTricks}
                </Text>
                <Text style={styles.tricksInfo}>
                    {translations.tricksRemaining.replace('{count}', tricksRemaining).replace('{total}', totalTricks)}
                </Text>
                <Text style={styles.instructionText}>
                    {translations.instructionText}
                </Text>
            </Card>

            <View style={styles.undoContainer}>
                <UndoButton
                    onPress={handleUndo}
                    disabled={!canUndo()}
                    lastAction={getLastAction()}
                />
            </View>

            <ScrollView style={styles.playersContainer}>
                {players.map((player) => (
                    <View key={player.id} style={styles.playerContainer}>
                        <View style={styles.playerInfo}>
                            <Text style={styles.playerBid}>
                                {translations.bid.replace('{bid}', getPlayerBid(player.id))}
                            </Text>
                        </View>
                        <PlayerCard
                            player={player}
                            tricks={getPlayerTricks(player.id)}
                            onAddTrick={() => handlePlayerAddTrick(player.id)}
                            onRemoveTrick={() => handlePlayerRemoveTrick(player.id)}
                            disabled={false}
                            showControls={true}
                        />
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                {allTricksAssigned ? (
                    <Button
                        title={translations.completeRound}
                        onPress={handleCompleteRound}
                        size="large"
                        style={styles.button}
                    />
                ) : (
                    <Text style={styles.remainingText}>
                        {translations.tricksRemainingCount.replace('{count}', tricksRemaining)}
                    </Text>
                )}

                <View style={styles.actionRow}>
                    <Button
                        title={translations.viewScoreboard}
                        variant="outline"
                        onPress={() => router.push('/game/scoreboard')}
                        style={styles.actionButton}
                    />
                    <Button
                        title={translations.endGameEarly}
                        variant="error"
                        onPress={handleEndGameEarly}
                        style={styles.actionButton}
                    />
                </View>
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
    loadingText: {
        color: colors.text,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    },
    headerCard: {
        marginBottom: 16,
    },
    roundTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },
    tricksInfo: {
        fontSize: 18,
        color: colors.primary,
        textAlign: 'center',
        marginTop: 12,
        fontWeight: '600',
    },
    instructionText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    undoContainer: {
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    playersContainer: {
        flex: 1,
    },
    playerContainer: {
        marginBottom: 8,
    },
    playerInfo: {
        alignItems: 'center',
        marginBottom: 4,
    },
    playerBid: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
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
    remainingText: {
        fontSize: 16,
        color: colors.primary,
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 0.48,
    },
});