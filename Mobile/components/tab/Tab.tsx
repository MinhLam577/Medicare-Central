import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import Row from '../row/Row';
import { useThemeColor } from '@/hooks/useThemeColor';
import ThemeText from '../themeText/ThemeText';

interface TabItem {
    key: string;
    label: string;
}

interface TabProps {
    tabs: TabItem[];
    activeTab: string;
    onChangeTab: (key: string) => void;
    type: 'primary' | 'secondary';
}

const Tab = ({
    tabs,
    activeTab,
    onChangeTab,
    type = 'primary'
}: TabProps) => {
    const primary = useThemeColor({}, 'primary')
    const text = useThemeColor({}, 'text')
    if (type === 'primary')
        return (
            <ScrollView
                testID='tab'
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                    flexGrow: 0,
                    flexDirection: 'row',
                }}
            >
                {tabs.map((item, index) => (
                    <TouchableOpacity
                        onPress={() => onChangeTab(item.key)}
                        key={index}
                        style={{
                            padding: 10,
                        }}
                    >
                        <ThemeText type='medium' text={item.label} style={{ color: activeTab === item.key ? primary : text }} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        )
}

export default Tab