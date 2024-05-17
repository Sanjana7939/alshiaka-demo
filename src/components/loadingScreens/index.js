import { LinearProgress } from '@mui/material';
import * as React from 'react';

export default function LinearProgressSkeleton({ color }) {
  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 999,
      backgroundColor: 'rgba(255,255,255,0.5)',
    }}>
      <LinearProgress color={color || 'primary'} style={{ width: '100%' }} />
    </div>
  );
};
