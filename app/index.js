import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { useGameStore } from '@/store/gameStore';
import { useHistoryStore } from '@/store/historyStore';
import { Link } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    const {
        gameStarted,
        gameCompleted,
        biddingPhase,
        trickTrackingPhase,
        resetGame
    } = useGameStore();

    const { gameHistory } = useHistoryStore();

    const handleNewGame = () => {
        resetGame();
    };

    const getContinueRoute = () => {
        if (biddingPhase) return '/game/betting';
        if (trickTrackingPhase) return '/game/tricks';
        if (gameCompleted) return '/game/results';
        return '/game/scoreboard';
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/Icon.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            <Card style={styles.card}>
                <Text style={styles.cardTitle}>{translations.welcomeTitle}</Text>
                <Text style={styles.description}>
                    {translations.welcomeDescription}
                </Text>

                <View style={styles.rulesContainer}>
                    <Text style={styles.rulesTitle}>{translations.gameRules}</Text>
                    <Text style={styles.rulesText}>{translations.rule1}</Text>
                    <Text style={styles.rulesText}>{translations.rule2}</Text>
                    <Text style={styles.rulesText}>{translations.rule3}</Text>
                    <Text style={styles.rulesText}>{translations.rule4}</Text>
                    <Text style={styles.rulesText}>{translations.rule5}</Text>
                </View>
            </Card>

            <View style={styles.actions}>
                {gameStarted && !gameCompleted ? (
                    <Link href={getContinueRoute()} asChild>
                        <Button title={translations.continueGame} variant="primary" style={styles.button} />
                    </Link>
                ) : null}

                {gameCompleted ? (
                    <Link href="/game/results" asChild>
                        <Button title={translations.viewResults} variant="primary" style={styles.button} />
                    </Link>
                ) : null}

                <Link href="/game/setup" asChild>
                    <Button
                        title={gameStarted ? translations.newGame : translations.startGame}
                        variant={gameStarted ? "secondary" : "primary"}
                        style={styles.button}
                        onPress={gameStarted ? handleNewGame : undefined}
                    />
                </Link>

                <View style={styles.secondaryActions}>
                    <Link href="/game/history" asChild>
                        <Button
                            title={`${translations.history} (${gameHistory.length})`}
                            variant="outline"
                            style={[styles.button, styles.secondaryButton]}
                        />
                    </Link>

                    <Link href="/about" asChild>
                        <Button
                            title={translations.about}
                            variant="outline"
                            style={[styles.button, styles.secondaryButton]}
                        />
                    </Link>
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
    header: {
        alignItems: 'center',
        marginVertical: 32,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 30,
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: colors.primary,
        textShadowColor: colors.border,
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 18,
        color: colors.textSecondary,
        marginTop: 8,
        fontWeight: '500',
    },
    card: {
        marginBottom: 24,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
        marginBottom: 20,
    },
    rulesContainer: {
        backgroundColor: colors.primary + '15',
        padding: 20,
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    rulesTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    rulesText: {
        fontSize: 15,
        color: colors.text,
        marginBottom: 6,
        lineHeight: 20,
    },
    actions: {
        marginTop: 20,
    },
    button: {
        marginBottom: 16,
    },
    secondaryActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    secondaryButton: {
        flex: 0.48,
    },
});