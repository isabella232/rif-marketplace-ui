import React, {
  FC, useCallback, useContext, useState,
} from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Box, Grow, Typography,
} from '@material-ui/core'
import { colors, Web3Store } from '@rsksmart/rif-ui'
import AppContext, {
  AppContextProps, errorReporterFactory,
} from 'context/App/AppContext'
import { UIError } from 'models/UIMessage'
import Logger from 'utils/Logger'
import Web3 from 'web3'
import StakingContract from 'contracts/Staking'
import StorageContract from 'contracts/storage/contract'
import {
  Props as StakingContextProps,
} from 'context/Services/storage/staking/interfaces'
import StakingFab from 'components/molecules/storage/StakingFab'
import withStakingContext, { StakingContext }
  from 'context/Services/storage/staking/Context'
import { SupportedToken } from 'api/rif-marketplace-cache/rates/xr'
import { TokenAddressees } from 'context/Market/storage/interfaces'
import { JobDoneBox } from 'components/molecules'
import TxCompletePageTemplate
  from 'components/templates/TxCompletePageTemplate'
import TransactionInProgressPanel
  from 'components/organisms/TransactionInProgressPanel'
import GridRow from 'components/atoms/GridRow'
import GridItem from 'components/atoms/GridItem'
import RoundBtn from 'components/atoms/RoundBtn'
import BlockchainContext,
{ BlockchainContextProps }
  from 'context/Blockchain/BlockchainContext'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import StakingCard from './StakingCard'

const logger = Logger.getInstance()

const stakingIconSize = 10

const useStyles = makeStyles((theme: Theme) => createStyles({
  wrapper: {
    position: 'relative',
  },
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    right: 0,
    position: 'absolute',
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
    zIndex: 99,
    whiteSpace: 'nowrap',
    height: theme.spacing(stakingIconSize),
  },
  stakingIcon: {
    height: theme.spacing(stakingIconSize),
    minWidth: theme.spacing(stakingIconSize),
    marginLeft: -theme.spacing(stakingIconSize / 2),
    zIndex: 99,
  },
  fabTitle: {
    position: 'absolute',
    top: '-25px',
    right: '15px',
  },
  progressContainer: {
    background: 'rgba(275, 275, 275, 0.8)',
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'fixed',
    width: '100vw',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
}))

const stakeInProgressMsg = 'Staking your funds'
const unstakeInProgressMsg = 'Unstaking your funds'

const Staking: FC = () => {
  const classes = useStyles()

  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)

  const {
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const {
    state: {
      servicesAwaitingConfirmations: {
        staking: isAwaitingConfirmations,
      },
    },
    dispatch: bcDispatch,
  }: BlockchainContextProps = useContext(BlockchainContext)
  const reportError = useCallback((
    e: UIError,
  ) => errorReporterFactory(appDispatch)(e), [appDispatch])

  const {
    state: {
      stakes,
      totalStakedUSD,
    },
  } = useContext<StakingContextProps>(StakingContext)

  const [isExpanded, setIsExpanded] = useState(false)
  const [canWithdraw, setCanWithdraw] = useState(false)
  const [depositOpened, setDepositOpened] = useState(false)
  const [withdrawOpened, setWithdrawOpened] = useState(false)
  const [txInProgressMessage, setTxInProgressMessage] = useState('')
  const [txCompleteMsg, setTxCompleteMsg] = useState('')
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)
  const [showTxInProgress, setShowTxInProgress] = useState(false)

  const handleTxCompletedClose = (): void => {
    setShowTxInProgress(false)
    setProcessingTx(false)
    setTxOperationDone(false)
  }

  const handleDeposit = async (
    amount: number, currency: SupportedToken,
  ): Promise<void> => {
    //  users won't reach this point without a web3 instance
    if (!web3) return
    try {
      setTxInProgressMessage(stakeInProgressMsg)
      setProcessingTx(true)
      setShowTxInProgress(true)
      setTxCompleteMsg('Your funds have been staked!')
      setDepositOpened(false)

      const stakeContract = StakingContract.getInstance(web3 as Web3)
      const receipt = await stakeContract.stake(
        amount, TokenAddressees[currency], { from: account },
      )

      if (receipt) {
        setTxOperationDone(true)
        bcDispatch({
          type: 'SET_AWAITING_CONFIRMATIONS',
          payload: { service: 'staking', isAwaiting: true } as never,
        })
      }
    } catch (error) {
      logger.error('error depositing funds', error)
      reportError(new UIError({
        error,
        id: 'contract-storage-staking',
        text: 'Could not stake funds.',
      }))
    } finally {
      setProcessingTx(false)
    }
  }

  const handleWithdraw = async (
    amount: number, currency: SupportedToken,
  ): Promise<void> => {
    //  users won't reach this point without a web3 instance
    if (!web3) return
    try {
      setTxInProgressMessage(unstakeInProgressMsg)
      setProcessingTx(true)
      setShowTxInProgress(true)
      setTxCompleteMsg('Your funds have been unstaked!')
      setWithdrawOpened(false)
      const stakeContract = StakingContract.getInstance(web3 as Web3)
      const receipt = await stakeContract.unstake(
        amount, TokenAddressees[currency], { from: account },
      )

      if (receipt) {
        setTxOperationDone(true)
        bcDispatch({
          type: 'SET_AWAITING_CONFIRMATIONS',
          payload: { service: 'staking', isAwaiting: true } as never,
        })
      }
    } catch (error) {
      logger.error('error withdrawing funds', error)
      reportError(new UIError({
        error,
        id: 'contract-storage-staking',
        text: 'Could not withdraw your funds.',
      }))
    } finally {
      setProcessingTx(false)
    }
  }

  const handleOpenWithdraw = async (): Promise<void> => {
    if (!web3 || !account) return
    const storageContract = StorageContract.getInstance(web3 as Web3)
    const hasUtilizedCapacity = await storageContract.hasUtilizedCapacity(
      account as string, { from: account },
    )
    setCanWithdraw(Boolean(!hasUtilizedCapacity))
    setWithdrawOpened(true)
  }

  const handleExpandClick = (): void => setIsExpanded((exp) => !exp)

  const renderProgressOverlay = (): JSX.Element | null => {
    if (showTxInProgress && (processingTx || txOperationDone)) {
      return (
        <div className={classes.progressContainer}>
          {
            processingTx && (
              <TransactionInProgressPanel
                text={txInProgressMessage}
                progMsg="The waiting period is required to securely complete your action.
              Please do not close this tab until the process has finished."
              />
            )
          }
          {
            txOperationDone && (
              <TxCompletePageTemplate>
                <JobDoneBox text={txCompleteMsg} />
                <GridRow justify="center">
                  <GridItem>
                    <RoundBtn
                      onClick={handleTxCompletedClose}
                    >
                      Close
                    </RoundBtn>
                  </GridItem>
                </GridRow>
              </TxCompletePageTemplate>
            )
          }
        </div>
      )
    }
    return null
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
              isAwaitingConfirmations={isAwaitingConfirmations}
            />
          </div>
        </Grow>
        <StakingFab
          disabled={!account}
          className={classes.stakingIcon}
          onClick={handleExpandClick}
        />
      </div>
      <DepositModal
        totalStakedUSD={totalStakedUSD}
        stakes={stakes}
        onDeposit={handleDeposit}
        open={depositOpened}
        onClose={(): void => setDepositOpened(false)}
      />
      <WithdrawModal
        canWithdraw={canWithdraw}
        onClose={(): void => setWithdrawOpened(false)}
        open={withdrawOpened}
        onWithdraw={handleWithdraw}
        totalStakedUSD={totalStakedUSD}
        stakes={stakes}
      />
      {renderProgressOverlay()}
    </div>
  )
}

export default withStakingContext(Staking)