import ThemeView from "@/components/themeView/ThemeView"
import { Text } from "react-native"
import { render, screen } from "@testing-library/react-native"

describe('ThemeView component', () => {
    test('should render correctly', () => {
        render(<ThemeView>
            <></>
        </ThemeView>)
        expect(screen.getByTestId('themeView')).toBeTruthy()
    })
    test('should render children', () => {
        render(<ThemeView>
            <Text>Children</Text>
        </ThemeView>)
        expect(screen.getByText('Children')).toBeTruthy()
    })
})