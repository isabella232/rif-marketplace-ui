import React, { FC } from 'react';

import './Marketplace.css';
import { MarketItemType } from 'models/Market';
import { Table, TableHead, TableRow, TableCell, TableBody } from 'rifui';
import { makeStyles } from '@material-ui/core';

export interface TableHeaders {
  [itemName: string]: string | React.ElementType
}
export interface MarketplaceProps {
  className?: string;
  items: MarketItemType[];
  headers: TableHeaders;
}


const useStyles = makeStyles({
  th: {
    align: 'center'
  },
  'tc-domain': {
    align: 'left'
  }
});

const Marketplace: FC<MarketplaceProps> = ({
  className = '',
  items,
  headers,
}) => {
  const classes = useStyles();


  return (
    <div className={'marketplace ' + className}>
      <div className="content">
        <Table>
          {/* TODO: add those properties to easily style tables in rifui library
           - <Table striped borderless hover responsive="sm"> */}
          <TableHead>
            <TableRow>
              {Object.keys(headers).map((itemName: string) => (
                <TableCell className={classes[`th ${itemName}`]} key={`th-${itemName}`}>{headers[itemName]}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item._id}>
                {
                  Object.keys(headers).map((itemName: string) => (
                    <TableCell className={classes[`tc-${itemName}`]} key={item._id + itemName}>
                      {item[itemName]}
                    </TableCell>
                  ))
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Marketplace;
