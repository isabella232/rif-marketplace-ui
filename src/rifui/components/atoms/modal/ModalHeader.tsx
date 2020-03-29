import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { colors } from 'rifui/theme';

export interface ModalHeaderProps {
  className?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    borderBottom: `1px solid ${colors.gray2}`,
    width: '100%'
  }
}));

const ModalHeader: FC<ModalHeaderProps> = ({ children, className = '', ...rest }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default ModalHeader;