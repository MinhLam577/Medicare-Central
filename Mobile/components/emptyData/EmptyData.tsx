import React from 'react'
import { Dimensions, Image, ImageStyle, View, ViewStyle } from 'react-native'
import ThemeText from '../themeText/ThemeText';
import Space from '../space/Space';
import { useThemeColor } from '@/hooks/useThemeColor';

interface EmptyDataProps {
    title?: string;
    style?: ViewStyle;
    imageStyle?: ImageStyle;
}
const EmptyData = ({
    style,
    title,
    imageStyle
}: EmptyDataProps) => {
    const width = Dimensions.get('screen').width
    return (
        <View style={{
            width: width,
            alignItems: 'center',
            ...style
        }}>
            <Image
                source={{
                    uri: Image.resolveAssetSource(require('../../assets/images/unknown.png')).uri
                }}
                style={{
                    width: '30%',
                    aspectRatio: 1,
                    ...imageStyle
                }}
            />
            <Space size={{ height: 8, width: 0 }} />
            <ThemeText type='medium' text={title ?? 'No data found'} style={{ textAlign: 'center', color: useThemeColor({}, 'icon') }} />
            <Space size={{ height: 8, width: 0 }} />
        </View>
    )
}

export default EmptyData