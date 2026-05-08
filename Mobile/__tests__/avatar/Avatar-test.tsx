import Avatar from "@/components/avatar/Avatar"
import { render, screen, userEvent } from '@testing-library/react-native';

describe('Avatar Component', () => {

    test('should render Avatar component', () => {
        render(<Avatar />)
        // Check if the component is rendered
        expect(screen.getByTestId('avatar')).toBeTruthy()
    })

    test('should render Avatar component with loading state', () => {
        render(<Avatar loading />)
        // Check if the component is rendered
        expect(screen.getByTestId('loading')).toBeTruthy()
    })

    test('should render default avatar image if no avatarUrl is provided', () => {
        render(<Avatar />)
        // Check if the default avatar image is rendered
        expect(screen.getByTestId('avatar').props.source).toEqual(require("../../assets/images/no_avatar.png"))
    })

    test('should render avatar image if avatarUrl is provided', () => {
        render(<Avatar avatarUrl="https://example.com/avatar.png" />)
        // Check if the avatar image is rendered
        expect(screen.getByTestId('avatar').props.source).toEqual({ uri: "https://example.com/avatar.png" })
    })
})