import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  Lock,
  Award,
  Briefcase,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Scale,
  Sparkles,
  ArrowRight,
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { JusticeLogo } from './JusticeLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'client' | 'lawyer';
  defaultMode?: 'login' | 'register';
  onRegistrationComplete?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'client',
  defaultMode = 'register',
  onRegistrationComplete,
}) => {
  const { t, isOromo, isEnglish } = useLanguage();
  const {
    registerClient,
    registerLawyer,
    login,
    loginWithGoogle,
    sendEmailOtp,
    verifyEmailOtp,
  } = useAuth();

  const [activeRole, setActiveRole] = useState<'client' | 'lawyer'>(defaultRole);
  const [authMode, setAuthMode] = useState<'login' | 'register'>(defaultMode);

  // Client form fields
  const [clientFullName, setClientFullName] = useState('');
  const [clientEmailOrPhone, setClientEmailOrPhone] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [clientCity, setClientCity] = useState('አዲስ አበባ');

  // Lawyer form fields
  const [lawyerFullName, setLawyerFullName] = useState('');
  const [lawyerEmailOrPhone, setLawyerEmailOrPhone] = useState('');
  const [lawyerPassword, setLawyerPassword] = useState('');
  const [lawyerLicenseNumber, setLawyerLicenseNumber] = useState('');
  const [lawyerLicenseLevel, setLawyerLicenseLevel] = useState<
    'all_federal_courts' | 'federal_high_first_instance' | 'federal_first_instance' | 'regional_supreme'
  >('all_federal_courts');
  const [lawyerOfficeAddress, setLawyerOfficeAddress] = useState('');
  const [lawyerSpecialization, setLawyerSpecialization] = useState('ፍትሐብሔር እና የንግድ ሕግ');
  const [lawyerExperience, setLawyerExperience] = useState<number>(6);
  const [lawyerBio, setLawyerBio] = useState('');

  // Login form field
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // OTP Verification States
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [simulatedIncomingOtp, setSimulatedIncomingOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState<{
    role: 'client' | 'lawyer';
    data: any;
  } | null>(null);

  // Status & Error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP Timer countdown
  useEffect(() => {
    let timer: any;
    if (isOtpStep && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpStep, countdown]);

  if (!isOpen) return null;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Google Sign In Handler
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    const res = await loginWithGoogle(activeRole);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(
        isOromo
          ? 'Akkaawuntii Google keessaniin milkaa\'inaan seentaniittu!'
          : 'በGoogle አካውንትዎ በተሳካ ሁኔታ ገብተዋል!'
      );
      setTimeout(() => {
        onRegistrationComplete?.();
        onClose();
      }, 1200);
    } else {
      setErrorMessage(res.error || 'በGoogle መግባት አልተቻለም');
    }
  };

  // Step 1: Initiate Client Registration by sending OTP to Email
  const handleClientRegisterInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientFullName.trim()) {
      setErrorMessage(isOromo ? 'Maqaa guutuu barreessaa' : 'እባክዎ ስም ከነአያት ያስገቡ');
      return;
    }
    if (!clientEmailOrPhone.trim()) {
      setErrorMessage(isOromo ? 'Bilbila ykn Imeelii barreessaa' : 'እባክዎ ስልክ ቁጥር ወይም ኢሜል ያስገቡ');
      return;
    }

    const emailToUse = clientEmailOrPhone.includes('@')
      ? clientEmailOrPhone.trim().toLowerCase()
      : `user_${clientEmailOrPhone.replace(/[^0-9]/g, '')}@yene-tebeka.et`;

    setIsSubmitting(true);
    const otpRes = await sendEmailOtp(emailToUse, clientFullName.trim());
    setIsSubmitting(false);

    if (otpRes.success) {
      setOtpEmail(emailToUse);
      setSimulatedIncomingOtp(otpRes.otp || null);
      setPendingRegistration({
        role: 'client',
        data: {
          fullName: clientFullName.trim(),
          emailOrPhone: clientEmailOrPhone.trim(),
          password: clientPassword || 'pass123456',
          city: clientCity,
        },
      });
      setCountdown(120);
      setCanResend(false);
      setOtpInput('');
      setIsOtpStep(true);
    } else {
      setErrorMessage(otpRes.error || 'የማረጋገጫ ኮድ (OTP) መላክ አልተቻለም');
    }
  };

  // Step 1: Initiate Lawyer Registration by sending OTP to Email
  const handleLawyerRegisterInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!lawyerFullName.trim()) {
      setErrorMessage(isOromo ? 'Maqaa abukaatoo guutuu barreessaa' : 'እባክዎ የጠበቃውን ስም እስከ አያት ያስገቡ');
      return;
    }
    if (!lawyerEmailOrPhone.trim()) {
      setErrorMessage(isOromo ? 'Bilbila ykn Imeelii barreessaa' : 'እባክዎ ስልክ ወይም ኢሜል ያስገቡ');
      return;
    }
    if (!lawyerLicenseNumber.trim()) {
      setErrorMessage(isOromo ? 'Lakk. Eeyyama Abukaatummaa barreessaa' : 'እባክዎ የጥብቅና ፍቃድ ቁጥር ያስገቡ');
      return;
    }
    if (!lawyerOfficeAddress.trim()) {
      setErrorMessage(isOromo ? 'Teessoo waajjiraa barreessaa' : 'እባክዎ የሰራው ቦታው አድራሻ (ቢሮ፣ ሕንፃ፣ ከተማ) ያስገቡ');
      return;
    }

    const emailToUse = lawyerEmailOrPhone.includes('@')
      ? lawyerEmailOrPhone.trim().toLowerCase()
      : `lawyer_${lawyerEmailOrPhone.replace(/[^0-9]/g, '')}@yene-tebeka.et`;

    setIsSubmitting(true);
    const otpRes = await sendEmailOtp(emailToUse, lawyerFullName.trim());
    setIsSubmitting(false);

    if (otpRes.success) {
      setOtpEmail(emailToUse);
      setSimulatedIncomingOtp(otpRes.otp || null);
      setPendingRegistration({
        role: 'lawyer',
        data: {
          fullName: lawyerFullName.trim(),
          emailOrPhone: lawyerEmailOrPhone.trim(),
          password: lawyerPassword || 'lawyer123456',
          licenseNumber: lawyerLicenseNumber.trim(),
          licenseLevel: lawyerLicenseLevel,
          officeAddress: lawyerOfficeAddress.trim(),
          specialization: lawyerSpecialization,
          experienceYears: Number(lawyerExperience) || 5,
          bio: lawyerBio.trim(),
          city: lawyerOfficeAddress.split('፣')[0].trim() || 'አዲስ አበባ',
        },
      });
      setCountdown(120);
      setCanResend(false);
      setOtpInput('');
      setIsOtpStep(true);
    } else {
      setErrorMessage(otpRes.error || 'የማረጋገጫ ኮድ (OTP) መላክ አልተቻለም');
    }
  };

  // Step 2: Verify OTP and finalize registration in Firebase/Firestore
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otpInput.trim().length < 6) {
      setErrorMessage(isOromo ? 'Koodii dijitii 6 guutuu galchaa' : 'እባክዎ ባለ 6-አሃዝ የማረጋገጫ ኮድ (OTP) ያስገቡ');
      return;
    }

    setIsSubmitting(true);
    const verifyRes = await verifyEmailOtp(otpEmail, otpInput.trim());

    if (!verifyRes.success) {
      setIsSubmitting(false);
      setErrorMessage(verifyRes.error || 'የማረጋገጫ ኮዱ የተሳሳተ ነው');
      return;
    }

    // OTP Verified! Now finalize registration
    if (pendingRegistration?.role === 'client') {
      const res = await registerClient(pendingRegistration.data);
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMessage(
          isOromo
            ? 'Imeeliin keessan mirkanaa\'ee milkaa\'inaan galmooftaniittu!'
            : 'ኢሜይልዎ ተረጋግጦ በተጠቃሚነት በተሳካ ሁኔታ ተመዝግበው ገብተዋል!'
        );
        setTimeout(() => {
          onRegistrationComplete?.();
          onClose();
        }, 1500);
      } else {
        setErrorMessage(res.error || 'ምዝገባው አልተሳካም');
      }
    } else if (pendingRegistration?.role === 'lawyer') {
      const res = await registerLawyer(pendingRegistration.data);
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMessage(
          isOromo
            ? 'Imeeliin mirkanaa\'ee akka abukaatootti milkaa\'inaan galmooftaniittu!'
            : 'ኢሜይልዎ ተረጋግጦ እንደ ሕጋዊ ጠበቃ በተሳካ ሁኔታ ተመዝግበዋል! አድራሻዎ በጠበቆች ማውጫ ውስጥ ተካቷል።'
        );
        setTimeout(() => {
          onRegistrationComplete?.();
          onClose();
        }, 1500);
      } else {
        setErrorMessage(res.error || 'የጠበቃ ምዝገባ አልተሳካም');
      }
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    const name = pendingRegistration?.data?.fullName || 'ተጠቃሚ';
    const res = await sendEmailOtp(otpEmail, name);
    setIsSubmitting(false);

    if (res.success) {
      setSimulatedIncomingOtp(res.otp || null);
      setCountdown(120);
      setCanResend(false);
      setSuccessMessage('አዲስ የማረጋገጫ ኮድ ተልኳል!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setErrorMessage(res.error || 'ኮድ መላክ አልተቻለም');
    }
  };

  // Copy simulated OTP
  const handleCopyOtp = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedOtp(true);
    setOtpInput(code);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  // Standard Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage(isOromo ? 'Bilbila ykn Imeelii barreessaa' : 'እባክዎ ስልክ ቁጥር ወይም ኢሜል ያስገቡ');
      return;
    }

    setIsSubmitting(true);
    const res = await login(loginIdentifier.trim(), loginPassword || 'pass123456');
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(isOromo ? 'Milkaa\'inaan seentaniittu!' : 'በተሳካ ሁኔታ ገብተዋል!');
      setTimeout(() => {
        onRegistrationComplete?.();
        onClose();
      }, 1000);
    } else {
      setErrorMessage(res.error || 'መግባት አልተቻለም');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <JusticeLogo size={42} showTextRings={false} />
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white flex items-center gap-2">
                <span>የእኔ ጠበቃ</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-sans font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {isOtpStep ? 'የኢሜል ማረጋገጫ' : 'መለያና ምዝገባ'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isOtpStep
                  ? 'ባለ 6-አሃዝ የማረጋገጫ ኮድ (OTP) ማረጋገጫ'
                  : authMode === 'register'
                  ? 'አዲስ መለያ ከፍተው የሕግ አገልግሎት ያግኙ'
                  : 'የነበረዎትን መለያ ወይም Google በመጠቀም ይግቡ'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: OTP VERIFICATION VIEW */}
          {/* ======================================================== */}
          {isOtpStep ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Back to Edit Button */}
              <button
                type="button"
                onClick={() => {
                  setIsOtpStep(false);
                  setErrorMessage(null);
                }}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>መረጃ ለማስተካከል ተመለስ (Edit Details)</span>
              </button>

              <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
                  <KeyRound className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    የኢሜይል ማረጋገጫ ኮድ (OTP)
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                    ባለ 6-አሃዝ የማረጋገጫ ኮድ ወደ{' '}
                    <strong className="text-amber-300 font-mono underline">{otpEmail}</strong>{' '}
                    ተልኳል። እባክዎ ኮዱን አስገብተው ምዝገባዎን ያጠናቁ።
                  </p>
                </div>

                {/* Simulated Incoming Email Notification Banner */}
                {simulatedIncomingOtp && (
                  <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 p-3.5 rounded-2xl border border-amber-500/40 text-left space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span>📬 የገቢ ኢሜል ማስመሰያ (Inbox Preview)</span>
                      </span>
                      <span className="text-[10px] text-slate-400">አሁን ደረሰ</span>
                    </div>

                    <div className="text-xs text-slate-200">
                      <span className="text-slate-400">ከ፦</span> የኔ ጠበቃ የደህንነት ቡድን &lt;noreply@yene-tebeka.et&gt;
                      <br />
                      <span className="text-slate-400">ርዕስ፦</span> የእርስዎ የይለፍ ቃል ማረጋገጫ ኮድ (OTP)
                    </div>

                    <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block">የማረጋገጫ ኮድዎ፦</span>
                        <span className="text-lg font-mono font-black tracking-widest text-amber-300">
                          {simulatedIncomingOtp}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyOtp(simulatedIncomingOtp)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all border border-slate-700"
                        >
                          {copiedOtp ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">ተቀድቷል</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-amber-400" />
                              <span>ቅዳ (Copy)</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setOtpInput(simulatedIncomingOtp)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 cursor-pointer transition-all shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>ሙላ (Auto-Fill)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form to submit OTP */}
                <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      የ 6-አሃዝ የማረጋገጫ ኮድ ያስገቡ
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full max-w-xs mx-auto text-center tracking-[0.5em] text-2xl font-mono font-black py-3 bg-slate-900 border-2 border-amber-500/60 focus:border-amber-400 rounded-2xl text-amber-300 focus:outline-none shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || otpInput.trim().length < 6}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'እያረጋገጥን ነው...'
                        : 'ኮዱን አረጋግጥና ምዝገባውን አጠናቅቅ'}
                    </span>
                  </button>
                </form>

                {/* Resend Link and Countdown */}
                <div className="pt-2 text-xs text-slate-400 flex items-center justify-center gap-2">
                  <span>ኮዱ አልደረሰዎትም?</span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSubmitting}
                      className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>በድጋሚ ላክ (Resend OTP)</span>
                    </button>
                  ) : (
                    <span className="font-mono text-amber-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      በ {formatTime(countdown)} ውስጥ
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* STEP 1: LOGIN / REGISTER FORMS & GOOGLE SIGN-IN */
            /* ======================================================== */
            <div className="space-y-4">
              {/* Auth Mode Toggle (Login vs Register) */}
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  አዲስ መመዝገቢያ (Register)
                </button>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  መግቢያ (Sign In)
                </button>
              </div>

              {/* PROMINENT GOOGLE SIGN IN BUTTON */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 active:scale-98 text-slate-900 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-3 transition-all cursor-pointer border border-slate-200"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>
                    {authMode === 'login'
                      ? 'በGoogle አካውንት በፍጥነት ይግቡ'
                      : 'በGoogle አካውንት በቀጥታ ይመዝገቡ'}
                  </span>
                </button>

                <div className="flex items-center gap-3 my-2 text-slate-500 text-[11px]">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span>ወይም በኢሜይል / ስልክ ቁጥር ይቀጥሉ</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
              </div>

              {/* REGISTER MODE */}
              {authMode === 'register' && (
                <div className="space-y-4">
                  {/* Role Selection Tabs */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRole('client');
                        setErrorMessage(null);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        activeRole === 'client'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          activeRole === 'client'
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="block text-xs sm:text-sm font-bold text-slate-200">
                          እንደ ተጠቃሚ / ደንበኛ
                        </strong>
                        <span className="text-[10px] text-slate-400">
                          የሕግ አገልግሎት ፈላጊ
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveRole('lawyer');
                        setErrorMessage(null);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        activeRole === 'lawyer'
                          ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg shadow-amber-950/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          activeRole === 'lawyer'
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="block text-xs sm:text-sm font-bold text-slate-200">
                          እንደ ጠበቃ
                        </strong>
                        <span className="text-[10px] text-slate-400">
                          ፈቃድ ያለው የሕግ ባለሙያ
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* CLIENT REGISTRATION FORM */}
                  {activeRole === 'client' && (
                    <form onSubmit={handleClientRegisterInitiate} className="space-y-3.5">
                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            ስም ከነአያት (ሙሉ ስም) <span className="text-amber-400">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              required
                              value={clientFullName}
                              onChange={(e) => setClientFullName(e.target.value)}
                              placeholder="ለምሳሌ፡ አበበ ከበደ ወልደማርያም"
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              ኢሜል (OTP የሚላክበት) <span className="text-amber-400">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                              <input
                                type="text"
                                required
                                value={clientEmailOrPhone}
                                onChange={(e) => setClientEmailOrPhone(e.target.value)}
                                placeholder="name@gmail.com ወይም 0911234567"
                                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <span className="text-[10px] text-amber-400/90 mt-0.5 block">
                              የ 6-አሃዝ የማረጋገጫ ኮድ (OTP) ወደዚህ ይላካል።
                            </span>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              የመኖሪያ ከተማ / ክልል
                            </label>
                            <div className="relative">
                              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                              <input
                                type="text"
                                value={clientCity}
                                onChange={(e) => setClientCity(e.target.value)}
                                placeholder="አዲስ አበባ፣ ሐዋሳ፣ ባሕር ዳር..."
                                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            የይለፍ ቃል (Password - አማራጭ)
                          </label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                            <input
                              type="password"
                              value={clientPassword}
                              onChange={(e) => setClientPassword(e.target.value)}
                              placeholder="ቢያንስ 6 ፊደላት ወይም ቁጥሮች"
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                      >
                        <Mail className="w-4 h-4" />
                        <span>
                          {isSubmitting
                            ? 'የማረጋገጫ ኮድ በመላክ ላይ...'
                            : 'የማረጋገጫ ኮድ (OTP) ላክና ቀጥል'}
                        </span>
                      </button>
                    </form>
                  )}

                  {/* LAWYER REGISTRATION FORM */}
                  {activeRole === 'lawyer' && (
                    <form onSubmit={handleLawyerRegisterInitiate} className="space-y-3.5">
                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            ስም እስከ አያት (የጠበቃው ሙሉ ስም) <span className="text-amber-400">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              required
                              value={lawyerFullName}
                              onChange={(e) => setLawyerFullName(e.target.value)}
                              placeholder="ለምሳሌ፡ አቶ ዳንኤል ታደሰ ወልደየስ"
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              ኢሜይል (OTP የሚላክበት) <span className="text-amber-400">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                              <input
                                type="text"
                                required
                                value={lawyerEmailOrPhone}
                                onChange={(e) => setLawyerEmailOrPhone(e.target.value)}
                                placeholder="lawyer@domain.com ወይም 0911234567"
                                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <span className="text-[10px] text-amber-400/90 mt-0.5 block">
                              የማረጋገጫ ኮድ (OTP) ወደዚህ ይላካል።
                            </span>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              የጥብቅና ፍቃድ ቁጥር <span className="text-amber-400">*</span>
                            </label>
                            <div className="relative">
                              <Award className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                              <input
                                type="text"
                                required
                                value={lawyerLicenseNumber}
                                onChange={(e) => setLawyerLicenseNumber(e.target.value)}
                                placeholder="FDRE/MOJ/ADV/2014/..."
                                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono text-amber-300"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              የጥብቅና ፍቃድ ደረጃ
                            </label>
                            <select
                              value={lawyerLicenseLevel}
                              onChange={(e: any) => setLawyerLicenseLevel(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                            >
                              <option value="all_federal_courts">በሁሉም የፌዴራል ፍርድ ቤቶችና ሰበር ችሎት</option>
                              <option value="federal_high_first_instance">በፌዴራል ከፍተኛና የመጀመሪያ ደረጃ ፍርድ ቤት</option>
                              <option value="federal_first_instance">በፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ብቻ</option>
                              <option value="regional_supreme">በክልል ጠቅላይና ከፍተኛ ፍርድ ቤቶች</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                              ዋና የስራ ዘርፍ / ሙያዊ ክህሎት
                            </label>
                            <input
                              type="text"
                              value={lawyerSpecialization}
                              onChange={(e) => setLawyerSpecialization(e.target.value)}
                              placeholder="ፍትሐብሔር፣ ንግድና ኮንትራት፣ ወንጀል..."
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            የሰራው ቦታው አድራሻ (ቢሮ / ቻምበር) <span className="text-amber-400">*</span>
                          </label>
                          <div className="relative">
                            <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              required
                              value={lawyerOfficeAddress}
                              onChange={(e) => setLawyerOfficeAddress(e.target.value)}
                              placeholder="አዲስ አበባ፣ ቂርቆስ ክ/ከተማ፣ ለገሃር፣ አል-ሳም ሕንፃ 4ኛ ፎቅ ቢሮ 408"
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                      >
                        <Mail className="w-4 h-4" />
                        <span>
                          {isSubmitting
                            ? 'የማረጋገጫ ኮድ በመላክ ላይ...'
                            : 'የማረጋገጫ ኮድ (OTP) ላክና ጠበቃ ሆነህ ተመዝገብ'}
                        </span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* SIGN IN (LOGIN) MODE */}
              {authMode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ስልክ ቁጥር ወይም ኢሜል <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="የተመዘገቡበት ስልክ ወይም ኢሜል"
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        የይለፍ ቃል (Password)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="የይለፍ ቃልዎን ያስገቡ"
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>{isSubmitting ? 'በማጣራት ላይ...' : 'ይግቡ (Sign In)'}</span>
                  </button>
                </form>
              )}

              {/* Bottom Switch Note */}
              <div className="text-center pt-2">
                {authMode === 'register' ? (
                  <p className="text-xs text-slate-400">
                    ቀደም ሲል የተመዘገበ አካውንት አለዎት?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMessage(null);
                      }}
                      className="text-amber-400 font-bold hover:underline cursor-pointer"
                    >
                      እዚህ ይግቡ
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    አዲስ ተጠቃሚ ወይም ጠበቃ ነዎት?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setErrorMessage(null);
                      }}
                      className="text-amber-400 font-bold hover:underline cursor-pointer"
                    >
                      እዚህ ይመዝገቡ
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
