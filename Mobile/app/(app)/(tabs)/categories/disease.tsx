import { getdisease } from '@/apis/disease';
import CategoryCard from '@/components/card/categoryCard/CategoryCard';
import DiseaseBodyPart from '@/components/diseaseBodyPart/diseaseBodyPart';
import DiseaseTargetGroupCard from '@/components/DiseasTargetGroupCard/DiseaseTargetGroupCard';
import Space from '@/components/space/Space';
import ThemeText from '@/components/themeText/ThemeText';
import ThemeView from '@/components/themeView/ThemeView';
import { DiseaseData } from '@/type/diseaseType';
import { isTablet } from '@/utils/isTablet';
import { Href, router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import Toast from 'react-native-toast-message';

const Disease = () => {
    let width = Dimensions.get('screen').width - 16
    const [diseases, setDiseases] = React.useState<DiseaseData>();

    useEffect(() => {
        (async () => {
            try {
                const rs = await getdisease();
                setDiseases(rs.data);
            } catch (error: any) {
                Toast.show({
                    type: "Error",
                    text1: error.messages[0],
                });
            }
        })();
    }, []);

    return (
        <ThemeView>
            <ScrollView>
                <ThemeText
                    type="medium"
                    text={'Disease Common'}
                    style={{
                        fontWeight: "bold",
                        padding: 8,
                    }}
                />
                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            justifyContent: 'center',
                        }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {diseases?.disease_common.length
                                ? diseases.disease_common.map((d, i) => {
                                    return (
                                        <CategoryCard
                                            key={i}
                                            imageUrl={d.disease_thumbnail}
                                            title={d.disease_name}
                                            onPress={() => {
                                                router.navigate(
                                                    ("/(tabs)/categories/disease/"
                                                        + d.disease_id) as Href
                                                )
                                            }}
                                            style={{
                                                width: ((width - 32) / 3) > 128 ? 128 : (width - 32) / 3,
                                                marginRight: 12
                                            }}
                                        />
                                    );
                                })
                                : null}
                        </View>
                    </ScrollView>
                </View>
                {
                    diseases && diseases.disease_seasonal.length > 0 && (
                        <>
                            <Space size={{ height: 12, width: 0 }} />
                            <ThemeText
                                type="medium"
                                text={'Disease Seasonal'}
                                style={{
                                    fontWeight: "bold",
                                    padding: 8,
                                }}
                            />
                            <View>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        justifyContent: 'center',
                                    }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {diseases.disease_seasonal.map((d, i) => {
                                                return (
                                                    <CategoryCard
                                                        key={i}
                                                        imageUrl={d.disease_thumbnail}
                                                        title={d.disease_name}
                                                        onPress={() => {
                                                            router.navigate(
                                                                ("/(tabs)/categories/disease/"
                                                                    + d.disease_id) as Href
                                                            )
                                                        }}
                                                        style={{
                                                            width: ((width - 32) / 3) > 128 ? 128 : (width - 32) / 3,
                                                            marginRight: 8
                                                        }}
                                                    />
                                                );
                                            })}
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </>
                    )
                }
                <Space size={{ height: 12, width: 0 }} />
                <ThemeText
                    type="medium"
                    text={'Disease By Target Group'}
                    style={{
                        fontWeight: "bold",
                        padding: 8,
                    }}
                />
                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            justifyContent: 'center',
                        }}>
                        <View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    diseases?.disease_by_target_group.disease_targetgroup_elderly ? (
                                        <DiseaseTargetGroupCard
                                            disease={diseases?.disease_by_target_group.disease_targetgroup_elderly}
                                            width={
                                                width * 0.6 > 256 ? 256 : width * 0.6
                                            }
                                        />
                                    ) : null
                                }
                            </View>
                            <Space size={{ height: 12, width: 0 }} />
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    diseases?.disease_by_target_group.disease_targetgroup_children ? (
                                        <DiseaseTargetGroupCard
                                            disease={diseases?.disease_by_target_group.disease_targetgroup_children}
                                            width={
                                                width * 0.6 > 256 ? 256 : width * 0.6
                                            }
                                        />
                                    ) : null
                                }
                            </View>
                        </View>
                        <Space size={{ height: 0, width: 12 }} />
                        <View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    diseases?.disease_by_target_group.disease_targetgroup_female ? (
                                        <DiseaseTargetGroupCard
                                            disease={diseases?.disease_by_target_group.disease_targetgroup_female}
                                            width={
                                                width * 0.6 > 256 ? 256 : width * 0.6
                                            }
                                        />
                                    ) : null
                                }
                            </View>
                            <Space size={{ height: 12, width: 0 }} />
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    diseases?.disease_by_target_group.disease_targetgroup_male ? (
                                        <DiseaseTargetGroupCard
                                            disease={diseases?.disease_by_target_group.disease_targetgroup_male}
                                            width={
                                                width * 0.6 > 256 ? 256 : width * 0.6
                                            }
                                        />
                                    ) : null
                                }
                            </View>
                        </View>
                        <Space size={{ height: 0, width: 12 }} />
                        <View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    diseases?.disease_by_target_group.disease_targetgroup_pregnant_women ? (
                                        <DiseaseTargetGroupCard
                                            disease={diseases?.disease_by_target_group.disease_targetgroup_pregnant_women}
                                            width={
                                                width * 0.6 > 256 ? 256 : width * 0.6
                                            }
                                        />
                                    ) : null
                                }
                            </View>
                            <Space size={{ height: 12, width: 0 }} />
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    diseases?.disease_by_target_group.disease_targetgroup_teenager ? (
                                        <DiseaseTargetGroupCard
                                            disease={diseases?.disease_by_target_group.disease_targetgroup_teenager}
                                            width={
                                                width * 0.6 > 256 ? 256 : width * 0.6
                                            }
                                        />
                                    ) : null
                                }
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <Space size={{ height: 12, width: 0 }} />
                <ThemeText
                    type="medium"
                    text={'Disease Body Part'}
                    style={{
                        fontWeight: "bold",
                        padding: 8,
                    }}
                />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        justifyContent: 'center',
                    }}>
                    <View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {diseases?.disease_body_part.length
                                ? diseases?.disease_body_part.map((d, i) => {
                                    return (
                                        <DiseaseBodyPart
                                            disease={d}
                                            width={
                                                width * 0.6 > 256 ? 256 : width * 0.6
                                            }
                                            style={{
                                                marginRight: i !== diseases.disease_body_part.length - 1 ? 12 : 0,
                                            }}
                                        />
                                    );
                                })
                                : null}
                        </View>
                    </View>
                </ScrollView>
                <Space size={{ height: 12, width: 0 }} />
                <ThemeText
                    type="medium"
                    text={'Disease Specialty'}
                    style={{
                        fontWeight: "bold",
                        padding: 8,
                    }}
                />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        justifyContent: 'center',
                    }}>
                    <View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {diseases?.disease_specialty.length
                                ? diseases?.disease_specialty.map((d, i) => {
                                    return (
                                        <DiseaseBodyPart
                                            disease={d}
                                            width={
                                                width * 0.6 > 256 ? 256 : width * 0.6
                                            }
                                            style={{
                                                marginRight: i !== diseases?.disease_specialty.length - 1 ? 12 : 0,
                                            }}
                                        />
                                    );
                                })
                                : null}
                        </View>
                    </View>
                </ScrollView>
                <Space size={{ height: 16, width: 0 }} />
            </ScrollView>
        </ThemeView>
    )
}

export default Disease