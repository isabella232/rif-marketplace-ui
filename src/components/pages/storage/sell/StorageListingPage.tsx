import React, { FC, useContext } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button as RUIButton } from '@rsksmart/rif-ui'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import PlanItems from 'components/organisms/storage/listing/PlanItems'
import BaseSettings from 'components/organisms/storage/listing/BaseSettings'
import StorageListingStore from 'store/Market/storage/ListingStore'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(10),
    width: '100%',
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: theme.spacing(100),
    },
    width: '100%',
  },
  planGrid: {
    marginBottom: theme.spacing(3),
  },
}))

const StorageListingPage = () => {
  const {
    state: {
      planItems, availableSize, currency, system,
    },
  } = useContext(StorageListingStore)

  const classes = useStyles()

  const handleSubmit = () => {
    // TODO: validate the plan and comunicate with the contract
  }

  const isSubmitEnabled = planItems.length
    && availableSize
    && currency
    && system

  return (
    <div className={classes.root}>
      <div className={`${classes.container}`}>
        <Typography gutterBottom variant="h5" color="primary">List storage service</Typography>
        <Typography gutterBottom color="secondary" variant="subtitle1" align="center">
          Fill out the form below to list your service. All information provided is meant to be true and correct.
        </Typography>
        <Grid className={classes.planGrid} container spacing={5}>
          <BaseSettings />
          <PlanItems />
        </Grid>
        <RUIButton
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}
          color="primary"
          rounded
          variant="contained"
        >
          List storage
        </RUIButton>
        {
          !!isSubmitEnabled
          && (
            <Typography gutterBottom color="secondary" variant="subtitle1" align="center">
              Your wallet will open and you will be asked to confirm the transaction for listing your service.
            </Typography>
          )
        }
      </div>
    </div>
  )
}

export default StorageListingPage
