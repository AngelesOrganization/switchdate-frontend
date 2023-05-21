"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';

export default function GroupList(props) {
  return (
    <Box sx={{ pb: 7 , mt: 6}}>
      <List>
        {
          props.groups.map((group, index) => (
            <ListItemButton key={group.id} href={`/panel/groups/${group.id}`}>
              <ListItemAvatar>
                <Avatar alt="Profile Picture" src={group.name} />
              </ListItemAvatar>
              <ListItemText primary={group.name} secondary={group.updated_at} />
            </ListItemButton>
          ))
        }
      </List>
      <Link href="/panel/groups/create">
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'absolute',
            right: '15px',
            bottom: '76px',
          }}
        >
          <AddIcon />
        </Fab>
      </Link>

    </Box>
  );
}
