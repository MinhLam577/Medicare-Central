import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import React from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider } from "@/context/auth";
import { CartProvider } from "@/context/cart";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const backgroundColorTheme = useThemeColor({}, "background");
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            <CartProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <ThemeProvider
                        value={
                            colorScheme === "dark"
                                ? DarkTheme
                                : DefaultTheme
                        }
                    >
                        <StatusBar
                            style="dark"
                            backgroundColor={backgroundColorTheme}
                        />
                        <Slot />
                        <Toast autoHide position="top" />
                    </ThemeProvider>
                </GestureHandlerRootView>
            </CartProvider>
        </AuthProvider>
    );
}
