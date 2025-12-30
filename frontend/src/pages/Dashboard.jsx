import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/Header';
import { 
  Phone, 
  AlertTriangle, 
  Cloud, 
  Map, 
  Briefcase, 
  BookOpen, 
  FileText,
  Shield,
  Zap,
  Wind,
  Users,
  Heart,
  Navigation,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const modules = [
  {
    title: 'Report an Incident',
    icon: AlertTriangle,
    route: '/report-incident',
    description: 'Submit incident report',
    color: 'from-red-500 to-red-600',
    animationDelay: '0.1s'
  },
  {
    title: 'Typhoon Dashboard',
    icon: Cloud,
    route: '/typhoon-dashboard',
    description: 'Live monitoring',
    color: 'from-blue-500 to-cyan-600',
    animationDelay: '0.2s'
  },
  {
    title: 'Interactive Map',
    icon: Map,
    route: '/interactive-map',
    description: 'Evacuation centers',
    color: 'from-green-500 to-emerald-600',
    animationDelay: '0.3s'
  },
  {
    title: 'Go Bag Checklist',
    icon: Briefcase,
    route: '/go-bag-checklist',
    description: 'Emergency kit items',
    color: 'from-yellow-500 to-orange-600',
    animationDelay: '0.4s'
  },
  {
    title: 'Support Resources',
    icon: BookOpen,
    route: '/support-resources',
    description: 'Help & information',
    color: 'from-purple-500 to-pink-600',
    animationDelay: '0.5s'
  },
  {
    title: 'Emergency Plan',
    icon: FileText,
    route: '/emergency-plan',
    description: 'Family safety plan',
    color: 'from-indigo-500 to-purple-600',
    animationDelay: '0.6s'
  },
];

const adminModule = {
  title: 'Admin Dashboard',
  icon: Shield,
  route: '/admin',
  description: 'Manage incidents & hotlines',
  color: 'from-gray-600 to-slate-700',
  animationDelay: '0.7s'
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20" data-testid="dashboard">
      <TopNav subtitle="Public Preparedness for Disaster" />
      
      <main className="px-6 py-8 max-w-4xl mx-auto">
        {/* 24/7 Hotline Numbers Banner */}
        <button
          onClick={() => navigate('/hotlines')}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-2xl p-6 mb-8 flex items-center justify-center gap-4 transition-all shadow-xl transform hover:scale-105 animate-fade-in"
          data-testid="hotline-banner"
        >
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
              24/7
            </div>
            <div className="text-left">
              <h2 className="font-bold text-2xl tracking-wide" data-testid="hotline-title">
                HOTLINE NUMBERS
              </h2>
              <p className="text-white/90 text-sm">Always available for emergencies</p>
            </div>
          </div>
        </button>

        {/* Welcome Message */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-white/20 backdrop-blur-sm mb-2">
            <Zap className="w-4 h-4 text-blue-300" />
            <span className="text-blue-300 text-sm font-medium">Welcome to MDRRMO Dashboard</span>
          </div>
          <p className="text-slate-300 text-base">
            Your comprehensive disaster preparedness platform
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-2 gap-5" data-testid="modules-grid">
          {[...modules, ...(user?.is_admin ? [adminModule] : [])].map((module, index) => {
            const IconComponent = module.icon;
            return (
              <button
                key={module.title}
                onClick={() => navigate(module.route)}
                className={`w-full bg-slate-800/50 border border-slate-600 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[160px] hover:bg-slate-700/50 transition-all shadow-lg transform hover:scale-105 hover:shadow-2xl group animate-slide-up`}
                style={{ animationDelay: module.animationDelay }}
                data-testid={`module-${module.route.slice(1)}`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${module.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl transition-all`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-base text-center leading-tight mb-2">
                  {module.title}
                </h3>
                <p className="text-slate-400 text-sm text-center">
                  {module.description}
                </p>
                <div className="mt-3">
                  <Navigation className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-600 rounded-2xl p-4 text-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="text-2xl font-bold text-white mb-1">24/7</div>
            <div className="text-slate-400 text-xs">Support</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-600 rounded-2xl p-4 text-center animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <div className="text-2xl font-bold text-white mb-1">100+</div>
            <div className="text-slate-400 text-xs">Hotlines</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-600 rounded-2xl p-4 text-center animate-slide-up" style={{ animationDelay: '1.0s' }}>
            <div className="text-2xl font-bold text-white mb-1">24h</div>
            <div className="text-slate-400 text-xs">Response</div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}