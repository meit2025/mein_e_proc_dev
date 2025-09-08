import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Checkbox,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

type TransferListProps = {
  leftItems: readonly any[];
  rightItems: readonly any[];
  onTransfer?: (left: readonly any[], right: readonly any[]) => void;
};

const TransferList: React.FC<TransferListProps> = ({ leftItems, rightItems, onTransfer }) => {
  const [checked, setChecked] = useState<readonly any[]>([]);
  const [left, setLeft] = useState<readonly any[]>(leftItems);
  const [right, setRight] = useState<readonly any[]>(rightItems);

  useEffect(() => {
    setLeft(leftItems);
    setRight(rightItems);
  }, [leftItems, rightItems]);

  const not = (a: readonly any[], b: readonly any[]) =>
    a.filter((value) => !b.some((item) => item.value === value.value));

  const intersection = (a: readonly any[], b: readonly any[]) =>
    a.filter((checkedItem) => b.some((item) => item.value === checkedItem.value));

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: any) => () => {
    const currentIndex = checked.findIndex((item) => item.value === value.value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
    onTransfer?.([], right.concat(left));
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    onTransfer?.(not(left, leftChecked), right.concat(leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    onTransfer?.(left.concat(rightChecked), not(right, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
    onTransfer?.(left.concat(right), []);
  };

  const customList = (items: readonly any[]) => {
    const safeItems = Array.isArray(items) ? items : [];
    return (
      <Paper sx={{ height: '32rem', overflow: 'auto' }}>
        <List dense component='div'>
          {safeItems.map((value: any) => {
            const labelId = `transfer-list-item-${value.value}-label`;
            return (
              <ListItemButton key={value.value} onClick={handleToggle(value)}>
                <ListItemIcon>
                  <Checkbox
                    checked={checked.some((item) => item.value === value.value)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${value.label}`} />
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box>{customList(left)}</Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Button
          sx={{ my: 0.5 }}
          variant='outlined'
          size='small'
          onClick={handleAllRight}
          disabled={left.length === 0}
          aria-label='move all right'
        >
          ≫
        </Button>
        <Button
          sx={{ my: 0.5 }}
          variant='outlined'
          size='small'
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label='move selected right'
        >
          &gt;
        </Button>
        <Button
          sx={{ my: 0.5 }}
          variant='outlined'
          size='small'
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label='move selected left'
        >
          &lt;
        </Button>
        <Button
          sx={{ my: 0.5 }}
          variant='outlined'
          size='small'
          onClick={handleAllLeft}
          disabled={right.length === 0}
          aria-label='move all left'
        >
          ≪
        </Button>
      </Box>
      <Box>{customList(right)}</Box>
    </Box>
  );
};

export default TransferList;
