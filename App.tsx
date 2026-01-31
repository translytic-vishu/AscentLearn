import React, { useState, useEffect } from 'react';
import { Layout, Menu, FileText, Settings, Plus, Home, Moon, Sun, Search, LogOut, Shield } from 'lucide-react';
import { Resource } from './types';
import Dashboard from './components/Dashboard';
import ResourceView from './components/ResourceView';
import UploadModal from './components/UploadModal';
import ExamGeneratorModal from './components/ExamGeneratorModal';
import LandingPage from './components/LandingPage';
import { Logo } from './components/Logo';
import { getResources } from './services/mockDb';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'resource'>('dashboard');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const session = localStorage.getItem('ascent_session');
    if (session) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('ascent_session', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ascent_session');
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const refreshResources = async () => {
    setIsLoading(true);
    const data = await getResources();
    setResources(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshResources();
      // Enforce dark mode by default for Ascent theme
      document.documentElement.classList.add('dark');
    }
  }, [isAuthenticated]);

  const handleResourceClick = (id: string) => {
    setSelectedResourceId(id);
    setCurrentView('resource');
  };

  const handleExamReady = (id: string) => {
    refreshResources();
    handleResourceClick(id); // Immediately open the new exam
  }

  const handleHomeClick = () => {
    setCurrentView('dashboard');
    setSelectedResourceId(null);
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-white selection:bg-primary-600 selection:text-white font-sans">
      
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 flex flex-col border-r border-dark-border bg-[#050505] z-20">
        <div className="p-8 flex items-center gap-3">
          <Logo size={32} />
          <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">ASCENT</span>
        </div>

        <div className="px-6 mb-8">
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_20px_rgba(41,98,255,0.3)] hover:shadow-[0_0_30px_rgba(41,98,255,0.5)] transform hover:scale-[1.02] group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            <span>New Space</span>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavItem 
            icon={<Home size={20} />} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={handleHomeClick}
          />
          
          <div className="mt-10 mb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center justify-between">
            <span>Encrypted Library</span>
            <span className="bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded">{resources.length}</span>
          </div>
          
          <div className="space-y-1">
            {resources.slice(0, 5).map(res => (
              <NavItem 
                key={res.id}
                icon={<FileText size={18} />} 
                label={res.title} 
                active={selectedResourceId === res.id}
                onClick={() => handleResourceClick(res.id)}
              />
            ))}
          </div>
        </nav>

        <div className="p-6 border-t border-dark-border mt-auto bg-[#030303]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-accent-cyan border-2 border-black shadow-lg"></div>
              <div className="text-sm">
                <div className="font-bold text-white">Student User</div>
                <div className="text-[10px] text-primary-400 font-mono tracking-wider">PRO LICENSE</div>
              </div>
            </div>
            <Shield size={16} className="text-primary-600" />
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wide bg-zinc-900 hover:bg-red-900/20 text-zinc-400 hover:text-red-400 transition-all border border-zinc-800 hover:border-red-900/30"
          >
            <LogOut size={14} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-black">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-dark-border flex-shrink-0 bg-black/80 backdrop-blur-md sticky top-0 z-30">
          <div className="relative w-96 group text-zinc-500">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search secure database..." 
              className="w-full bg-[#0A0A0A] pl-12 pr-4 py-3 text-sm outline-none border border-dark-border rounded-xl transition-all duration-300 focus:border-primary-600 focus:bg-black focus:shadow-[0_0_15px_rgba(41,98,255,0.2)] text-white placeholder:text-zinc-700"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full border border-primary-900/50 bg-primary-900/10 text-[10px] font-mono text-primary-400 font-bold tracking-wider animate-pulse">
              ● SECURE CONNECTION
            </div>
          </div>
        </header>

        {/* View Content with Transition Key */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 scroll-smooth scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-black">
          <div key={currentView === 'dashboard' ? 'dash' : selectedResourceId} className="animate-enter">
            {currentView === 'dashboard' ? (
              <Dashboard 
                darkMode={true} 
                resources={resources} 
                onResourceClick={handleResourceClick}
                onUploadClick={() => setIsUploadOpen(true)}
                onExamClick={() => setIsExamOpen(true)}
              />
            ) : (
              <ResourceView 
                key={selectedResourceId} 
                resourceId={selectedResourceId!} 
                onBack={handleHomeClick}
                darkMode={true}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {isUploadOpen && (
        <UploadModal 
          isOpen={isUploadOpen} 
          onClose={() => setIsUploadOpen(false)} 
          onUploadComplete={refreshResources}
          darkMode={true}
        />
      )}
      
      {isExamOpen && (
        <ExamGeneratorModal 
          isOpen={isExamOpen}
          onClose={() => setIsExamOpen(false)}
          onExamReady={handleExamReady}
        />
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 border group ${
      active 
        ? 'bg-primary-900/20 text-white border-primary-500/50 shadow-[0_0_10px_rgba(41,98,255,0.2)]' 
        : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900'
    }`}
  >
    <span className={`${active ? 'text-primary-400 drop-shadow-[0_0_5px_rgba(41,98,255,0.8)]' : 'group-hover:text-zinc-300'}`}>{icon}</span>
    <span className="truncate">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(41,98,255,1)]"></div>}
  </button>
);

export default App;