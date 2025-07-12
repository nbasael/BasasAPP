import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CustomNumberPad } from '@/components/CustomNumberPad';
import { UndoButton } from '@/components/UndoButton';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { useGameStore } from '@/store/gameStore';

export default function BettingScreen() {
    const {
        players,
        currentBettingPlayerIndex,
        getCurrentRound,
        updateBid,
        advanceToNextBetter,
        goToPreviousBetter,
        completeBiddingPhase,
        getAllBidsEntered,
        isCurrentPlayerDealer,
        getAvailableBidsForDealer,
        dealerId,
        restartRound,
        endGameEarly,
        canUndo,
        undo,
        getLastAction,
        maxCards,
    } = useGameStore();

    const [currentBid, setCurrentBid] = useState(null);
    const currentRound = getCurrentRound();
    const currentPlayer = players[currentBettingPlayerIndex];
    const isDealer = isCurrentPlayerDealer();
    const allBidsEntered = getAllBidsEntered();

    useEffect(() => {
        if (allBidsEntered) {
            // Small delay to show the last bid before transitioning
            const timer = setTimeout(() => {
                completeBiddingPhase();
                router.replace('/game/tricks');
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [allBidsEntered]);

    const handleNumberPress = (number) => {
        setCurrentBid(number);
    };

    const handleBackspace = () => {
        setCurrentBid(null);
    };

    const handleConfirmBid = () => {
        if (currentBid === null) return;

        updateBid(currentPlayer.id, currentBid);
        setCurrentBid(null);

        if (!getAllBidsEntered()) {
            advanceToNextBetter();
        }
    };

    const handlePreviousPlayer = () => {
        // Clear current bid and go to previous player
        const previousPlayerIndex = currentBettingPlayerIndex === 0
            ? players.length - 1
            : currentBettingPlayerIndex - 1;

        const previousPlayer = players[previousPlayerIndex];
        const previousPlayerScore = currentRound.scores.find(
            score => score.playerId === previousPlayer.id
        );

        if (previousPlayerScore && previousPlayerScore.bid !== null) {
            // Clear the previous player's bid
            updateBid(previousPlayer.id, null);
            goToPreviousBetter();
            setCurrentBid(null);
        }
    };

    const handleRestartRound = () => {
        Alert.alert(
            translations.restartRoundTitle,
            translations.restartRoundMessage,
            [
                { text: translations.cancel, style: "cancel" },
                {
                    text: translations.restart,
                    style: "destructive",
                    onPress: () => {
                        restartRound();
                        setCurrentBid(null);
                    }
                }
            ]
        );
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
        const undoResult = undo();
        if (undoResult) {
            setCurrentBid(null);
        }
    };

    const getAvailableNumbers = () => {
        if (!isDealer) {
            // Non-dealer can bid any number from 0 to trump cards
            const maxBid = currentRound?.trumpCards || maxCards;
            return Array.from({ length: maxBid + 1 }, (_, i) => i);
        } else {
            // Dealer has restricted bids
            return getAvailableBidsForDealer();
        }
    };

    const getDealerName = () => {
        const dealer = players.find(p => p.id === dealerId);
        return dealer?.name || 'Desconocido';
    };

    const canGoToPreviousPlayer = () => {
        // Check if any previous player has a bid that can be undone
        for (let i = 0; i < players.length; i++) {
            const playerIndex = (currentBettingPlayerIndex - 1 - i + players.length) % players.length;
            const player = players[playerIndex];
            const playerScore = currentRound.scores.find(score => score.playerId === player.id);
            if (playerScore && playerScore.bid !== null) {
                return true;
            }
        }
        return false;
    };

    if (!currentRound || !currentPlayer) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>{translations.loading}</Text>
            </View>
        );
    }

    if (allBidsEntered) {
        return (
            <View style={styles.container}>
                <Card style={styles.completedCard}>
                    <Text style={styles.completedTitle}>{translations.allBidsPlaced}</Text>
                    <Text style={styles.completedText}>{translations.movingToTrickTracking}</Text>
                </Card>
            </View>
        );
    }

    const roundDescription = currentRound.isSpecial
        ? translations.specialRound
        : translations.trumpCards.replace('{count}', currentRound.trumpCards);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Card style={styles.headerCard}>
                <Text style={styles.roundTitle}>
                    {translations.round.replace('{number}', currentRound.roundNumber)}
                </Text>
                <Text style={styles.roundDescription}>{roundDescription}</Text>
                <Text style={styles.dealerInfo}>
                    {translations.dealer.replace('{name}', getDealerName())}
                </Text>
            </Card>

            <Card style={styles.playerCard}>
                <Text style={styles.playerTitle}>{translations.currentPlayer}</Text>
                <Text style={styles.playerName}>{currentPlayer.name}</Text>
                {isDealer && (
                    <Text style={styles.dealerWarning}>
                        {translations.dealerWarning.replace('{total}', currentRound.trumpCards || maxCards)}
                    </Text>
                )}
            </Card>

            <View style={styles.numberPadContainer}>
                <CustomNumberPad
                    value={currentBid}
                    onNumberPress={handleNumberPress}
                    onBackspace={handleBackspace}
                    onConfirm={handleConfirmBid}
                    availableNumbers={getAvailableNumbers()}
                />
            </View>

            <View style={styles.actions}>
                <View style={styles.undoContainer}>
                    <UndoButton
                        onPress={handleUndo}
                        disabled={!canUndo()}
                        lastAction={getLastAction()}
                    />
                </View>

                <View style={styles.actionRow}>
                    <Button
                        title={translations.previousPlayer}
                        variant="outline"
                        size="small"
                        onPress={handlePreviousPlayer}
                        disabled={!canGoToPreviousPlayer()}
                        style={styles.actionButton}
                    />
                    <Button
                        title={translations.restartRound}
                        variant="warning"
                        size="small"
                        onPress={handleRestartRound}
                        style={styles.actionButton}
                    />
                </View>

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
                        size="small"
                        onPress={handleEndGameEarly}
                        style={styles.actionButton}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 16,
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
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },
    roundDescription: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
    },
    dealerInfo: {
        fontSize: 16,
        color: colors.primary,
        textAlign: 'center',
        marginTop: 12,
        fontWeight: '600',
    },
    playerCard: {
        marginBottom: 16,
    },
    playerTitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    playerName: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.primary,
        textAlign: 'center',
        marginTop: 8,
    },
    dealerWarning: {
        fontSize: 14,
        color: colors.warning,
        textAlign: 'center',
        marginTop: 12,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    numberPadContainer: {
        marginVertical: 16,
    },
    actions: {
        marginTop: 16,
    },
    undoContainer: {
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    actionButton: {
        flex: 0.48,
    },
    completedCard: {
        alignItems: 'center',
        marginTop: 100,
    },
    completedTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.success,
        marginBottom: 12,
    },
    completedText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
});