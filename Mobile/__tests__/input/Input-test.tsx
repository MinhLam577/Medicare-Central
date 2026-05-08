import Input from "@/components/input/Input"
import { render, screen } from "@testing-library/react-native"

describe('Input Component', () => {
    test('should render correctly', () => {
        render(<Input type="text" value=""/>)
        expect(screen.getByTestId('input-text')).toBeTruthy()
    })

    test('should render input text correctly', () => {
        render(<Input type="text" value="Input"/>)
        expect(screen.getByDisplayValue('Input')).toBeTruthy()
    })
    
    test('should render input password correctly', () => {
        render(<Input type="password" value="Password"/>)
        expect(screen.getByDisplayValue('Password')).toBeTruthy()
    })

    test('text change event should work', () => {
        const onChange = jest.fn()
        render(
            <Input type="text" value="Input" onChangeText={onChange} />
        )

        const input = screen.getByDisplayValue('Input')
        input.props.onChangeText('New Input')
        expect(onChange).toHaveBeenCalled()
    })
})