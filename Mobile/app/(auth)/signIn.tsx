import { verifyEmailApi } from "@/apis/auth";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Row from "@/components/row/Row";
import Space from "@/components/space/Space";
import ThemeText from "@/components/themeText/ThemeText";
import ThemeView from "@/components/themeView/ThemeView";
import { useAuth } from "@/context/auth";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { View } from "react-native";
import {
    PasswordCheck,
    Personalcard
} from "iconsax-react-native";
import React from "react";
import Toast from "react-native-toast-message";

const SignIn = () => {
    const { signIn } = useAuth();

    const [isLoading, setIsLoading] = React.useState(false);

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    return (
        <ThemeView>
            <Row justifyContent="space-between" alignItems="flex-start">
                <View>
                    <ThemeText text="Welcome" type="large" />
                    <ThemeText text="Back!" type="large" />
                </View>
                <Button
                    variant="fill"
                    onPress={() => {
                        router.navigate("/(app)/(tabs)/");
                    }}
                    text='Home'
                    style={{
                        paddingVertical: 8
                    }}
                />
            </Row>
            <Space size={{ width: 0, height: 16 }} />
            <ThemeView>
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    icon={
                        <Personalcard size={20} color={useThemeColor({}, "icon")} />
                    }
                />
                <Space size={{ width: 0, height: 16 }} />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    icon={
                        <PasswordCheck
                            size={20}
                            color={useThemeColor({}, "icon")}
                        />
                    }
                    type="password"
                />
                <Space size={{ width: 0, height: 8 }} />
                <Row justifyContent="flex-end">
                    <ThemeText type="small" text="Your email dont verified?" />
                    <Space size={{ width: 4, height: 0 }} />
                    <ThemeText
                        text="Resend"
                        type="link"
                        style={{
                            paddingVertical: 12,
                        }}
                        onPress={async () => {
                            if (email === '') {
                                Toast.show({
                                    type: "error",
                                    text1: "Warning",
                                    text2: "Please enter your email address to resend verification email",
                                });
                            }
                            try {
                                await verifyEmailApi(email);
                                Toast.show({
                                    type: "success",
                                    text1: "Successfully sent verification email",
                                    text2: "Please check your email to verify your account",
                                });
                            } catch (error: any) {
                                Toast.show({
                                    type: "error",
                                    text1: "Verification email not sent",
                                    text2: error.messages[0],
                                });
                            }
                        }}
                    />
                </Row>
                <Space size={{ width: 0, height: 16 }} />
                <Button
                    text="Sign in"
                    loading={isLoading}
                    onPress={async () => {
                        setIsLoading(true);
                        try {
                            await signIn(email, password);
                            router.navigate("/(app)/(tabs)/");
                            setIsLoading(false);
                        } catch (error: any) {
                            Toast.show({
                                type: "error",
                                text1: "Warning",
                                text2: error.messages[0],
                            });
                            setIsLoading(false);
                        }
                    }}
                    color="primary"
                />

                <Space size={{ width: 0, height: 16 }} />

                <Row justifyContent="center">
                    <ThemeText text="Don't have an account?" type="small" />
                    <Space size={{ width: 4, height: 0 }} />
                    <ThemeText
                        text="Sign up"
                        type="link"
                        onPress={() => {
                            router.navigate("/(auth)/signUp");
                        }}
                    />
                </Row>
            </ThemeView>
        </ThemeView>
    );
};

export default SignIn;
