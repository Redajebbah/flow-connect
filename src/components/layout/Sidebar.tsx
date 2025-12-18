import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Plus, 
  Users, 
  FileText, 
  Settings,
  Droplets,
  Zap,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { currentUser } from '@/lib/mockData';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Dossiers', href: '/dossiers', icon: FolderOpen },
  { name: 'Nouveau dossier', href: '/dossiers/new', icon: Plus },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

const roleLabels: Record<string, string> = {
  admin: 'Administrateur',
  commercial: 'Agent Commercial',
  technical: 'Service Technique',
  supervisor: 'Superviseur',
};

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg gradient-secondary">
              <Droplets className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500">
              <Zap className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground">UTILITY</h1>
            <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">Gestion Abonnements</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href));
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-sidebar-primary" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-primary font-semibold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {roleLabels[currentUser.role]}
              </p>
            </div>
            <button className="p-2 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
