import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';

export default function AboutScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Card style={styles.headerCard}>
                <Text style={styles.title}>{translations.aboutBasas}</Text>
                <Text style={styles.version}>{translations.version}</Text>
            </Card>

            <Card>
                <Text style={styles.sectionTitle}>{translations.whatIsBasas}</Text>
                <Text style={styles.description}>
                    {translations.basasDescription}
                </Text>
            </Card>

            <Card>
                <Text style={styles.sectionTitle}>{translations.howToPlay}</Text>
                <View style={styles.rulesList}>
                    {translations.howToPlayRules.map((rule, index) => (
                        <Text key={index} style={styles.ruleItem}>{rule}</Text>
                    ))}
                </View>
            </Card>

            <Card>
                <Text style={styles.sectionTitle}>{translations.appFeatures}</Text>
                <View style={styles.featuresList}>
                    {translations.features.map((feature, index) => (
                        <Text key={index} style={styles.featureItem}>{feature}</Text>
                    ))}
                </View>
            </Card>

            <Card>
                <Text style={styles.sectionTitle}>{translations.developer}</Text>
                <Text style={styles.description}>
                    {translations.developerText}
                </Text>
                <Text style={styles.contact}>
                    {translations.contact}
                </Text>
            </Card>

            <Card>
                <Text style={styles.sectionTitle}>{translations.credits}</Text>
                <Text style={styles.description}>
                    {translations.creditsText}
                </Text>
            </Card>

            <View style={styles.footer}>
                <Button
                    title={translations.backToHome}
                    onPress={() => router.back()}
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
    headerCard: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.primary,
    },
    version: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
        marginBottom: 8,
    },
    rulesList: {
        marginTop: 8,
    },
    ruleItem: {
        fontSize: 15,
        color: colors.text,
        marginBottom: 8,
        lineHeight: 22,
    },
    featuresList: {
        marginTop: 8,
    },
    featureItem: {
        fontSize: 15,
        color: colors.text,
        marginBottom: 8,
        lineHeight: 22,
    },
    contact: {
        fontSize: 14,
        color: colors.textSecondary,
        fontStyle: 'italic',
        marginTop: 12,
    },
    footer: {
        marginTop: 24,
        marginBottom: 32,
    },
});