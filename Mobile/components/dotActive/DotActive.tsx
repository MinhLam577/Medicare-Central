import { View, Text } from 'react-native'
import React from 'react'
import { useThemeColor } from '@/hooks/useThemeColor';

interface DotActiveProps {
    numberOfDots: number;
    activeIndex: number;
}
const DotActive = ({
    numberOfDots,
    activeIndex
}: DotActiveProps) => {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 8
        }}>
            {
                Array.from({ length: numberOfDots }).map((_, index) => (
                    <View key={index} style={{
                        width: activeIndex === index ? 8 : 4,
                        height: activeIndex === index ? 8 : 4,
                        borderRadius: 100,
                        backgroundColor: activeIndex === index ? useThemeColor({}, 'primary') : 'gray',
                        marginHorizontal: 2
                    }} />
                ))
            }
        </View>
    )
}

export default DotActive