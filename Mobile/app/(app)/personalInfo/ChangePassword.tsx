import { changePassword } from "@/apis/user";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Row from "@/components/row/Row";
import Space from "@/components/space/Space";
import ThemeText from "@/components/themeText/ThemeText";
import ThemeView from "@/components/themeView/ThemeView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { Back } from "iconsax-react-native";
import React from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

const ChangePassword = () => {

    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        if (currentPassword === "" || newPassword === "" || confirmPassword === "") {
            // show toast
            Toast.show({
                text1: "Please fill all fields",
                type: 'error',
            })
            setIsLoading(false);
        }
        if (newPassword !== confirmPassword) {
            // show toast
            Toast.show({
                text1: "New password and confirm password does not match",
                type: 'error',
            })
            setIsLoading(false);
        }

        try {
            await changePassword(currentPassword, newPassword, confirmPassword);
            Toast.show({
                text1: "Change password successfully",
                type: 'success',
            })
            router.back();
        } catch (error: any) {
            Toast.show({
                text1: error.messages[0],
                type: 'error',
            })
            setIsLoading(false);
        }
        setIsLoading(false);
    }

    return (
        <View style={{ flex: 1 }}>
            <Row
                style={{
                    justifyContent: "space-between",
                    backgroundColor: useThemeColor({}, "background"),
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                }}
            >
                <Button
                    variant="circle"
                    icon={<Back size={20} color={useThemeColor({}, "text")} />}
                    onPress={() => {
                        router.back();
                    }}
                />

                <ThemeText text="Change Password" type="title" />

                <Button
                    variant="circle"
                    icon={<Back size={20} color={useThemeColor({}, "text")} />}
                    onPress={() => {}}
                    style={{ opacity: 0, pointerEvents: "none" }}
                />
            </Row>
            <ThemeView
                style={{
                    paddingHorizontal: 0,
                }}
            >
                    <View
                        style={{
                            backgroundColor: useThemeColor(
                                {},
                                "background"
                            ),
                            padding: 16,
                            height: "100%",
                        }}
                    >
                        <ThemeText type="small" text="To protect your account, please do not share your password with others. You can create password between 6-16 characters." />
                        <Space size={{ height: 16, width: 0 }} />
                        <Input
                            label="Current Password"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Enter your current password"
                        />
                        <Space size={{ height: 16, width: 0 }} />
                        <Input
                            label="New Password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Enter your new password"
                        />
                        <Space size={{ height: 16, width: 0 }} />
                        <Input
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Enter your new password again"
                        />
                        <Space size={{ height: 32, width: 0 }} />
                        <Button text="Change Password" 
                            onPress={() => {
                                handleSubmit();
                            }}
                            loading={isLoading}
                        />
                    </View>

            </ThemeView>
        </View>
    );
};

export default ChangePassword;
