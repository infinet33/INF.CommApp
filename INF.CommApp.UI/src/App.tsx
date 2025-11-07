import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { NormalUserSidebar } from './components/NormalUserSidebar';
import { Header } from './components/Header';
import { MessagingPage } from './components/MessagingPage';
import { NormalUserMessagingPage } from './components/NormalUserMessagingPage';
import { ResidentsPage } from './components/ResidentsPage';
import { StaffPage } from './components/StaffPage';
import { UsersPage } from './components/UsersPage';
import { VendorsPage } from './components/VendorsPage';
import { FacilityProvider } from './contexts/FacilityContext';


export default function App() {
  const [activePage, setActivePage] = useState('messaging');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Toggle between 'admin' and 'normal' user views
  const [userType, setUserType] = useState<'admin' | 'normal'>('normal');

  const renderPage = () => {
    switch (activePage) {
      case 'messaging':
        return userType === 'admin' ? <MessagingPage /> : <NormalUserMessagingPage />;
      case 'residents':
        return <ResidentsPage />;
      case 'staff':
        return <StaffPage />;
      case 'vendors':
        return <VendorsPage />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-[#1e293b] mb-2">Settings</h2>
            <p className="text-[#64748b]">Coming soon...</p>
          </div>
        );
      default:
        return userType === 'admin' ? <MessagingPage /> : <NormalUserMessagingPage />;
    }
  };

  return (
    <FacilityProvider>
      <div className="flex h-screen bg-[#f9fafb]">
      {userType === 'admin' ? (
        <Sidebar 
          activePage={activePage} 
          onNavigate={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      ) : (
        <NormalUserSidebar 
          activePage={activePage}
          onNavigate={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          userType={userType}
          onUserTypeToggle={() => setUserType(userType === 'admin' ? 'normal' : 'admin')}
        />
        
        <main className="flex-1 overflow-hidden p-4 md:p-6">
          <div className="h-full max-w-[1600px] mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
    </FacilityProvider>
  );
}