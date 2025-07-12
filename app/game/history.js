import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Trash2, Calendar, Users, Trophy } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { useHistoryStore } from '@/store/historyStore';

export default function HistoryScreen() {
    const { gameHistory, clearHistory, deleteGame } = useHistoryStore();

    const handleClearHistory = () => {
        Alert.alert(
            translations.clearHistory,
            translations.clearHistoryMessage,
            [
                { text: translations.cancel, style: "cancel" },
                {
                    text: translations.clearAll,
                    style: "destructive",
                    onPress: clearHistory
                }
            ]
        );
    };

    const handleDeleteGame = (gameId, gameName) => {
        Alert.alert(
            translations.deleteGame,
            translations.deleteGameMessage.replace('{name}', gameName),
            [
                { text: translations.cancel, style: "cancel" },
                {
                    text: translations.delete,
                    style: "destructive",
                    onPress: () => deleteGame(gameId)
                }
            ]
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPlayerNames = (players) => {
        return players.slice(0, 3).map(p => p.name).join(', ') +
            (players.length > 3 ? ` +${players.length - 3} más` : '');
    };

    if (gameHistory.length === 0) {
        return (
            <View style={styles.container}>
                <Card style={styles.emptyCard}>
                    <Text style={styles.emptyTitle}>{translations.noGameHistory}</Text>
                    <Text style={styles.emptyText}>
                        {translations.noGameHistoryText}
                    </Text>
                </Card>
                <Button
                    title={translations.backToHome}
                    onPress={() => router.back()}
                    style={styles.backButton}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{translations.gameHistory}</Text>
                <Text style={styles.subtitle}>
                    {translations.gamesPlayed.replace('{count}', gameHistory.length)}
                </Text>
            </View>

            <ScrollView style={styles.gamesList}>
                {gameHistory.map((game) => (
                    <Card key={game.id} style={styles.gameCard}>
                        <View style={styles.gameHeader}>
                            <View style={styles.gameInfo}>
                                <View style={styles.gameRow}>
                                    <Calendar size={16} color={colors.textSecondary} />
                                    <Text style={styles.gameDate}>{formatDate(game.date)}</Text>
                                </View>
                                <View style={styles.gameRow}>
                                    <Users size={16} color={colors.textSecondary} />
                                    <Text style={styles.gamePlayers}>{getPlayerNames(game.players)}</Text>
                                </View>
                                <View style={styles.gameRow}>
                                    <Trophy size={16} color={colors.primary} />
                                    <Text style={styles.gameWinner}>
                                        {game.winner.name} ({game.winner.totalScore} pts)
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteGame(game.id, game.winner.name)}
                            >
                                <Trash2 size={20} color={colors.error} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.gameStats}>
                            <Text style={styles.statText}>
                                {game.totalRounds} {translations.rounds} • Máx {game.maxCards} {translations.cards}
                            </Text>
                        </View>
                    </Card>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={translations.clearAllHistory}
                    variant="error"
                    onPress={handleClearHistory}
                    style={styles.clearButton}
                />
                <Button
                    title={translations.backToHome}
                    variant="outline"
                    onPress={() => router.back()}
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
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 4,
    },
    gamesList: {
        flex: 1,
    },
    gameCard: {
        marginBottom: 12,
    },
    gameHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    gameInfo: {
        flex: 1,
    },
    gameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 8,
    },
    gameDate: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    gamePlayers: {
        fontSize: 14,
        color: colors.text,
        flex: 1,
    },
    gameWinner: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    deleteButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.surface,
    },
    gameStats: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    statText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
    footer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    clearButton: {
        marginBottom: 12,
    },
    emptyCard: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    backButton: {
        marginTop: 32,
    },
});