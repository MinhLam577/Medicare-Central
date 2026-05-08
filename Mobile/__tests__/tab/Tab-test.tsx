import Tab from "@/components/tab/Tab"
import { render, screen } from "@testing-library/react-native"

describe('Tab component', () => {
    test('should render correctly', () => {
        render(<Tab 
            tabs={[]}
            activeTab=""
            onChangeTab={() => {}}
            type="primary"
        />)
        expect(screen.getByTestId('tab')).toBeTruthy()
    })

    test('should render children', () => {
        const tabs = [
            {
                key: 'key',
                label: 'label'
            }
        ]
        render(<Tab 
            tabs={tabs}
            activeTab="key"
            onChangeTab={() => {}}
            type="primary"
        />)
        expect(screen.getByText('label')).toBeTruthy()
    })
})