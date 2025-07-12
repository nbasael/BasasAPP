import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';

export const ScoreboardTable = ({ players, rounds, currentRoundIndex }) => {
    // Only show completed rounds
    const completedRounds = rounds.slice(0, currentRoundIndex);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.playerCell}>
                    <Text style={styles.headerText}>{translations.player}</Text>
                </View>
                {completedRounds.map((round, index) => (
                    <View key={`round-${index}`} style={styles.roundCell}>
                        <Text style={styles.headerText}>R{round.roundNumber}</Text>
                    </View>
                ))}
                <View style={styles.totalCell}>
                    <Text style={styles.headerText}>{translations.total}</Text>
                </View>
            </View>

            <ScrollView>
                {players.map((player) => (
                    <View key={player.id} style={styles.playerRow}>
                        <View style={styles.playerCell}>
                            <Text style={styles.playerName}>{player.name}</Text>
                        </View>

                        {completedRounds.map((round, index) => {
                            const playerScore = round.scores.find(score => score.playerId === player.id);
                            return (
                                <View key={`${player.id}-round-${index}`} style={styles.roundCell}>
                                    <Text style={styles.bidText}>
                                        {playerScore?.bid !== null ? playerScore?.bid : '-'}
                                    </Text>
                                    <Text style={styles.tricksText}>
                                        {playerScore?.tricks !== null ? playerScore?.tricks : '-'}
                                    </Text>
                                    <Text style={styles.scoreText}>{playerScore?.score || 0}</Text>
                                </View>
                            );
                        })}

                        <View style={styles.totalCell}>
                            <Text style={styles.totalScore}>{player.totalScore}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.card,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical: 16,
    },
    playerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
    },
    playerCell: {
        width: 100,
        paddingHorizontal: 12,
        paddingVertical: 16,
        justifyContent: 'center',
    },
    roundCell: {
        width: 60,
        paddingHorizontal: 4,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    totalCell: {
        width: 70,
        paddingHorizontal: 8,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: colors.background,
        fontWeight: '700',
        fontSize: 14,
        textAlign: 'center',
    },
    playerName: {
        color: colors.text,
        fontWeight: '600',
        fontSize: 14,
    },
    bidText: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    tricksText: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    scoreText: {
        color: colors.text,
        fontWeight: '600',
        fontSize: 14,
    },
    totalScore: {
        color: colors.primary,
        fontWeight: '800',
        fontSize: 16,
    },
});