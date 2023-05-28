"use client"

import { useState } from 'react';
import { Button, Container, TextField } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

export default function LoginComponent() {
  const router = useRouter();
  const [requestData, setRequestData] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    const result = await signIn('username-login', {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      console.log(result.error);
    } else {
      router.push('/panel');
    }
  };

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
        <form onSubmit={handleLogin}>
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
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth 
            href="/register">
            Registrarse
          </Button>
        </form>
      </Container>
    </>
  );
}
