import Badge from "@/components/badge/Badge"
import { render, screen } from "@testing-library/react-native"

describe('Badge Component', () => {
    test('should render correctly', () => {
        render(
            <Badge count={1} >
                <></>
            </Badge>
        )
        expect(screen.getByTestId('badge')).toBeTruthy()
    })

    test('should render badge count correctly', () => {
        render(
            <Badge count={3} >
                <></>
            </Badge>
        )
        expect(screen.getByText('3')).toBeTruthy()
    })
})