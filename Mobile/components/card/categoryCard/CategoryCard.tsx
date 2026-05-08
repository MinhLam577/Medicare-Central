import Row from "@/components/row/Row";
import ThemeText from "@/components/themeText/ThemeText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
    Image,
    ImageStyle,
    TextStyle,
    TouchableOpacity,
    useColorScheme,
    ViewStyle,
} from "react-native";

interface CategoryCardProps {
    title: string;
    imageUrl: string;
    onPress?: () => void;

    style?: ViewStyle;
    imageStyle?: ImageStyle;
    titleStyle?: TextStyle;

    type?: 'circle' | 'square';
}

const CategoryCard = ({
    title,
    imageUrl,
    onPress,
    style,
    imageStyle,
    titleStyle,
    type = 'square'
}: CategoryCardProps) => {
    const theme = useColorScheme() ?? 'light';

    if (type === 'circle')
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    flex: 1,
                    borderRadius: 8,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    ...style,
                }}
            >
                <Image
                    source={{
                        uri:
                            !imageUrl
                                ? Image.resolveAssetSource(require("../../../assets/images/unknownImage.png")).uri
                                : imageUrl,
                    }}
                    style={{
                        width: "100%",
                        borderRadius: 100,
                        height: 100,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        objectFit: "contain",
                        ...imageStyle,
                    }}
                />
                <Row
                    style={{
                        marginBottom: 8,
                        marginTop: 8,
                        paddingHorizontal: 8,
                    }}
                >
                    <ThemeText
                        ellipsizeMode="tail"
                        numOfLines={1}
                        text={title.toLocaleUpperCase()}
                        type="small"
                        style={{
                            ...titleStyle,
                            textAlign: "center",
                        }}
                    />
                </Row>
            </TouchableOpacity>
        )

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flex: 1,
                backgroundColor: useThemeColor({}, "itemBackground"),
                borderRadius: 8,
                flexDirection: "column",
                justifyContent: "space-between",
                shadowColor: theme === "light" ? "#000" : "#fff",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,

                elevation: 2,
                ...style,
            }}
        >
            <Image
                source={{
                    uri:
                        imageUrl === ""
                            ? "../../assets/images/unknownImage.jpg"
                            : imageUrl,
                }}
                style={{
                    width: "100%",
                    height: (typeof style?.width === 'number' ? style.width : 100) * 0.7,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    objectFit: "cover",
                    ...imageStyle,
                }}
            />
            <Row
                style={{
                    marginBottom: 8,
                    marginTop: 8,
                    paddingHorizontal: 8,
                }}
            >
                <ThemeText
                    ellipsizeMode="tail"
                    numOfLines={3}
                    text={title.toLocaleUpperCase()}
                    type="small"
                    style={{
                        ...titleStyle,
                        textAlign: "center",
                    }}
                />
            </Row>
        </TouchableOpacity>
    );
};

export default CategoryCard;
