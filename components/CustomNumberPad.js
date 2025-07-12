import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const CustomNumberPad = ({ onNumberPress, onBackspace, onConfirm, value, availableNumbers }) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    const isNumberDisabled = (number) => {
        return availableNumbers && !availableNumbers.includes(number);
    };

    return (
        <View style={styles.container}>
            <View style={styles.display}>
                <Text style={styles.displayText}>{value !== null ? value.toString() : ''}</Text>
            </View>

            <View style={styles.numberGrid}>
                {numbers.map((number) => (
                    <TouchableOpacity
                        key={number}
                        style={[
                            styles.numberButton,
                            isNumberDisabled(number) && styles.disabledButton
                        ]}
                        onPress={() => onNumberPress(number)}
                        disabled={isNumberDisabled(number)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.numberText,
                            isNumberDisabled(number) && styles.disabledText
                        ]}>
                            {number}
                        </Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.actionButton} onPress={onBackspace} activeOpacity={0.7}>
                    <Text>Borrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.confirmButton, value === null && styles.disabledButton]}
                    onPress={onConfirm}
                    disabled={value === null}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.confirmText, value === null && styles.disabledText]}>
                        {translations.confirm}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    display: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        minHeight: 80,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    displayText: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.text,
    },
    numberGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    numberButton: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    numberText: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
    },
    actionButton: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: colors.secondary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    confirmButton: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    confirmText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.background,
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: colors.border,
        opacity: 0.5,
    },
    disabledText: {
        color: colors.textSecondary,
    },
});