"use client"

import { Button, Container, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Image from 'next/image';

async function fetcher(data) {
  const response = await fetch(data[0], {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${data[1]}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data[2]),
  });

  if (!response.ok) {
    throw new Error('Error al cargar los datos');
  }

  return response.json();
};

export default function InviteGroupFormComponent(props) {
    const router = useRouter();
    const [inviteGroupState, setInviteGroupState] = useState(null);

  const handleInviteGroup = async (event) => {
    event.preventDefault();

    const inviteGroup = {
        'candidate_username': event.target.username.value,
        'group_id': props.group_id
    }

    setInviteGroupState(inviteGroup);
  };

    const { data, error } = useSWR(inviteGroupState && ['http://127.0.0.1:8000/groups/join', props.token, inviteGroupState], fetcher);

    useEffect(() => {
        if(inviteGroupState != null){
            setInviteGroupState(null);
            router.push(`/panel/groups/${props.group_id}`);
        }
      }, [inviteGroupState]);

      return (
        <Container
          maxWidth="sm"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <form onSubmit={handleInviteGroup}>
            <TextField
              fullWidth
              margin="normal"
              label="User Name"
              name="username"
            />

            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: '16px' }}
              type="submit"
              fullWidth
            >
              Invitar usuario
            </Button>
          </form>
        </Container>
      );
    
}
