import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { useGameStore } from '@/store/gameStore';

export default function DealerSelectionScreen() {
    const { players, setDealer, startGame } = useGameStore();
    const [selectedDealerId, setSelectedDealerId] = useState(null);

    const handleSelectDealer = (playerId) => {
        setSelectedDealerId(playerId);
    };

    const handleStartGame = () => {
        if (!selectedDealerId) return;

        setDealer(selectedDealerId);
        startGame();
        router.replace('/game/betting');
    };

    return (
        <View style={styles.container}>
            <Card>
                <Text style={styles.title}>{translations.selectDealer}</Text>
                <Text style={styles.description}>
                    {translations.dealerDescription}
                </Text>
            </Card>

            <ScrollView style={styles.playersContainer}>
                {players.map((player) => (
                    <Button
                        key={player.id}
                        title={player.name}
                        variant={selectedDealerId === player.id ? 'primary' : 'outline'}
                        style={styles.playerButton}
                        onPress={() => handleSelectDealer(player.id)}
                    />
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={translations.startGame}
                    onPress={handleStartGame}
                    disabled={!selectedDealerId}
                    size="large"
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
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    playersContainer: {
        flex: 1,
        marginVertical: 16,
    },
    playerButton: {
        marginBottom: 12,
    },
    footer: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
});