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
import { Card } from '@mui/material';

export default function GroupList(props) {
  return (
    <Box sx={{ padding: 0 }}>
      <List>
        {
          props.groups.map((group, index) => (
            <Card key={group.id} variant="outlined" sx={{mb: "4px"}}>
              <ListItemButton key={group.id} href={`/panel/groups/${group.id}`}>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={group.name} />
                </ListItemAvatar>
                <ListItemText primary={group.name} secondary={group.updated_at} />
              </ListItemButton>
            </Card>
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
