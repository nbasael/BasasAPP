
# 📱 Basas - App de Puntos para el Juego de Cartas (Expo + Router)

**Basas** es una aplicación móvil desarrollada con **React Native + Expo + expo-router**, diseñada para anotar partidas del juego de cartas "Basas", una variante del clásico juego de bazas *Oh Hell*.

---

## 🚀 Cómo ejecutar el proyecto

1. **Clonar o descomprimir el proyecto**
   ```bash
   git clone <repo-url>
   cd Basas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo con Expo**
   ```bash
   npx expo start
   ```

4. **Abrir en tu dispositivo**
   - Escaneá el código QR con la app **Expo Go** (Android/iOS).

---

## ⚙️ Tecnologías utilizadas

- [Expo](https://expo.dev/)
- [expo-router](https://expo.github.io/router/) (navegación basada en archivos)
- [React Native](https://reactnative.dev/)
- [Zustand](https://github.com/pmndrs/zustand) para manejo de estado global
- [NativeWind](https://www.nativewind.dev/) para estilos tipo Tailwind
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) para persistencia de partidas
- [react-native-svg](https://github.com/software-mansion/react-native-svg) para íconos e ilustraciones

---

## 📦 Estructura del proyecto

```
Basas/
├── app/                    # Pantallas (usando expo-router)
│   ├── index.js           # Inicio
│   ├── about.js           # Acerca de
│   └── game/               # Flujo principal del juego
├── components/             # Componentes reutilizables
├── constants/              # Constantes de configuración
├── store/                  # Estado global (Zustand)
├── assets/                 # Imágenes, íconos y splash
├── app.config.js           # Configuración de Expo
├── tailwind.config.js      # Configuración de NativeWind
└── README.md               # Este archivo
```

---

## ✨ Funcionalidades principales

- Registro de jugadores y repartidor inicial
- Configuración de cantidad máxima de cartas por ronda
- Fases automáticas: de 1 a N cartas, ronda sin triunfo, de N a 1
- Apuestas paso a paso (incluye restricción al último jugador)
- Registro de bazas ganadas tocando cada jugador
- Cálculo automático del puntaje (0 aciertos = 10 puntos si se cumple)
- Botón de deshacer y reiniciar ronda
- Historial de partidas y podio final
- Tema visual moderno y opción dark mode
- Persistencia local automática

---

## 📩 Contacto

App creada por Nahuel Basael Jimenez 🇦🇷  
Email: nahuelbasael@gmail.com