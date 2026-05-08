import { View, Text, ViewStyle } from 'react-native'
import React from 'react'
import { Image } from 'iconsax-react-native'
import { useThemeColor } from '@/hooks/useThemeColor'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface UploadImageProps {
    style?: ViewStyle;
    onPress?: () => void;
}
const UploadImage = ({
    style,
    onPress
}: UploadImageProps) => {
    const [height, setHeight] = React.useState(0)
    return (
        <TouchableOpacity
            onLayout={(event) => {
                setHeight(event.nativeEvent.layout.height)
            }}
            onPress={onPress}
            style={{
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                borderStyle: 'dashed',
                borderWidth: 1,
                width: height,
                ...style
            }}>
            <Image size={20} color={useThemeColor({}, 'icon')} />
        </TouchableOpacity>
    )
}

export default UploadImage