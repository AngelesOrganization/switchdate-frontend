"use client"

import { Button, Container, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';

import { fetcher } from "@/requests/requests";
import { apiGroups } from '@/requests/requests';

export default function CreateGroupFormComponent(props) {
  const router = useRouter();

  async function handleCreateGroup(event) {
    event.preventDefault();

    await fetcher(
      {
        url: apiGroups,
        accessToken: props.token,
        data: {
          'name': event.target.groupName.value,
          'description': event.target.groupDescription.value
        },
        method: 'POST'
      }
    );
    
    router.push("/panel/groups");
  };

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
      <form onSubmit={handleCreateGroup}>
        <TextField
          fullWidth
          margin="normal"
          label="Group Name"
          name="groupName"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Group Description"
          name="groupDescription"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: '16px' }}
          type="submit"
          fullWidth
        >
          Create Group
        </Button>
      </form>
    </Container>
  );

}
