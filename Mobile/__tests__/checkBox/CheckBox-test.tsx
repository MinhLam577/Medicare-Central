import CheckBox from "@/components/checkBox/CheckBox"
import { render, screen } from "@testing-library/react-native"

describe('CheckBox Component', () => {
    test('should render CheckBox component', () => {
        render(<CheckBox isChecked={true} />)
        expect(screen.getByTestId('checkbox')).toBeTruthy()
    })

    test('should render CheckBox component with label', () => {
        render(<CheckBox isChecked={true} label="CheckBox" />)
        expect(screen.getByText('CheckBox')).toBeTruthy()
    })

    test('should render CheckBox component with right checked state', () => {
        render(<CheckBox isChecked={true} />)
        expect(screen.getByTestId('checked')).toBeTruthy()
    })
})