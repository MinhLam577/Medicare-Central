import Button from "@/components/button/Button";
import HorizontalRule from "@/components/horizontalRule/HorizontalRule";
import Input from "@/components/input/Input";
import Row from "@/components/row/Row";
import Space from "@/components/space/Space";
import ThemeText from "@/components/themeText/ThemeText";
import ThemeView from "@/components/themeView/ThemeView";
import { useAuth } from "@/context/auth";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Href, router } from "expo-router";
import Toast from 'react-native-toast-message';
import {
    EmojiSad,
    Facebook,
    Gift,
    Google,
    PasswordCheck,
    Personalcard,
} from "iconsax-react-native";
import React from "react";

const SignUp = () => {
    const { signUp } = useAuth();

    const [isLoading, setIsLoading] = React.useState(false);

    const [fullName, setFullName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    return (
        <ThemeView>
            <ThemeText text="Create an" type="large" />
            <ThemeText text="account" type="large" />
            <Space size={{ width: 0, height: 16 }} />
            <ThemeView>
                <Input
                    placeholder="Fullname"
                    value={fullName}
                    onChangeText={(text) => setFullName(text)}
                    icon={
                        <Personalcard size={20} color={useThemeColor({}, "icon")} />
                    }
                />
    
                <Space size={{ width: 0, height: 16 }} />
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    icon={<EmojiSad size={20} color={useThemeColor({}, "icon")} />}
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
                <Space size={{ width: 0, height: 16 }} />
                <Input
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                    icon={
                        <PasswordCheck
                            size={20}
                            color={useThemeColor({}, "icon")}
                        />
                    }
                    type="password"
                />
                <Row
                    justifyContent="flex-start"
                    style={{
                        marginTop: 8,
                    }}
                >
                    <ThemeText text="By clicking the" type="small" />
                    <Space size={{ width: 4, height: 0 }} />
                    <ThemeText text="Register" type="link" />
                    <Space size={{ width: 4, height: 0 }} />
                    <ThemeText
                        text="button, you agree to the public offer"
                        type="small"
                    />
                </Row>
    
                <Space size={{ width: 0, height: 32 }} />
    
                <Button
                    text="Register"
                    onPress={async () => {
                        if (!fullName || !email || !password || !confirmPassword) {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'All fields are required',
                            })
                            return;
                        }
    
                        if (password !== confirmPassword) {
                            Toast.show({
                                type: 'error',
                                position: 'top',
                                text1: 'Error',
                                text2: 'Password does not match',
                            });
                            return;
                        }
    
                        setIsLoading(true);
                        try {
                            await signUp(
                                fullName,
                                email,
                                password,
                                confirmPassword
                            );
                            setIsLoading(false);
                            router.navigate(
                                ("/(auth)/signIn/") as Href
                            );
                            Toast.show({
                                text1: 'Success',
                                text2: 'Please check your email to verify your account',
                                type: 'success',
                            })
                        } catch (error: any) {
                            const errorDetail = error.errors;
                            if (errorDetail.fullname) {
                                Toast.show({
                                    type: 'error',
                                    position: 'top',
                                    text1: 'Error',
                                    text2: errorDetail.fullname[0],
                                });
                            }
                            if (errorDetail.email) {
                                Toast.show({
                                    type: 'error',
                                    position: 'top',
                                    text1: 'Error',
                                    text2: errorDetail.email[0],
                                });
                            }
                            if (errorDetail.password) {
                                Toast.show({
                                    type: 'error',
                                    position: 'top',
                                    text1: 'Error',
                                    text2: errorDetail.password[0],
                                });
                            }
    
                            setIsLoading(false);
                        }
                    }}
                    color="primary"
                />
    
                <Space size={{ width: 0, height: 16 }} />
    
                <Row justifyContent="center">
                    <ThemeText text="I already have an account" type="small" />
                    <Space size={{ width: 4, height: 0 }} />
                    <ThemeText
                        text="Sign In"
                        type="link"
                        onPress={() => {
                            router.navigate("/(auth)/signIn");
                        }}
                    />
                </Row>
            </ThemeView>
        </ThemeView>
    );
};

export default SignUp;
