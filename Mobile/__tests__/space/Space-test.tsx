import Space from "@/components/space/Space"
import { render, screen } from "@testing-library/react-native"

describe('Space component', () => {
    test('should render correctly', () => {
        render(<Space 
            size={{
                width: 0,
                height: 0
            }}
        />)
        expect(screen.getByTestId('space')).toBeTruthy()
    })

    test('should render correctly with size', () => {
        render(<Space 
            size={{
                width: 100,
                height: 100
            }}
        />)
        expect(screen.getByTestId('space').props.style).toEqual({
            width: 100,
            height: 100
        })
    })
})