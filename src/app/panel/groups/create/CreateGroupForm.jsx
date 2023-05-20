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

export default function CreateGroupFormComponent(props) {
    const router = useRouter();
    const [createGroupData, setCreateGroupData] = useState(null);

  const handleCreateGroup = async (event) => {
    event.preventDefault();

    const createGroup = {
        'name': event.target.groupName.value,
        'description': event.target.groupDescription.value
    }

    setCreateGroupData(createGroup);
  };

    const { data, error } = useSWR(createGroupData && ['http://127.0.0.1:8000/groups', props.token, createGroupData], fetcher);

    useEffect(() => {
        if(createGroupData != null){
            setCreateGroupData(null);
          router.push("/panel/groups");
        }
      }, [createGroupData, router]);

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
