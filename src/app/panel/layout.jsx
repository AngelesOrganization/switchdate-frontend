"use client";

import CustomBottomNavigation from '@/components/CustomBottomNavigation';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';

export default function PanelLayout({ children }) {
  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>
      {children}
      <CustomBottomNavigation></CustomBottomNavigation>
    </div>
  )
}
