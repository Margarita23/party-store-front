import { FunctionComponent } from 'react'

import { Props } from '../interfaces/interfaces'
import CurrencyFormatter from './CurrencyFormatter'


export const TotalPrice: FunctionComponent<Props> = ({ amount }) => {
    return <div>Total: {<CurrencyFormatter amount={amount} />}</div>
}
