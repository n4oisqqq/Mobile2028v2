import { User as UserIcon } from 'lucide-react';

// Mock Auth Context for demonstration
const useAuth = () => ({
  user: { full_name: 'John Doe' },
  isAuthenticated: true
});

export const Header = ({
  title,
  subtitle,
  icon: Icon,
}) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header
      className="relative overflow-hidden px-4 py-3 sticky top-0 z-50 border-b-2 border-white/20"
      data-testid="header"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900"></div>
      
      {/* Animated pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Animated elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-400/10 rounded-full animate-pulse"></div>
        <div className="absolute top-10 -right-20 w-32 h-32 bg-indigo-400/10 rounded-full animate-ping"></div>
      </div>

      <div className="relative flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/logome.webp"
            alt="MDRRMO"
            className="w-10 h-10 object-contain rounded-lg"
            data-testid="header-logo"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h1
                className="text-yellow-400 font-bold text-lg md:text-xl tracking-wide truncate bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent"
                data-testid="header-title"
              >
                {title}
              </h1>
              {Icon ? <Icon className="w-6 h-6 text-yellow-400" /> : null}
            </div>
            {subtitle ? (
              <p className="text-white/90 text-xs md:text-sm mt-0.5 truncate animate-pulse" data-testid="header-subtitle">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 px-3 py-1.5 rounded-full border border-yellow-500/30 backdrop-blur-sm">
              <UserIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-medium truncate max-w-[100px] animate-pulse">
                {user.full_name}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export const TopNav = ({ subtitle }) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="relative overflow-hidden px-4 py-4 border-b-2 border-white/20" data-testid="top-nav">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900"></div>
      
      {/* Animated pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Animated elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-5 left-10 w-24 h-24 bg-yellow-400/5 rounded-full animate-bounce"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-indigo-400/5 rounded-full animate-ping"></div>
      </div>

      <div className="relative flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <img 
            src="/logome.webp" 
            alt="MDRRMO Logo" 
            className="w-12 h-12 object-contain rounded-lg"
            data-testid="top-nav-logo"
          />
          <div>
            <h1 className="text-yellow-400 font-bold text-xl md:text-2xl tracking-wide bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              MDRRMO PIO DURAN
            </h1>
            {subtitle && (
              <p className="text-white/80 text-xs md:text-sm mt-1 animate-pulse">{subtitle}</p>
            )}
          </div>
        </div>
        
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 px-3 py-2 rounded-full border border-yellow-500/30 backdrop-blur-sm">
              <UserIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium animate-pulse">
                {user.full_name}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-yellow-400 font-semibold text-sm">
            Guest User
          </div>
        )}
      </div>
    </header>
  );
};

// Demo component to showcase the headers
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Header 
        title="Dashboard" 
        subtitle="Emergency Management System" 
        icon={UserIcon}
      />
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            Modern Header Components
          </h2>
          <p className="text-white/80 mb-8">
            These headers feature modern gradients, animated patterns, and smooth transitions
            without using external animation libraries.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <TopNav subtitle="Modern Emergency Response System" />
          </div>
        </div>
      </div>
    </div>
  );
}