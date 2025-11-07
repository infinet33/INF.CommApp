import { useState } from 'react';
import { FacilityProvider } from './contexts/FacilityContext';

export default function App() {
  return (
    <FacilityProvider>
      <div className="flex h-screen bg-gray-100">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900">Test App</h1>
          <p className="text-gray-600">If you can see this, the app is working!</p>
        </div>
      </div>
    </FacilityProvider>
  );
}