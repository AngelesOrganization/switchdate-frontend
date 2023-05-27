"use client"

import { Button, Container, TextField } from '@mui/material';
import { AccountCircle, Email, Lock, Abc } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { apiUsers, fetcher } from "@/requests/requests";

export default function Register() {
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    await fetcher(
      {
        url: apiUsers,
        data: {
          username: event.target.username.value,
          email: event.target.email.value,
          first_name: event.target.firstName.value,
          last_name: event.target.secondName.value,
          password: event.target.password.value,
          role: 'string'
        },
        method: 'POST'
      }
    );
    router.push("/login");
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
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            InputProps={{ startAdornment: <AccountCircle sx={{ mr: 1 }} /> }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            InputProps={{ startAdornment: <Email sx={{ mr: 1 }} /> }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            InputProps={{ startAdornment: <Abc sx={{ mr: 1 }} /> }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Second Name"
            name="secondName"
            InputProps={{ startAdornment: <Abc sx={{ mr: 1 }} /> }}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Contraseña"
            name="password"
            InputProps={{ startAdornment: <Lock sx={{ mr: 1 }} /> }}
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
