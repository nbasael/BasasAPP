import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { colors } from '@/constants/colors';

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
}) => {
    const getBackgroundColor = () => {
        if (disabled) return colors.border;

        switch (variant) {
            case 'primary':
                return colors.primary;
            case 'secondary':
                return colors.secondary;
            case 'outline':
                return 'transparent';
            case 'success':
                return colors.success;
            case 'warning':
                return colors.warning;
            case 'error':
                return colors.error;
            default:
                return colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.textSecondary;

        switch (variant) {
            case 'primary':
            case 'secondary':
            case 'success':
            case 'warning':
            case 'error':
                return colors.background;
            case 'outline':
                return colors.primary;
            default:
                return colors.background;
        }
    };

    const getBorderColor = () => {
        if (disabled) return colors.border;

        switch (variant) {
            case 'outline':
                return colors.primary;
            default:
                return 'transparent';
        }
    };

    const getPadding = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: 8, paddingHorizontal: 16 };
            case 'medium':
                return { paddingVertical: 12, paddingHorizontal: 20 };
            case 'large':
                return { paddingVertical: 16, paddingHorizontal: 24 };
            default:
                return { paddingVertical: 12, paddingHorizontal: 20 };
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'small':
                return 14;
            case 'medium':
                return 16;
            case 'large':
                return 18;
            default:
                return 16;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    ...getPadding(),
                },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <Text
                    style={[
                        styles.text,
                        {
                            color: getTextColor(),
                            fontSize: getFontSize(),
                        },
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },
});