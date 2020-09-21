import React, { useContext } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Web3Store } from '@rsksmart/rif-ui'
import Login from 'components/atoms/Login'
import TitledRoundedCard from 'components/molecules/TitledRoundedCard'

const useStyles = makeStyles((theme: Theme) => ({
  roundedCard: {
    maxWidth: theme.spacing(70),
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%',
    },
  },
}))

const WithLoginCard = ({
  WrappedComponent,
  title = 'Connect your wallet',
  contentText = 'Connect your walet to see this content',
  ...props
}) => {
  const LoginCard = () => {
    const {
      state: { account },
    } = useContext(Web3Store)
    const classes = useStyles()

    if (account) return <WrappedComponent {...props} />
    return (
      <Grid container justify="center">
        <TitledRoundedCard
          title={title}
          titleProps={{ variant: 'h6', color: 'primary' }}
          roundedCardProps={{ color: 'secondary', className: classes.roundedCard }}
        >
          <>
            <Grid item xs={12}>
              <Typography color="secondary" align="center">{contentText}</Typography>
            </Grid>
            <Grid container justify="center">
              <Login modalInitiallyOpened />
            </Grid>
          </>
        </TitledRoundedCard>
      </Grid>
    )
  }

  return LoginCard
}

export default WithLoginCard
