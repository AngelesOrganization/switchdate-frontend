"use client";

import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import HomeIcon from '@mui/icons-material/Home';


export default function CustomBottomNavigation({children}) {
  const router = useRouter();

  function goTo(route){
    console.log(route);
    router.push(route);
  }

  return (
    <Box sx={{ pb: 7, display: { xs: 'flex', md: 'none' } }}>
      {children}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation
                showLabels
                onChange={(event, newValue) => {
                  goTo(newValue);
                }}
              >
              <BottomNavigationAction label="Shifts" icon={<AccessTimeIcon />} value="/panel"/>
                <BottomNavigationAction label="Groups" icon={<GroupsIcon />} value="/panel/groups"/>
                <BottomNavigationAction label="Swaps" icon={<SwapCallsIcon />} value="/panel/swaps"/>
              </BottomNavigation>
            </Paper>
    </Box>
  );
}
