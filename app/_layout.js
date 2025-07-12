import { colors } from '@/constants/colors';
import { translations } from '@/constants/translations';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	useEffect(() => {
		// Hide the splash screen after a short delay
		const hideSplash = async () => {
			await new Promise(resolve => setTimeout(resolve, 500));
			await SplashScreen.hideAsync();
		};

		hideSplash();
	}, []);

	return (
		<>
			<StatusBar style="light" />
			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: colors.primary,
					},
					headerTintColor: colors.background,
				}}
			>
				<Stack.Screen
					name="index"
					screenOptions={{
						headerShown: false
					}}
				/>
				<Stack.Screen
					name="about"
					options={{
						title: translations.aboutBasas,
						headerBackTitle: 'Inicio',
					}}
				/>
				<Stack.Screen
					name="game/setup"
					options={{
						title: 'Configuración del Juego',
						headerBackTitle: 'Inicio',
					}}
				/>
				<Stack.Screen
					name="game/dealer-selection"
					options={{
						title: 'Seleccionar Repartidor',
						headerBackTitle: 'Configuración',
					}}
				/>
				<Stack.Screen
					name="game/betting"
					options={{
						title: 'Realizar Apuestas',
						headerBackVisible: false,
					}}
				/>
				<Stack.Screen
					name="game/tricks"
					options={{
						title: 'Rastrear Trucos',
						headerBackVisible: false,
					}}
				/>
				<Stack.Screen
					name="game/scoreboard"
					options={{
						title: 'Marcador',
						headerBackTitle: 'Juego',
					}}
				/>
				<Stack.Screen
					name="game/results"
					options={{
						title: 'Resultados Finales',
						headerBackVisible: false,
					}}
				/>
				<Stack.Screen
					name="game/history"
					options={{
						title: 'Historial de Juegos',
						headerBackTitle: 'Inicio',
					}}
				/>
			</Stack>
		</>
	);
}