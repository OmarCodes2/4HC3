import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({ children }) => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  
  // Mobile breakpoint - treat as mobile if width is less than 768px
  const isMobile = width < 768;

  if (!isWeb) {
    // On native platforms, just return children
    return <>{children}</>;
  }

  // On web, wrap in a centered container that looks like a phone
  const webContainerStyle: any = {
    ...styles.webContainer,
    padding: isMobile ? 0 : 20,
  };

  const phoneContainerStyle: any = {
    ...styles.phoneContainer,
    width: isMobile ? '100%' : 375, // iPhone width
    height: isMobile ? '100%' : 812, // iPhone height
    maxHeight: isMobile ? '100%' : '90vh',
    boxShadow: isMobile ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: isMobile ? 0 : 0,
  };

  return (
    <View style={webContainerStyle}>
      <View style={phoneContainerStyle}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  phoneContainer: {
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    flex: Platform.OS === 'web' ? 0 : 1,
  },
});

