import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Fingerprint, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed w-full z-50 bg-dashboard-bg/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full animate-pulse group-hover:bg-cyan-500/40 transition-all"></div>
                            <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl shadow-lg border border-white/20 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex items-center justify-center">
                                <div className="relative">
                                    <Home className="h-6 w-6 text-white" />
                                    <div className="absolute inset-0 flex items-center justify-center pt-1">
                                        <Fingerprint className="h-3 w-3 text-white/90" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl text-white tracking-tighter leading-none group-hover:text-cyan-400 transition-colors">SMART POWER</span>
                            <span className="text-[10px] font-bold text-cyan-400/80 tracking-[0.2em] uppercase leading-none mt-1">Intelligent Saving</span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <a href="/#features" className="text-slate-300 hover:text-white transition px-3 py-2 rounded-md font-medium">Features</a>
                            <a href="/#about" className="text-slate-300 hover:text-white transition px-3 py-2 rounded-md font-medium">About</a>
                            <a href="/#contact" className="text-slate-300 hover:text-white transition px-3 py-2 rounded-md font-medium">Contact</a>

                            {token && !isLandingPage ? (
                                <>
                                    <Link to="/devices" className="text-slate-300 hover:text-white transition font-medium">My Devices</Link>
                                    <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 transition font-medium">Dashboard</Link>
                                    <div className="relative group">
                                        <button className="flex items-center gap-2 text-slate-300 hover:text-white transition">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span>{user?.username || 'Profile'}</span>
                                        </button>
                                        {/* Dropdown */}
                                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 hidden group-hover:block">
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">My Profile</Link>
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 flex items-center gap-2">
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                !token && (
                                    <div className="flex items-center gap-4">
                                        <Link to="/login" className="text-white hover:text-blue-400 transition font-medium">Login</Link>
                                        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition shadow-lg shadow-blue-500/25">Sign Up</Link>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none">
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900 border-b border-slate-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="/#features" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Features</a>
                        <a href="/#about" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</a>
                        <a href="/#contact" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Contact</a>
                        {token ? (
                            <>
                                <Link to="/devices" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">My Devices</Link>
                                <Link to="/dashboard" className="text-blue-400 block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                <button onClick={handleLogout} className="text-red-400 w-full text-left px-3 py-2 rounded-md text-base font-medium">Sign Out</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                                <Link to="/register" className="text-blue-400 font-bold block px-3 py-2 rounded-md text-base">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
