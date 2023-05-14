"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

export default function GroupList(props) {
  return (
    <Box sx={{ pb: 7 }}>
      <List>
        {
          props.groups.map((group, index) => (
            <ListItemButton>
              <ListItemAvatar>
                <Avatar alt="Profile Picture" src={group.name} />
              </ListItemAvatar>
              <ListItemText primary={group.name} secondary={group.updated_at} />
            </ListItemButton>
          ))
        }
      </List>
    </Box>
  );
}
