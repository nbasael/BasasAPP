import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const PlayerCard = ({
    player,
    tricks = 0,
    onAddTrick,
    onRemoveTrick,
    disabled = false,
    showControls = true
}) => {
    return (
        <View style={[styles.card, disabled && styles.disabledCard]}>
            <Text style={styles.playerName}>{player.name}</Text>
            <View style={styles.scoreContainer}>
                <Text style={styles.tricksLabel}>{translations.tricksWon}</Text>
                <View style={styles.tricksControls}>
                    {showControls && (
                        <TouchableOpacity
                            style={[styles.controlButton, (disabled || tricks === 0) && styles.disabledButton]}
                            onPress={onRemoveTrick}
                            disabled={disabled || tricks === 0}
                            activeOpacity={0.7}
                        >
                            <Text>Quitar</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.tricksValue}>{tricks}</Text>
                    {showControls && (
                        <TouchableOpacity
                            style={[styles.controlButton, disabled && styles.disabledButton]}
                            onPress={onAddTrick}
                            disabled={disabled}
                            activeOpacity={0.7}
                        >
                            <Text>Agregar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginVertical: 8,
        borderWidth: 2,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledCard: {
        opacity: 0.6,
    },
    playerName: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tricksLabel: {
        fontSize: 15,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    tricksControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    controlButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    disabledButton: {
        backgroundColor: colors.border,
    },
    tricksValue: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.primary,
        minWidth: 40,
        textAlign: 'center',
    },
});