import Tag from "@/components/tag/Tag"
import { render, screen } from "@testing-library/react-native"

describe('Tag component', () => {
    test('should render correctly', () => {
        render(<Tag text="" type="primary"/>)
        expect(screen.getByTestId('tag')).toBeDefined()
    })

    test('should render text correctly', () => {
        render(<Tag text="test" type="primary"/>)
        expect(screen.getByText('test')).toBeDefined()
    })
})