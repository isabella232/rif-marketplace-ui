import Typography, { TypographyProps } from '@material-ui/core/Typography'
import { CopyTextTooltip } from '@rsksmart/rif-ui'
import React, { FC } from 'react'
import { shortChecksumAddress } from 'utils/stringUtils'

export interface AddressItemProps extends TypographyProps {
  pretext?: string
  value: string
}

const RifAddress: FC<AddressItemProps> = ({ pretext, value, ...rest }) => {
  const address = shortChecksumAddress(value)

  const displayElement = (
    <Typography {...rest}>
      {pretext
        ? `${pretext} (${address})`
        : address}
    </Typography>
  )
  return <CopyTextTooltip fullText={value} displayElement={displayElement} />
}

export default RifAddress