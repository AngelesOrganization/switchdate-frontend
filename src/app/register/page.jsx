"use client"

import { useState, useEffect } from 'react';
import { Button, Container, TextField } from '@mui/material';
import { AccountCircle, Email, Lock, Abc } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Image from 'next/image';

async function fetcher(url) {
  console.log("url " + url[0]);
  console.log("body " + url[1]);

  const response = await fetch(url[0], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(url[1]),
  });

  if (!response.ok) {
    throw new Error('Error al cargar los datos');
  }

  return response.json();
};

export default function Register() {
  const router = useRouter();
  const [requestData, setRequestData] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const createUser = {
      'username': event.target.username.value,
      'email': event.target.email.value,
      'first_name': event.target.firstName.value,
      'last_name': event.target.secondName.value,
      'password': event.target.password.value,
      'role': 'string'
    }

    setRequestData(createUser);
  };

  const { data, error } = useSWR(requestData && ['http://localhost:8000/users', requestData], fetcher);

  useEffect(() => {
    if(requestData != null){
      setRequestData(null);
      router.push("/login");
    }
  }, [requestData, router]);

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src="/logo-no-background.svg"
          width={300}
          height={300}
          alt="Picture of the author"
        />
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            InputProps={{ startAdornment: <AccountCircle sx={{mr: 1}}/> }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            InputProps={{ startAdornment: <Email sx={{mr: 1}}/> }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            InputProps={{ startAdornment: <Abc sx={{mr: 1}}/> }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Second Name"
            name="secondName"
            InputProps={{ startAdornment: <Abc sx={{mr: 1}}/> }}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Contraseña"
            name="password"
            InputProps={{ startAdornment: <Lock sx={{mr: 1}}/> }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginY: '16px' }}
            type="submit"
            fullWidth
          >
            Registrarse
          </Button>
        </form>
      </Container>
    </>
  );
}
