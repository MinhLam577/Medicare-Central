import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import '@testing-library/jest-dom'
import matchers from '@testing-library/jest-dom/matchers'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'

test('full app rendering/navigating', async () => {
  // render app trong terminal
  render(<App />, { wrapper: BrowserRouter })
})
