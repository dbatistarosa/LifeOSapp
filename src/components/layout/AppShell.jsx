import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Navbar from './Navbar';

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-bg-void">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pb-20 lg:pb-0 overflow-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
