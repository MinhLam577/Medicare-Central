import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import Row from "../row/Row";
import ThemeText from "../themeText/ThemeText";
import { ViewStyle } from "react-native";

interface BreadCrumbProps {
    breadCrumbs: string[];
    style?: ViewStyle;
}
const BreadCrumb = ({ breadCrumbs, style }: BreadCrumbProps) => {
    if (!breadCrumbs.length) {
        return null;
    }
    return (
        <Row
            justifyContent="flex-start"
            style={{
                backgroundColor: useThemeColor({}, "itemBackground"),
                borderRadius: 8,
                padding: 16,
                ...style,
            }}
        >
            <ThemeText text={breadCrumbs.join(" / ")} type="small" ellipsizeMode="head"/>
        </Row>
    );
};

export default BreadCrumb;
