import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PlayerInput } from '@/components/PlayerInput';
import { NumberInput } from '@/components/NumberInput';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { useGameStore } from '@/store/gameStore';

export default function GameSetupScreen() {
    const { setPlayers, setMaxCards } = useGameStore();

    const [playerCount, setPlayerCount] = useState(3);
    const [playerNames, setPlayerNames] = useState(['', '', '']);
    const [maxCardsPerPlayer, setMaxCardsPerPlayer] = useState(8);
    const [errors, setErrors] = useState([]);

    const handlePlayerCountChange = (count) => {
        setPlayerCount(count);

        // Adjust player names array based on new count
        if (count > playerNames.length) {
            // Add empty names for new players
            setPlayerNames([...playerNames, ...Array(count - playerNames.length).fill('')]);
        } else {
            // Remove names for removed players
            setPlayerNames(playerNames.slice(0, count));
        }
    };

    const handlePlayerNameChange = (index, name) => {
        const newNames = [...playerNames];
        newNames[index] = name;
        setPlayerNames(newNames);
    };

    const validateSetup = () => {
        const newErrors = [];

        playerNames.forEach((name, index) => {
            if (!name.trim()) {
                newErrors[index] = translations.playerNameRequired;
            }
        });

        // Check for duplicate names
        const uniqueNames = new Set(playerNames.map(name => name.trim()));
        if (uniqueNames.size !== playerNames.length) {
            Alert.alert(
                translations.duplicateNames,
                translations.duplicateNamesMessage
            );
            return false;
        }

        setErrors(newErrors);
        return newErrors.every(error => !error);
    };

    const handleContinue = () => {
        if (!validateSetup()) return;

        // Create player objects
        const players = playerNames.map((name, index) => ({
            id: `player-${index + 1}`,
            name: name.trim(),
            totalScore: 0,
        }));

        // Set players and max cards in store
        setPlayers(players);
        setMaxCards(maxCardsPerPlayer);

        // Navigate to dealer selection
        router.push('/game/dealer-selection');
    };

    const getTotalRounds = () => {
        return (maxCardsPerPlayer * 2) + 1; // ascending + special + descending
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Card>
                <Text style={styles.sectionTitle}>{translations.gameConfiguration}</Text>
                <Text style={styles.description}>
                    {translations.gameConfigDescription}
                </Text>

                <NumberInput
                    label={translations.maxCardsPerPlayer}
                    value={maxCardsPerPlayer}
                    onChange={setMaxCardsPerPlayer}
                    min={4}
                    max={10}
                />

                <Text style={styles.roundsInfo}>
                    {translations.totalRoundsInfo.replace('{count}', getTotalRounds())}
                </Text>
            </Card>

            <Card>
                <Text style={styles.sectionTitle}>{translations.numberOfPlayers}</Text>
                <Text style={styles.description}>
                    {translations.playersDescription}
                </Text>

                <View style={styles.playerCountContainer}>
                    <NumberInput
                        label={translations.players}
                        value={playerCount}
                        onChange={handlePlayerCountChange}
                        min={3}
                        max={6}
                    />
                </View>
            </Card>

            <Card>
                <Text style={styles.sectionTitle}>{translations.playerNames}</Text>
                <Text style={styles.description}>
                    {translations.playerNamesDescription}
                </Text>

                {playerNames.map((name, index) => (
                    <PlayerInput
                        key={`player-${index}`}
                        label={translations.playerLabel.replace('{number}', index + 1)}
                        value={name}
                        onChangeText={(text) => handlePlayerNameChange(index, text)}
                        placeholder={translations.enterPlayerName}
                        error={errors[index]}
                        maxLength={20}
                    />
                ))}
            </Card>

            <View style={styles.actions}>
                <Button
                    title={translations.continueToDealerSelection}
                    onPress={handleContinue}
                    size="large"
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: colors.textSecondary,
        marginBottom: 20,
        lineHeight: 22,
    },
    playerCountContainer: {
        marginTop: 8,
    },
    roundsInfo: {
        fontSize: 13,
        color: colors.primary,
        fontStyle: 'italic',
        marginTop: 8,
    },
    actions: {
        marginTop: 24,
        marginBottom: 32,
    },
});