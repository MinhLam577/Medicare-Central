import { Href, router, Tabs } from "expo-router";
import React from "react";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Category2, Home2, Notepad2, User } from "iconsax-react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/auth";

export default function TabLayout() {
    const { user } = useAuth()
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: useThemeColor({}, "background"),
                    borderTopWidth: 0,
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => {
                        if (focused) {
                            return <Home2 color={useThemeColor({}, 'primary')} size={20} />;
                        }
                        return <Home2 color={color} size={20} />;
                    },
                    tabBarActiveTintColor: useThemeColor({}, 'primary'),
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault()
                        router.push("/(app)/(tabs)/" as Href)
                    },
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: "Categories",
                    tabBarIcon: ({ color, focused }) => {
                        if (focused) {
                            return <Category2 color={useThemeColor({}, 'primary')} size={20} />;
                        }
                        return <Category2 color={color} size={20} />;
                    },
                    tabBarActiveTintColor: useThemeColor({}, 'primary'),
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault()
                        router.push("/(tabs)/categories" as Href)
                    },
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: "Orders",
                    tabBarIcon: ({ color, focused }) => {
                        if (focused) {
                            return <Notepad2 color={useThemeColor({}, 'primary')} size={20} />;
                        }
                        return <Notepad2 color={color} size={20} />;
                    },
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault()
                        if (!user) {
                            Toast.show({
                                type: "error",
                                text1: "You need to login to view your orders",
                                position: 'bottom',
                                onPress: () => {
                                    router.push("/(auth)/signIn" as Href)
                                },
                                bottomOffset: 60,
                            })
                            return
                        }
                        router.push("/(app)/(tabs)/orders" as Href)
                    },
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: "Account",
                    tabBarIcon: ({ color, focused }) => {
                        if (focused) {
                            return <User color={useThemeColor({}, 'primary')} size={20} />;
                        }
                        return <User color={color} size={20} />;
                    },
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault()
                        if (!user) {
                            Toast.show({
                                type: "error",
                                text1: "You need to login to view your orders",
                                position: 'bottom',
                                onPress: () => {
                                    router.push("/(auth)/signIn" as Href)
                                },
                                bottomOffset: 60
                            })
                            return
                        }
                        router.push("/(app)/(tabs)/orders" as Href)
                    },
                }}
            />
        </Tabs>
    );
}
