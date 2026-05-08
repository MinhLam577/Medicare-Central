import { View, Text, Touchable, ScrollView } from "react-native";
import React from "react";
import ThemeView from "@/components/themeView/ThemeView";
import Button from "@/components/button/Button";
import { useAuth } from "@/context/auth";
import Row from "@/components/row/Row";
import Avatar from "@/components/avatar/Avatar";
import ThemeText from "@/components/themeText/ThemeText";
import Space from "@/components/space/Space";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import SettingCard from "@/components/card/settingCard/SettingCard";
import {
    ArrowRight2,
    CalendarEdit,
    Card,
    Map,
    Map1,
    Personalcard,
} from "iconsax-react-native";
import { FlatList } from "react-native-gesture-handler";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

const Account = () => {
    const { signOut } = useAuth();

    const { user, refreshUser } = useAuth();

    return (
        <ThemeView style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: 'space-between'
        }}>
            <ScrollView>
                <Row justifyContent="flex-start" style={{
                    paddingHorizontal: 8
                }}>
                    <Avatar avatarUrl={user?.user_avatar ?? ""} />
                    <View
                        style={{
                            marginLeft: 16,
                        }}
                    >
                        <ThemeText type="title">{user?.user_fullname}</ThemeText>
                        <Space size={{ height: 4, width: 0 }} />
                        <ThemeText type="medium" text={user?.email} />
                    </View>
                </Row>
                <Space size={{ height: 16, width: 0 }} />
                <View
                    style={{
                        backgroundColor: useThemeColor({}, "background"),
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            router.navigate(
                                "/(app)/personalInfo/PersonalInfomation"
                            );
                        }}
                        style={{
                            padding: 16,
                            borderColor: useThemeColor({}, 'border'),
                            borderWidth: 0,
                            borderBottomWidth: 1
                        }}>
                        <Row justifyContent="space-between" style={{
                            borderRadius: 8
                        }}>
                            <Row alignItems="center">
                                <Personalcard size={24} color={useThemeColor({}, "icon")} />
                                <Space size={{ height: 0, width: 8 }} />
                                <ThemeText type="medium" text="Personal Information"
                                    style={{
                                        fontSize: 16,
                                    }}
                                />
                            </Row>
                            <ArrowRight2 size={24} color={useThemeColor({}, "icon")} />
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            router.navigate(
                                "/(app)/addressBook/AddressBook"
                            );
                        }}
                        style={{
                            padding: 16,
                            borderColor: useThemeColor({}, 'border'),
                            borderWidth: 0,
                        }}>
                        <Row justifyContent="space-between" style={{
                            borderRadius: 8
                        }}>
                            <Row alignItems="center">
                                <Map1 size={24} color={useThemeColor({}, "icon")} />
                                <Space size={{ height: 0, width: 8 }} />
                                <ThemeText type="medium" text="Address Book"
                                    style={{
                                        fontSize: 16,
                                    }}
                                />
                            </Row>
                            <ArrowRight2 size={24} color={useThemeColor({}, "icon")} />
                        </Row>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Space size={{ height: 16, width: 0 }} />
            <Button
                color="primary"
                onPress={() => {
                    signOut();
                }}
                text="Sign out"
            />
            <Space size={{ height: 16, width: 0 }} />
        </ThemeView>
    );
};

export default Account;
