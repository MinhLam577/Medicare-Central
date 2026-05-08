import Button from "@/components/button/Button";
import Row from "@/components/row/Row";
import Space from "@/components/space/Space";
import ThemeText from "@/components/themeText/ThemeText";
import ThemeView from "@/components/themeView/ThemeView";
import { useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";

const ReVerifyEmail = () => {
    const { email } = useLocalSearchParams<{
        email: string;
    }>();

    return (
        <ThemeView>
            <ThemeText text="Verify your" type="large" />
            <ThemeText text="email" type="large" />
            <Row justifyContent="center">
                <LottieView
                    style={{
                        width: 200,
                        height: 200,
                    }}
                    source={require("../../../assets/animation/success.json")}
                    autoPlay
                    loop={true}
                />
            </Row>
            <Row justifyContent="center">
                <ThemeText text="Please verify your email" type="medium" />
            </Row>
            <Row justifyContent="center">
                <ThemeText
                    type="small"
                    text={"You're almost there! We sent an email to"}
                />
            </Row>
            <Row justifyContent="center">
                <ThemeText text={email} type="small" />
            </Row>
            <Row justifyContent="center">
                <ThemeText
                    text={
                        "Just click on the link in that email to complete your signup. If you don't see it. you may need to check your spam folder."
                    }
                    type="small"
                    style={{
                        marginTop: 48,
                    }}
                />
            </Row>
            <Space size={{ width: 0, height: 16 }} />
            <Button
                text="Resend Verification Email"
                onPress={() => {}}
            />
        </ThemeView>
    );
};

export default ReVerifyEmail;