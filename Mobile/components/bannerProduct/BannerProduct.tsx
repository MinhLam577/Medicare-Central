import { View, Text, TextStyle, ViewStyle } from 'react-native'
import React from 'react'
import ThemeText from '../themeText/ThemeText';
import { useTheme } from '@react-navigation/native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Row from '../row/Row';
import Button from '../button/Button';
import { ArrowRight2 } from 'iconsax-react-native';

interface BannerProductProps {
  title: string;
  color?: string;
  titleColor?: string;
  titleStyle?: TextStyle;
  style?: ViewStyle;
}
const BannerProduct = ({
  title,
  color = useThemeColor({}, 'primary'),
  titleColor = useThemeColor({}, 'white'),
  style,
  titleStyle,
}: BannerProductProps) => {
  return (
    <View
      style={{
        backgroundColor: color,
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 8,
        ...style
      }}
    >
      <Row justifyContent='space-between'>
        <ThemeText
          text={title}
          type='medium'
          style={{
            color: titleColor,
            fontSize: 16,
            lineHeight: 16,
            ...titleStyle
          }}
        />
      </Row>
    </View>
  )
}

export default BannerProduct