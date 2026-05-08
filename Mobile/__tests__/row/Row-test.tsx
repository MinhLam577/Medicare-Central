import Row from "@/components/row/Row"
import { render, screen } from "@testing-library/react-native"
import React from "react"
import { View } from "react-native"

describe('Row component', () => {
    test('should render correctly', () => {
        render(<Row>
            <></>
        </Row>)
        expect(screen.getByTestId('row')).toBeTruthy()
    })

    test('should render children correctly', () => {
        render(<Row>
            <View />   
        </Row>)
        expect(screen.getByTestId('row').children.length).toBe(1)
    })

    test('should render with justifyContent center correctly', () => {
        render(<Row justifyContent="center">
            <></>
        </Row>)
        expect(screen.getByTestId('row').props.style.justifyContent).toBe('center')
    })
})