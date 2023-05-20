"use client";

import CustomBottomNavigation from '@/components/CustomBottomNavigation';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import { Container } from '@mui/material';

export default function PanelLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <ResponsiveAppBar />
    <Container maxWidth="sm" style={{ flex: 1, paddingTop: '16px' }}>
      {children}
    </Container>
    <CustomBottomNavigation />
  </div>
  )
}
