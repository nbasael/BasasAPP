import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export const NumberInput = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
}) => {
    const handleIncrement = () => {
        const newValue = (value ?? 0) + step;
        if (newValue <= max) {
            onChange(newValue);
        }
    };

    const handleDecrement = () => {
        const newValue = (value ?? 0) - step;
        if (newValue >= min) {
            onChange(newValue);
        }
    };

    const handleTextChange = (text) => {
        const numValue = parseInt(text);
        if (!isNaN(numValue) && numValue >= min && numValue <= max) {
            onChange(numValue);
        } else if (text === '') {
            onChange(0);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TouchableOpacity
                    style={[styles.button, (value ?? 0) <= min && styles.disabledButton]}
                    onPress={handleDecrement}
                    disabled={(value ?? 0) <= min}
                >
                    <Minus size={20} color={(value ?? 0) <= min ? colors.textSecondary : colors.text} />
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    value={value !== null ? value.toString() : ''}
                    onChangeText={handleTextChange}
                    keyboardType="numeric"
                    textAlign="center"
                    placeholderTextColor={colors.textSecondary}
                />

                <TouchableOpacity
                    style={[styles.button, (value ?? 0) >= max && styles.disabledButton]}
                    onPress={handleIncrement}
                    disabled={(value ?? 0) >= max}
                >
                    <Plus size={20} color={(value ?? 0) >= max ? colors.textSecondary : colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 48,
        height: 48,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface,
    },
    disabledButton: {
        opacity: 0.5,
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        marginHorizontal: 12,
        paddingHorizontal: 12,
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        backgroundColor: colors.surface,
    },
});