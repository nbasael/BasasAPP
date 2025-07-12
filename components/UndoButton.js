import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const UndoButton = ({ onPress, disabled = false, lastAction = null }) => {
    if (disabled) return null;

    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                {/* <Undo2 size={18} color={disabled ? colors.textSecondary : colors.text} /> */}
                <Text style={[styles.text, disabled && styles.disabledText]}>
                    {translations.undo}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    disabled: {
        opacity: 0.5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    text: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    disabledText: {
        color: colors.textSecondary,
    },
});