import Button from "@/components/button/Button"
import { fireEvent, render, screen } from "@testing-library/react-native"


describe('Button Component', () => {
    test('should render correctly', () => {
        render(<Button />)
        expect(screen.getByTestId('button')).toBeTruthy()
    })

    test('should render button text correctly', () => {
        render(<Button text='Button' />)
        expect(screen.getByText('Button')).toBeTruthy()
    })

    test('should render loading state correctly', () => {
        render(<Button loading variant="fill"/>)
        expect(screen.getByTestId('loading')).toBeTruthy()
    })

    test('onPress event should work', () => {
        const onPress = jest.fn()
        render(<Button onPress={onPress} />)
        const button = screen.getByTestId('button')
        fireEvent.press(button)
        expect(onPress).toHaveBeenCalled()
    })
})