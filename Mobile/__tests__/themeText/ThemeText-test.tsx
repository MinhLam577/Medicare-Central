import ThemeText from "@/components/themeText/ThemeText"
import { render, screen } from "@testing-library/react-native"

describe('ThemeText Component', () => {
    test('should render correctly', () => {
        render(<ThemeText type="title" />)
        expect(screen.getByTestId('themeText')).toBeTruthy()
    })

    test('should render text correctly', () => {
        render(<ThemeText type="title" text="Title" />)
        expect(screen.getByText('Title')).toBeTruthy()
    })
})