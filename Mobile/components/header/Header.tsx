import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import Row from '../row/Row';
import Button from '../button/Button';
import { Back, ShoppingCart } from 'iconsax-react-native';
import { router } from 'expo-router';
import ThemeText from '../themeText/ThemeText';
import Badge from '../badge/Badge';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CartContext } from '@/context/cart';
import Avatar from '../avatar/Avatar';
import { Image } from 'react-native';
import { useAuth } from '@/context/auth';

interface HeaderProps {
    title?: string;
    type: 'main' | 'secondary';
}

const Header = ({
    title,
    type
}: HeaderProps) => {
    const background = useThemeColor({}, "background");
    const text = useThemeColor({}, "text");

    const { user } = useAuth()
    const { cartItems } =
        useContext(CartContext);
    if (type === 'main')
        return (
            <Row
                style={{
                    justifyContent: user ? "space-between" : "flex-end",
                    paddingHorizontal: 8,
                    position: 'relative'
                }}
            >
                {
                    user ? (
                        <Avatar
                            avatarUrl={user?.user_avatar ?? undefined}
                            size={36}
                        />
                    ) : (
                        null
                    )
                }
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        testID="avatar"
                        source={{
                            uri: Image.resolveAssetSource(require("../../assets/images/logo.png")).uri
                        }}
                        style={{ width: 56, height: 56, objectFit: "contain" }}
                        borderRadius={50}
                    />
                </View>
                {
                    user ? (
                        <Badge count={cartItems.length}>
                            <Button
                                variant="circle"
                                icon={
                                    <ShoppingCart
                                        size={20}
                                        color={text}
                                    />
                                }
                                onPress={() => {
                                    router.navigate("/(app)/cart");
                                }}
                            />
                        </Badge>
                    ) : (
                        <Button
                            variant="fill"
                            onPress={() => {
                                router.navigate("/(auth)/signIn");
                            }}
                            text='Sign In'
                            style={{
                                paddingVertical: 8
                            }}
                        />
                    )
                }
            </Row>
        )
    if (type === 'secondary')
        return (
            <Row
                style={{
                    justifyContent: "space-between",
                    backgroundColor: background,
                    alignItems: "center",
                    marginBottom: 8,
                    position: 'relative'
                }}
            >
                <Button
                    variant="circle"
                    icon={<Back size={20} color={text} />}
                    onPress={() => {
                        router.back();
                    }}
                />
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                    {title && (
                        <ThemeText text={title} type="title" />
                    )}
                </View>
                {
                    user ? (<Badge count={cartItems.length}>
                        <Button
                            variant="circle"
                            icon={
                                <ShoppingCart
                                    size={20}
                                    color={text}
                                />
                            }
                            onPress={() => {
                                router.navigate("/(app)/cart");
                            }}
                        />
                    </Badge>) : (
                        <Button
                            variant="fill"
                            onPress={() => {
                                router.navigate("/(auth)/signIn");
                            }}
                            text='Sign In'
                            style={{
                                paddingVertical: 8
                            }}
                        />
                    )
                }
            </Row>
        )
}

export default Header