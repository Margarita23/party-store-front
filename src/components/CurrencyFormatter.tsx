import { FunctionComponent } from 'react'
import { Props } from '../interfaces/interfaces';

const CurrencyFormatter: FunctionComponent<Props> = ({ amount }) => {
  const formattedAmount = amount.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP'
  })

  return <span>{formattedAmount}</span>
}

export default CurrencyFormatter;
