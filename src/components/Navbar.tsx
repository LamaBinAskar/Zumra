import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, User, ChevronDown, Menu, X, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import Avatar from './Avatar';

export default function Navbar() {
  const { currentUser, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [showPSAU, setShowPSAU] = useState(false);
  const [logoVisible, setLogoVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoVisible(false);
      setTimeout(() => {
        setShowPSAU(prev => !prev);
        setLogoVisible(true);
      }, 350);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const { unreadCount, markNotificationsRead } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { notifications } = useApp();

  if (!currentUser) return null;

  const navLinks = currentUser.role === 'admin'
    ? [
        { to: '/admin',              label: 'لوحة التحكم' },
        { to: '/admin-certificates', label: 'الشهادات' },
        { to: '/library',            label: 'المكتبة' },
        { to: '/chat',               label: 'الدردشة' },
        { to: '/honor-board',        label: 'لوحة الشرف' },
      ]
    : currentUser.role === 'mentor'
    ? [
        { to: '/mentor',      label: 'لوحتي' },
        { to: '/library',     label: 'المكتبة' },
        { to: '/chat',        label: 'الدردشة' },
        { to: '/sessions',    label: 'جلساتي' },
        { to: '/certificates',label: 'شهاداتي' },
        { to: '/honor-board', label: 'لوحة الشرف' },
      ]
    : [
        { to: '/student',     label: 'الرئيسية' },
        { to: '/library',     label: 'المكتبة' },
        { to: '/chat',        label: 'الدردشة' },
        { to: '/booking',     label: 'احجز جلسة' },
        { to: '/sessions',    label: 'جلساتي' },
        { to: '/honor-board', label: 'لوحة الشرف' },
      ];

  const NAV_BG   = 'rgba(255,255,255,0.94)';
  const BORDER   = '1px solid rgba(42,92,78,0.14)';
  const DROPDOWN = { background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(28px)', border: '1px solid rgba(42,92,78,0.16)', boxShadow: '0 12px 40px rgba(31,77,62,0.12)' };

  return (
    <nav style={{ background: NAV_BG, backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', borderBottom: BORDER, boxShadow: '0 2px 12px rgba(13,148,136,0.07)' }}
      className="sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={currentUser.role === 'admin' ? '/admin' : currentUser.role === 'mentor' ? '/mentor' : '/student'}
            className="flex items-center gap-2.5 flex-shrink-0 group">
            {/* Switching logo: Zumra ↔ PSAU */}
            <div style={{ width: 40, height: 40, position: 'relative', flexShrink: 0 }}>
              <img
                src="/Zumra/Logo.jfif"
                alt="زمرة"
                style={{
                  position: 'absolute', inset: 0,
                  height: 40, width: 40, borderRadius: 10,
                  objectFit: 'contain',
                  border: '1.5px solid rgba(42,92,78,0.20)',
                  boxShadow: '0 2px 8px rgba(42,92,78,0.12)',
                  opacity: logoVisible && !showPSAU ? 1 : 0,
                  transition: 'opacity 0.35s ease',
                }}
              />
              <img
                src="/Zumra/PSAULOGO.png"
                alt="جامعة الأمير سطام"
                style={{
                  position: 'absolute', inset: 0,
                  height: 40, width: 40,
                  objectFit: 'contain',
                  opacity: logoVisible && showPSAU ? 1 : 0,
                  transition: 'opacity 0.35s ease',
                }}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-black transition-colors duration-200 group-hover:text-[#2a5c4e]" style={{ color: '#1f4d3e', letterSpacing: '-0.5px' }}>زُمرة</span>
              <span className="text-[10px]" style={{ color: 'rgba(31,77,62,0.45)' }}>جامعة الأمير سطام بن عبدالعزيز</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-3.5 py-1.5 rounded-full text-sm transition-all font-medium ${
                  location.pathname === link.to
                    ? 'font-semibold'
                    : 'hover:bg-[#1b8c82]/8'
                }`}
                style={location.pathname === link.to
                  ? { background: 'rgba(42,92,78,0.09)', color: '#2a5c4e', borderBottom: '2px solid #3d8a6e' }
                  : { color: 'rgba(31,77,62,0.60)' }
                }>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Bell */}
            <div className="relative">
              <button onClick={() => { setShowNotifs(!showNotifs); markNotificationsRead(); setShowProfile(false); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ color: 'rgba(13,40,37,0.50)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,148,136,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 text-white rounded-full text-[9px] flex items-center justify-center font-black" style={{ background: '#25a89d' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden" style={DROPDOWN}>
                  <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(13,148,136,0.10)' }}>
                    <span className="text-sm font-semibold" style={{ color: '#0d2825' }}>الإشعارات</span>
                    <span className="text-xs cursor-pointer font-medium" style={{ color: '#1b8c82' }}>تحديد الكل كمقروء</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.slice(0, 5).map(n => (
                      <div key={n.id} className="px-4 py-3 transition-colors cursor-pointer"
                        style={{ borderBottom: '1px solid rgba(13,148,136,0.06)', background: !n.read ? 'rgba(13,148,136,0.03)' : 'transparent' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,148,136,0.06)')}
                        onMouseLeave={e => (e.currentTarget.style.background = !n.read ? 'rgba(13,148,136,0.03)' : 'transparent')}>
                        <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 mt-2 rounded-full flex-shrink-0" style={{ background: !n.read ? '#25a89d' : 'rgba(13,40,37,0.20)' }} />
                          <div>
                            <p className="text-sm" style={{ color: '#0d2825' }}>{n.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.45)' }}>{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="py-8 text-center text-sm" style={{ color: 'rgba(13,40,37,0.35)' }}>لا توجد إشعارات</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full transition-all"
                style={{ border: '1px solid rgba(13,148,136,0.12)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,148,136,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <Avatar name={currentUser.name} className="w-7 h-7 rounded-full text-xs" />
                <span className="hidden md:block text-xs font-medium" style={{ color: 'rgba(13,40,37,0.65)' }}>{currentUser.name.split(' ')[0]}</span>
                <ChevronDown size={12} className="hidden md:block" style={{ color: 'rgba(13,40,37,0.35)' }} />
              </button>
              {showProfile && (
                <div className="absolute left-0 mt-2 w-44 rounded-2xl shadow-2xl z-50 overflow-hidden" style={DROPDOWN}>
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(13,148,136,0.09)' }}>
                    <p className="text-sm font-semibold" style={{ color: '#0d2825' }}>{currentUser.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.40)' }}>{currentUser.email}</p>
                  </div>
                  <Link to="/" className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                    style={{ color: 'rgba(13,40,37,0.65)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,148,136,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => setShowProfile(false)}>
                    <Home size={14} /> الصفحة الرئيسية
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                    style={{ color: 'rgba(13,40,37,0.65)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,148,136,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <User size={14} /> معلوماتي الشخصية
                  </Link>
                  <button onClick={() => { logout(); navigate('/auth'); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <LogOut size={14} /> تسجيل الخروج
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ color: 'rgba(13,40,37,0.55)' }}>
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-3 space-y-0.5" style={{ borderTop: '1px solid rgba(13,148,136,0.10)' }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm transition-colors"
                style={location.pathname === link.to
                  ? { background: 'rgba(13,148,136,0.10)', color: '#1b8c82', fontWeight: 600 }
                  : { color: 'rgba(13,40,37,0.60)' }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
