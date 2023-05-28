"use client"

import { Button, Container, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { fetcher } from "@/requests/requests";
import { apiGroupsJoin } from '@/requests/requests';

export default function InviteGroupFormComponent(props) {
  const router = useRouter();

  async function handleInviteGroup(event) {
    event.preventDefault();

    await fetcher(
      {
        url: apiGroupsJoin,
        accessToken: props.token,
        data: {
          'candidate_username': event.target.username.value,
          'group_id': props.group_id
        },
        method: 'POST'
      }
    );
    router.push(`/panel/groups/${props.group_id}`);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
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
