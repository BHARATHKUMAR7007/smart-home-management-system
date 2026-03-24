import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Zap } from 'lucide-react';

import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:8081/api/auth/forgot-password', { email });
            setSubmitted(true);
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 1500);
        } catch (err) {
            console.error(err);
            setError(err.response?.data || "Error sending OTP. Check if email exists.");
        }
    };

    return (
        <div className="auth-split-wrapper">
            <div className="auth-container" id="container">
                {/* Right Side: Recovery Form (Form Panel) */}
                <div className="auth-form-side">
                    <div className="w-full max-w-sm text-left mb-6">
                        <Link to="/login" className="text-gray-400 hover:text-[#23bbab] flex items-center gap-2 transition font-semibold text-sm">
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    </div>

                    <h1 className="auth-panel-heading" style={{ fontSize: '2.5rem' }}>Forgot Access?</h1>

                    <span className="auth-panel-text">Enter your email for the recovery OTP:</span>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="w-full max-w-sm">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50/50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="auth-input-group">
                                <Mail className="auth-input-icon" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="auth-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="auth-btn-primary">
                                Send Recovery OTP
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8 px-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 animate-fade-in w-full max-w-sm">
                            <Zap className="w-12 h-12 text-[#23bbab] mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[#23bbab] mb-2">OTP Sent!</h3>
                            <p className="text-sm text-gray-500">Please check your inbox. Redirecting...</p>
                        </div>
                    )}
                </div>

                {/* Left Side: Info Panel */}
                <div className="auth-info-side">
                    <div className="auth-logo-container">
                        <div className="auth-logo-icon">
                            <Zap size={16} fill="currentColor" />
                        </div>
                        <span>Smart Power Saving</span>
                    </div>

                    <h1 className="info-heading">No Worries!</h1>
                    <p className="info-text">
                        System security is our priority. Follow the steps to regain access to your smart home dashboard.
                    </p>
                    <div className="auth-float mt-4">
                        <Mail size={80} strokeWidth={1} className="opacity-20" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
