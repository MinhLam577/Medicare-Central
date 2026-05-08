import { getCategeryDisease } from '@/apis/disease';
import ThemeView from '@/components/themeView/ThemeView';
import { DiseaseDetail } from '@/type/diseaseType';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import RenderHtml from 'react-native-render-html';
import { htmlStyle } from '@/constants/HtmlStyle';

const Disease = () => {
    const { categoryId } = useLocalSearchParams<{
        categoryId: string;
    }>();
    let width = Dimensions.get('screen').width

    const [diseaseDetail, setDiseaseDetail] = useState<DiseaseDetail>()

    useEffect(() => {
        (async () => {
            try {
                const rs = await getCategeryDisease(categoryId)
                setDiseaseDetail(rs.data)
                console.log(rs.data?.general_overview.replaceAll('<br>', ''))
            } catch (error: any) {
                Toast.show({
                    type: "error",
                    text1: error.messages[0],
                });
            }
        })();
    }, []);

    return (
        <ThemeView>
            <ScrollView>
                <RenderHtml
                    source={{ html: diseaseDetail?.general_overview.replaceAll('<p><br></p>', '') || '' }}
                    contentWidth={width}
                    classesStyles={htmlStyle}
                />
                <RenderHtml
                    source={{ html: diseaseDetail?.symptoms.replaceAll('<p><br></p>', '') || '' }}
                    contentWidth={width}
                    classesStyles={htmlStyle}
                />
                <RenderHtml
                    source={{ html: diseaseDetail?.cause.replaceAll('<p><br></p>', '') || '' }}
                    contentWidth={width}
                    classesStyles={htmlStyle}
                />
                <RenderHtml
                    source={{ html: diseaseDetail?.risk_subjects.replaceAll('<p><br></p>', '') || '' }}
                    contentWidth={width}
                    classesStyles={htmlStyle}
                />
                <RenderHtml
                    source={{ html: diseaseDetail?.diagnosis.replaceAll('<p><br></p>', '') || '' }}
                    contentWidth={width}
                    classesStyles={htmlStyle}
                />
                <RenderHtml
                    source={{ html: diseaseDetail?.prevention.replaceAll('<p><br></p>', '') || '' }}
                    contentWidth={width}
                    classesStyles={htmlStyle}
                />
                <RenderHtml
                    source={{ html: diseaseDetail?.treatment_method.replaceAll('<p><br></p>', '') || '' }}
                    contentWidth={width}
                    classesStyles={htmlStyle}
                />
            </ScrollView>
        </ThemeView>
    )
}

export default Disease