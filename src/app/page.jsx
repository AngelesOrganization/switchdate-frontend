"use client";

import React from 'react';
import Head from 'next/head';
import { Container, Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Image from 'next/image';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  padding: theme.spacing(3),
}));

const ButtonWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  flexWrap: 'wrap',
}));

export default function Home() {
  return (
    <>
      <Head>
        <title>Página de inicio</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <StyledContainer maxWidth="sm">
        <Image
          src="/logo-no-background.svg"
          width={300}
          height={300}
          alt="Picture of the author"
          sx={{alignSelf: 'flex-start'}}
        />
        <Typography component="p" gutterBottom>
          Haz buen uso de tu tiempo y de los tuyos.
        </Typography>
        <ButtonWrapper>
          <Button variant="contained" color="primary" href="/register">
            Registro
          </Button>
          <Button variant="contained" color="secondary" href="/login">
            Iniciar sesión
          </Button>
        </ButtonWrapper>
      </StyledContainer>
    </>
  );
}
