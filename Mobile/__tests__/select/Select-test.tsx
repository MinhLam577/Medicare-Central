import Select from "@/components/select/Select"
import { fireEvent, render, screen } from "@testing-library/react-native"

describe('Select Component', () => {
    test('should render Select component', () => {
        render(<Select 
            onChange={() => {}}
            options={[]}
        />)
        expect(screen.getByTestId('select')).toBeTruthy()
    })

    test('should render Select component with label', () => {
        render(<Select 
            onChange={() => {}}
            options={[]}
            label="Select"
        />)
        expect(screen.getByText('Select')).toBeTruthy()
    })

    test('should render Select component with placeholder', () => {
        render(<Select 
            onChange={() => {}}
            options={[]}
            placeHolder="Select"
        />)
        expect(screen.getByText('Select')).toBeTruthy()
    })

    test('should render Select component with correct options', () => {
        render(<Select 
            value="option1"
            onChange={() => {}}
            options={[
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
            ]}
        />)
        fireEvent.press(screen.getByTestId('select'))
        expect(screen.getByText('Option 1')).toBeTruthy()
    })
})