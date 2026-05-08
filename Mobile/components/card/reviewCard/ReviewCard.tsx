import Avatar from '@/components/avatar/Avatar';
import Row from '@/components/row/Row';
import Space from '@/components/space/Space';
import ThemeText from '@/components/themeText/ThemeText';
import ThemeView from '@/components/themeView/ThemeView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { isTablet } from '@/utils/isTablet';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { View, ViewStyle, Image, Touchable, TouchableHighlight, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ImageViewer, ImageWrapper } from 'react-native-reanimated-viewer';
import StarRating from 'react-native-star-rating-widget';

interface ReviewCardProps {
    reviewRating: number;
    reviewImages: string[];
    reviewComment: string;
    userFullName: string;
    userAvatar: string;
    reviewCreatedAt: string;

    style?: ViewStyle;
}
const ReviewCard = ({
    reviewRating,
    reviewImages,
    reviewComment,
    userFullName,
    userAvatar,
    reviewCreatedAt,
    style
}: ReviewCardProps) => {
    const width = Dimensions.get('window').width;
    const [isShowMore, setIsShowMore] = React.useState(false);
    const imageRef = useRef(null);
    return (
        <ThemeView style={{
            backgroundColor: useThemeColor({}, 'itemBackground'),
            borderRadius: 8,
            ...style
        }}>
            <ImageViewer
                ref={imageRef}
                data={
                    reviewImages.map((el) => ({
                        key: el,
                        source: { uri: el },
                    })) ?? []
                }
            />
            <Row justifyContent='flex-start' alignItems='flex-start'>
                <Avatar
                    avatarUrl={userAvatar}
                    size={48}
                />
                <Space size={{ width: 16, height: 0 }} />
                <View style={{
                    flex: 1
                }}>
                    <ThemeText type='medium' text={userFullName} style={{
                        fontWeight: 'bold'
                    }} />
                    <Space size={{ width: 0, height: 4 }} />
                    <Row justifyContent='space-between'>
                        <StarRating
                            rating={reviewRating}
                            onChange={() => { }}
                            starSize={20}
                            starStyle={{
                                marginRight: 0,
                                marginLeft: 0
                            }}
                        />
                        <ThemeText type='small' text={reviewCreatedAt} />
                    </Row>
                    <Space size={{ width: 0, height: 12 }} />
                    <TouchableOpacity onPress={() => {
                        setIsShowMore(!isShowMore)
                    }}>
                        <ThemeText type='medium' text={reviewComment}
                            ellipsizeMode='tail'
                            numOfLines={isShowMore ? 0 : 3}
                        />
                    </TouchableOpacity>
                    <Space size={{ width: 0, height: 12 }} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{
                            flexGrow: 0,
                        }}
                    >
                        <Row>
                            {reviewImages.map((el, index) => {
                                return (
                                    <ImageWrapper
                                        viewerRef={imageRef}
                                        index={index}
                                        source={{
                                            uri: el,
                                        }}
                                        style={{
                                            marginRight: 4
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri: el
                                            }}
                                            style={{
                                                width: isTablet() ? width / 6 : width / 5,
                                                height: isTablet() ? width / 6 : width / 5,
                                                maxWidth: 120,
                                                maxHeight: 120,
                                                borderRadius: 8,
                                            }}
                                        />
                                    </ImageWrapper>
                                )
                            })}
                        </Row>
                    </ScrollView>
                </View>
            </Row>
        </ThemeView>
    )
}

export default ReviewCard