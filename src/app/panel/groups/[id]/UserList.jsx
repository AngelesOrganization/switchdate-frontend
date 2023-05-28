"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import { Card } from '@mui/material';

export default function UserListComponent(props) {
  return (
    <Box>
      <List>
        {
          props.users.map((user, index) => (

            <Card key={user.id} variant="outlined" sx={{mb: "4px"}}>
              <ListItemButton key={user.id} href={`/panel/groups/${props.groupId}/user/${user.id}`}>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={user.name} />
                </ListItemAvatar>
                <ListItemText primary={user.first_name} secondary={user.email} />
              </ListItemButton>
            </Card>
          ))
        }
      </List>

      <Link href={`/panel/groups/${props.groupId}/invite`}>
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
