import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import Hash from '../src/components/Hash'

test('renders name', async () => {
  const { getByText } = render(<Hash />)

  await expect.element(getByText('0xbf56c0728fd4e9cf64bfaf6dabab81554103298cdee5cc4d580433aa25e98b00')).toBeInTheDocument()
})