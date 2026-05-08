import React from "react";
import { ActivityIndicator, Image } from "react-native";

interface AvatarProps {
    avatarUrl?: string;
    size?: number;
    loading?: boolean;
}
const Avatar = ({ avatarUrl, size = 56, loading }: AvatarProps) => {
    if (!avatarUrl)
        if (loading)
            return (
                <ActivityIndicator
                    testID="loading"
                    style={{ width: size, height: size, borderRadius: 50 }}
                />
            )
        else return (
            <Image
                testID="avatar"
                source={require("../../assets/images/no_avatar.png")}
                style={{ width: size, height: size, objectFit: "cover" }}
                borderRadius={50}
            />
        )
    else {
        if (loading)
            return (
                <ActivityIndicator
                    testID="loading"
                    style={{ width: size, height: size, borderRadius: 50 }}
                />
            )
        else return (
            <Image
                testID="avatar"
                source={{ uri: avatarUrl }}
                style={{ width: size, height: size, objectFit: "cover" }}
                borderRadius={50}
            />
        )
    }
};

export default Avatar;
