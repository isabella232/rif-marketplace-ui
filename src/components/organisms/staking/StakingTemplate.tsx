import Box from '@material-ui/core/Box'
import Grow from '@material-ui/core/Grow'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { colors } from '@rsksmart/rif-ui'
import StakingFab from 'components/molecules/staking/StakingFab'
import React, { FC, useState } from 'react'
import { StakedBalances } from 'api/rif-marketplace-cache/storage/stakes'
import { SupportedTokenSymbol } from 'models/Token'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import StakingCard from './StakingCard'

export type StakingTemplateProps = {
  canWithdraw: boolean
  isEnabled: boolean
  isProcessing: boolean
  stakedBalances: StakedBalances
  totalStakedUSD: string
  onDeposit: (amount: number, currency: SupportedTokenSymbol) => Promise<void>
  onWithdraw: (amount: number, currency: SupportedTokenSymbol) => Promise<void>
}

const stakingIconSize = 10

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    position: 'relative',
  },
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    right: 0,
    position: 'absolute',
    zIndex: 99,
  },
  cardWrapper: {
    maxWidth: '550px',
    width: '100%',
  },
  infoContainer: {
    border: `${colors.primary} 1px solid`,
    alignItems: 'center',
    borderRadius: '50px 0px 0px 50px',
    paddingRight: theme.spacing(stakingIconSize / 2),
    backgroundColor: colors.white,
    whiteSpace: 'nowrap',
    height: theme.spacing(stakingIconSize),
  },
  stakingIcon: {
    height: theme.spacing(stakingIconSize),
    minWidth: theme.spacing(stakingIconSize),
    marginLeft: -theme.spacing(stakingIconSize / 2),
  },
  fabTitle: {
    position: 'absolute',
    top: '-25px',
    right: '15px',
  },
}))

const StakingTemplate: FC<StakingTemplateProps> = (props) => {
  const {
    canWithdraw,
    isEnabled,
    isProcessing,
    stakedBalances,
    totalStakedUSD,
    onDeposit,
    onWithdraw,
  } = props
  const classes = useStyles()

  const [isExpanded, setIsExpanded] = useState(false)
  const [depositOpened, setDepositOpened] = useState(false)
  const [withdrawOpened, setWithdrawOpened] = useState(false)

  const handleOpenWithdraw = (): void => {
    if (canWithdraw) setWithdrawOpened(true)
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.root}>
        <Typography
          className={classes.fabTitle}
          component="div"
          color="primary"
        >
          <Box fontWeight="fontWeightRegular">
            Staking
          </Box>
        </Typography>
        <Grow in={isExpanded}>
          <div className={classes.cardWrapper}>
            <StakingCard
              className={classes.infoContainer}
              onAddFundsClicked={(): void => setDepositOpened(true)}
              onWithdrawClicked={handleOpenWithdraw}
              totalStakedUSD={totalStakedUSD || '0.00'}
              isAwaitingConfirmations={isProcessing}
            />
          </div>
        </Grow>
        <StakingFab
          disabled={!isEnabled}
          className={classes.stakingIcon}
          onClick={(): void => setIsExpanded((exp) => !exp)}
        />
      </div>
      <DepositModal
        totalStakedUSD={totalStakedUSD}
        stakes={stakedBalances}
        onDeposit={onDeposit}
        open={depositOpened}
        onClose={(): void => setDepositOpened(false)}
      />
      <WithdrawModal
        canWithdraw={canWithdraw}
        onClose={(): void => setWithdrawOpened(false)}
        open={withdrawOpened}
        onWithdraw={onWithdraw}
        totalStakedUSD={totalStakedUSD}
        stakes={stakedBalances}
      />
    </div>
  )
}

export default StakingTemplate
