import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { useGameStore } from '@/store/gameStore';
import { useHistoryStore } from '@/store/historyStore';

export default function ResultsScreen() {
    const { players, rounds, resetGame, maxCards } = useGameStore();
    const { saveCompletedGame } = useHistoryStore();

    // Sort players by total score (highest first)
    const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

    // Get podium players (top 3)
    const podiumPlayers = sortedPlayers.slice(0, 3);
    const remainingPlayers = sortedPlayers.slice(3);

    useEffect(() => {
        // Save the completed game to history
        if (players.length > 0) {
            saveCompletedGame({
                players: sortedPlayers,
                rounds,
                maxCards,
            });
        }
    }, []);

    const handleNewGame = () => {
        resetGame();
        router.replace('/game/setup');
    };

    const getPodiumPosition = (index) => {
        const positions = ['🥇', '🥈', '🥉'];
        return positions[index] || '';
    };

    const getPodiumHeight = (index) => {
        const heights = [140, 120, 100];
        return heights[index] || 80;
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Card style={styles.headerCard}>
                <Text style={styles.title}>{translations.finalResults}</Text>
                <Text style={styles.subtitle}>{translations.gameComplete}</Text>
            </Card>

            {/* Podium */}
            <Card style={styles.podiumCard}>
                <Text style={styles.podiumTitle}>{translations.topPlayers}</Text>
                <View style={styles.podium}>
                    {podiumPlayers.map((player, index) => (
                        <View key={player.id} style={styles.podiumPlayer}>
                            <Text style={styles.podiumPosition}>{getPodiumPosition(index)}</Text>
                            <View style={[
                                styles.podiumBar,
                                { height: getPodiumHeight(index) }
                            ]}>
                                <Text style={styles.podiumName}>{player.name}</Text>
                                <Text style={styles.podiumScore}>{player.totalScore}</Text>
                            </View>
                            <Text style={styles.podiumRank}>#{index + 1}</Text>
                        </View>
                    ))}
                </View>
            </Card>

            {/* Remaining Players */}
            {remainingPlayers.length > 0 && (
                <Card style={styles.remainingCard}>
                    <Text style={styles.remainingTitle}>{translations.otherPlayers}</Text>
                    {remainingPlayers.map((player, index) => (
                        <View key={player.id} style={styles.remainingPlayer}>
                            <Text style={styles.remainingRank}>#{index + 4}</Text>
                            <Text style={styles.remainingName}>{player.name}</Text>
                            <Text style={styles.remainingScore}>{player.totalScore} pts</Text>
                        </View>
                    ))}
                </Card>
            )}

            {/* Game Stats */}
            <Card style={styles.statsCard}>
                <Text style={styles.statsTitle}>{translations.gameStatistics}</Text>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>{translations.totalRounds}</Text>
                    <Text style={styles.statValue}>{rounds.length}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>{translations.maxCards}</Text>
                    <Text style={styles.statValue}>{maxCards}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>{translations.winnerLabel}</Text>
                    <Text style={styles.statValue}>{sortedPlayers[0]?.name}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>{translations.winningScore}</Text>
                    <Text style={styles.statValue}>{sortedPlayers[0]?.totalScore} puntos</Text>
                </View>
            </Card>

            <View style={styles.actions}>
                <Button
                    title={translations.newGame}
                    onPress={handleNewGame}
                    size="large"
                    style={styles.button}
                />
                <Button
                    title={translations.viewDetailedScoreboard}
                    variant="outline"
                    onPress={() => router.push('/game/scoreboard')}
                    style={styles.button}
                />
                <Button
                    title={translations.backToHome}
                    variant="outline"
                    onPress={() => router.replace('/')}
                    style={styles.button}
                />
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
    headerCard: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.primary,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: colors.textSecondary,
        marginTop: 8,
    },
    podiumCard: {
        marginBottom: 16,
    },
    podiumTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 20,
    },
    podium: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 180,
    },
    podiumPlayer: {
        alignItems: 'center',
        flex: 1,
    },
    podiumPosition: {
        fontSize: 28,
        marginBottom: 12,
    },
    podiumBar: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    podiumName: {
        color: colors.background,
        fontWeight: '700',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 4,
    },
    podiumScore: {
        color: colors.background,
        fontWeight: '800',
        fontSize: 20,
    },
    podiumRank: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textSecondary,
    },
    remainingCard: {
        marginBottom: 16,
    },
    remainingTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
    },
    remainingPlayer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    remainingRank: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textSecondary,
        width: 50,
    },
    remainingName: {
        fontSize: 16,
        color: colors.text,
        flex: 1,
        fontWeight: '600',
    },
    remainingScore: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
    statsCard: {
        marginBottom: 16,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    statLabel: {
        fontSize: 15,
        color: colors.textSecondary,
    },
    statValue: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },
    actions: {
        marginTop: 20,
    },
    button: {
        marginBottom: 16,
    },
});