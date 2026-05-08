import SearchBox from "@/components/searchBox/SearchBox"
import { fireEvent, render, screen } from "@testing-library/react-native"
import { Text } from "react-native"

describe('SearchBox Component', () => {
    test('should render searchBox type button correctly', () => {
        render(<SearchBox placeholder="Search" />)
        expect(screen.getByTestId('searchBox-button')).toBeTruthy()
    })

    test('should render searchBox type text correctly', () => {
        render(<SearchBox placeholder="Search" type="text" />)
        expect(screen.getByTestId('searchBox-text')).toBeTruthy()
    })

    test('should render searchBox with icon correctly', () => {
        render(<SearchBox placeholder="Search" icon={<Text>Icon</Text>} />)
        expect(screen.getByText('Icon')).toBeTruthy()
    })

    test('should render searchBox-Text with value correctly', () => {
        render(<SearchBox placeholder="Search" value="Value" type="text" />)
        expect(screen.getByDisplayValue('Value')).toBeTruthy()
    })

    test('searchBox-Button onPress should be called', () => {
        const onPress = jest.fn()
        render(<SearchBox placeholder="Search" onPress={onPress} />)
        fireEvent.press(screen.getByTestId('searchBox-button'))
        expect(onPress).toHaveBeenCalled()
    })

    test('searchBox-Text onChangeText should be called', () => {
        const onChangeText = jest.fn()
        render(<SearchBox placeholder="Search" value="search" onChangeText={onChangeText} type="text" />)
        screen.getByDisplayValue('search').props.onChangeText('Text')
        expect(onChangeText).toHaveBeenCalled()
    })
})