import { useThemeColor } from '@/hooks/useThemeColor';
import { DiseaseCategory } from '@/type/diseaseType';
import React from 'react';
import { Image, TouchableOpacity, ViewStyle, useColorScheme, Text, Dimensions, ImageBackground } from 'react-native';
import ThemeText from '../themeText/ThemeText';
import ThemeView from '../themeView/ThemeView';
import { ScrollView } from 'react-native-gesture-handler';
import { Href, router } from 'expo-router';

interface DiseaseTargetGroupCardProps {
    disease: DiseaseCategory;
    width: number;

    style?: ViewStyle;
}
const DiseaseTargetGroupCard = ({
    disease,
    style,
    width,
}: DiseaseTargetGroupCardProps) => {
    const theme = useColorScheme() ?? 'light';
    return (
        <ThemeView
            style={{
                flex: 1,
                padding: 0,
                backgroundColor: useThemeColor({}, "itemBackground"),
                borderRadius: 8,
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
            <ImageBackground
                source={{ uri: disease.category_thumbnail }}
                style={{
                    width: width,
                    padding: 16,
                    height: width * 0.5,
                    borderRadius: 8,
                }}
                imageStyle={{
                    width: width * 0.4,
                    aspectRatio: 1,
                    borderRadius: 8,
                }}
            >
                <ThemeText type="medium" text={disease.category_name} style={{
                    textAlign: 'right',
                    fontSize: 16,
                    fontWeight: 500
                }} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {
                        disease.diseases.map((d, i) => (
                            <ThemeText key={i} type="link" text={d.disease_name} style={{
                                textAlign: 'right',
                                marginTop: 4,
                                fontSize: 14
                            }} 
                                onPress={() => {
                                    router.navigate(
                                        ("/(tabs)/categories/disease/"
                                        + d.disease_id) as Href
                                    )
                                }}
                            />
                        ))
                    }
                </ScrollView>
            </ImageBackground>
        </ThemeView>
    )
}

export default DiseaseTargetGroupCard