import Header from "@/components/header/Header";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

const _layout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                header: (props) => {
                    if (props.route.name !== "index")
                    {
                        console.log(props)
                        return (
                            <View style={{
                                backgroundColor: useThemeColor({}, "background"),
                                paddingHorizontal: 8,
                                paddingVertical: 8
                            }}>
                                <Header type="secondary" title={props.route.name.split('/')[0].toLocaleUpperCase()} />
                            </View>
                        )
                    }
                    if (props.route.name === "index")
                        return (
                            <View
                                style={{
                                    backgroundColor: useThemeColor(
                                        {},
                                        "background"
                                    ),
                                    paddingHorizontal: 8,
                                    paddingVertical: 8,
                                }}
                            >
                                <Header type="main" />
                            </View>
                        )
                },
            }}
        > 
            <Stack.Screen name="index" />
            <Stack.Screen name="disease" />
            <Stack.Screen name="disease/[categoryId]" />
            <Stack.Screen name="medicine/[categoryId]" />
        </Stack>
    );
};

export default _layout;
