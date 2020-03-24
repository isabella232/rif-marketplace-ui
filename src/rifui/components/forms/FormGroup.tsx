import React, { FC } from 'react';
import { FormGroup as MUIFormGroup, FormGroupProps as MUIFormGroupProps } from '@material-ui/core';

export type IFormGroupProps = MUIFormGroupProps;

const FormGroup: FC<IFormGroupProps> = ({ children, ...rest }) => {
  return (
    <MUIFormGroup {...rest}>
      {children}
    </MUIFormGroup>
  );
}

export default FormGroup;