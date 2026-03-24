import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Key, Lock, Zap, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:8081/api/auth/verify-otp', { email, otp });
            setIsOtpVerified(true);
        } catch (err) {
            setError(err.response?.data || "Invalid or expired OTP");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            await axios.post('http://localhost:8081/api/auth/reset-password', { email, otp, newPassword });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data || "Failed to reset password.");
        }
    };

    return (
        <div className="auth-split-wrapper">
            <div className="auth-container" id="container">
                {/* Right Side: Reset Form (Form Panel) */}
                <div className="auth-form-side">
                    <h1 className="auth-panel-heading" style={{ fontSize: '2.5rem' }}>Secure Reset</h1>

                    <span className="auth-panel-text">
                        {isOtpVerified ? "Set your new secure password:" : `Enter the 6-digit OTP sent to your mail:`}
                    </span>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50/50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake w-full max-w-sm">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-8 px-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 animate-fade-in w-full max-w-sm">
                            <CheckCircle className="w-12 h-12 text-[#23bbab] mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[#23bbab] mb-2">Success!</h3>
                            <p className="text-sm text-gray-500">Password reset. Redirecting to login...</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-sm">
                            {!isOtpVerified ? (
                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                    <div className="auth-input-group">
                                        <input
                                            type="text"
                                            placeholder="• • • • • •"
                                            maxLength="6"
                                            className="auth-input"
                                            style={{ textAlign: 'center', paddingLeft: '15px', fontSize: '1.5rem', letterSpacing: '8px' }}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="auth-btn-primary">
                                        Verify OTP
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div className="auth-input-group">
                                        <Lock className="auth-input-icon" size={18} />
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            className="auth-input"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="auth-input-group">
                                        <Lock className="auth-input-icon" size={18} />
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            className="auth-input"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="auth-btn-primary">
                                        Update Password
                                    </button>
                                </form>
                            )}
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

                    <h1 className="info-heading">Almost There!</h1>
                    <p className="info-text">
                        Your data security is our top priority. Reset your password and get back to managing your home efficiency.
                    </p>
                    <div className="auth-float mt-4">
                        <Key size={80} strokeWidth={1} className="opacity-20" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
