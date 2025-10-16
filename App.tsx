
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ContentPlanner from './components/ContentPlanner';

const App: React.FC = () => {
  return (
    <div>
      <ContentPlanner />
      <SpeedInsights />
    </div>
  );
};

export default App;
