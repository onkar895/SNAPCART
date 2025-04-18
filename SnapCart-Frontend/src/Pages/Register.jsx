/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ArrowRight, ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2, ShoppingBag, Truck, Shield, Award, TrendingUp } from "lucide-react";
import { FaGoogle, FaApple, FaShoppingBag } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { toast } from "react-toastify";
import UserContext from "../context/User/UserContext";

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const features = [
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "Endless Selection",
    description: "Discover millions of products from trusted brands worldwide",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Fast Delivery",
    description: "Get your products delivered to your doorstep in record time",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Shopping",
    description: "Shop with confidence with our buyer protection guarantee",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Best Deals",
    description: "Save big with exclusive discounts and flash sales every day",
  },
];


// Products currently trending
const trendingItems = ["Smart Watches", "Premium Headphones", "Eco Friendly Products", "Home Decor"];

const styles = {
  inputContainer: "flex items-center relative",
  inputField: "pl-10 w-full px-3 py-2 bg-gray-100 dark:bg-slate-900 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none",
  inputIcon: "absolute left-3 text-gray-400",
  labelText: "text-sm font-medium text-gray-700 dark:text-white block",
  formGroup: "space-y-2",
  radioButtons: "cursor-pointer relative px-4 py-1 rounded-lg border-2 text-center transition-all duration-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-600 dark:hover:border-gray-200 hover:border-gray-600",
  gradientButton:
    "w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg shadow-md hover:from-indigo-500 hover:to-purple-500 transition-colors flex items-center justify-center",
  socialButton:
    "flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
  socialButtonInner: "flex items-center justify-center gap-2",
  toggleLink: "dark:text-indigo-300 text-indigo-500 dark:hover:text-indigo-400",
  headerGradient: "bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white",
  cardContainer: "rounded-xl shadow-xl overflow-hidden border border-gray-300 dark:border-slate-600",
  formContainer: "p-6 space-y-4 bg-white dark:bg-slate-900 dark:text-white",
};

const Register = ({ initialMode = "login" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [activeFeature, setActiveFeature] = useState(0);

  const [isLogin, setIsLogin] = useState(location.pathname === "/login" || initialMode === "login");

  const userContext = useContext(UserContext);

  useEffect(() => {
    if (location.pathname === "/login") {
      setIsLogin(true);
    } else if (location.pathname === "/signup") {
      setIsLogin(false);
    }
  }, [location.pathname]);

  const toggleForm = useCallback(() => {
    setIsLogin((prevIsLogin) => {
      const newMode = !prevIsLogin;
      navigate(newMode ? "/login" : "/signup");
      return newMode;
    });
  }, [navigate]);

  const validateForm = () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!isLogin && !name.trim()) {
      toast.error("Name is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      return;
    }

    try {
      let userData;
      if (isLogin) {
        userData = {
          username: name,
          password: password,
          role: role || "Buyer", // Default to buyer if no role is specified during login
        };
        userContext.login(userData);
      } else {
        // Ensure role is required for signup
        if (!role) {
          toast.error("Please select a role (Seller or Buyer)");
          setIsLoading(false);
          return;
        }

        userData = {
          username: name,
          email: email,
          password: password,
          role: role,
        };
      }

      // console.log(isLogin ? "Logging in with:" : "Signing up with:", userData);

      const response = await axios.post(`http://localhost:8000/auth/${isLogin ? "login" : "register"}`, userData);
      console.log(response.data);

      // Navigate after successful API response
      if (isLogin) {
        navigate("/home");
      } else {
        setIsLogin(true);
        toast.success(response.data.msg)
        navigate("/login");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errMsg || error.response?.data || "An error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <>
    <main className="min-h-screen flex items-center justify-center p-4 sm:px-10 bg-gradient-to-br from-white to-purple-100 dark:from-slate-950 dark:to-blue-950 overflow-hidden backdrop-blur-3xl">
      <AnimatePresence mode="wait">
          <motion.div 
            key="registration"
            initial="hidden"
            animate="visible" 
            exit="exit"
            variants={containerVariants}
            className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-24 w-full max-w-7xl pt-24 mx-auto relative"
          >
            {/* Dynamic background elements */}
            <div className="absolute -z-10 top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-800 dark:to-blue-800 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -z-10 bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-pink-300 to-orange-300 dark:from-pink-800 dark:to-orange-800 rounded-full blur-3xl opacity-20"></div>
            
            {/* Left side content */}
            <div className="flex flex-col text-center lg:text-start gap-4 w-full relative">
              {/* Main text with improved typography */}
              <div className="text-3xl sm:text-4xl font-semibold">
                <h1>
                  <span>Welcome to </span>
                  <span>SnapCart</span>
                </h1>
                
                <div className="text-gradient1 dark:text-gradient text-2xl sm:text-3xl lg:text-4xl font-bold">
                  Your Ultimate Shopping Destination!
                </div>
                
                {/* Animated promo section */}
                <p className={`text-slate-500 dark:text-white/70 text-lg sm:text-xl mt-4 transition-all duration-300 lg:max-w-xl`}>
                  Start your shopping journey now and grab your favorites before they are gone! ✨
                </p>
                
                <h2 className="text-2xl sm:text-3xl mt-6 text-gradient1 dark:text-gradient">
                  Discover. Shop. Enjoy.
                </h2>
              </div>
              
              {/* Trending now section */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl lg:max-w-xl px-10 py-5 mt-4 shadow-lg border border-purple-100 dark:border-purple-900/30">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2 text-lg font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  <h3>Trending Now</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingItems.map((item, idx) => (
                    <span key={idx} className="bg-purple-100 dark:bg-purple-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors cursor-pointer">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Features showcase with improved styling */}
              <div className="py-6 lg:max-w-xl text-start">
                <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg p-8 transform transition-all duration-500 border border-purple-100 dark:border-purple-900/30">
                  {features.map((feature, index) => (
                    <div key={index} className={`flex items-center gap-4 transition-all duration-500 ${index === activeFeature ? "opacity-100 transform scale-100" : "opacity-0 absolute top-8 left-8 transform scale-95"}`}>
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg shadow-md">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl text-gray-800 dark:text-white font-semibold">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced dots indicator */}
                <div className="flex justify-center gap-2 mt-4">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`rounded-full transition-all flex items-center justify-center ${
                        index === activeFeature 
                          ? "bg-gradient-to-r from-purple-600 to-blue-500 w-8 h-3 shadow-md" 
                          : "bg-gray-300 dark:bg-gray-600 w-3 h-3 hover:bg-gray-400 dark:hover:bg-gray-500"
                      }`}
                      aria-label={`Feature ${index + 1}`}
                    >
                      {index === activeFeature && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right side - Registration card */}
            <div className="w-full max-w-lg relative pb-12 md:pb-0">
              <motion.div key={isLogin ? "login" : "signup"} className={styles.cardContainer} variants={containerVariants} initial='hidden' animate='visible' exit='exit'>
              {/* Header */}
              <motion.div className={styles.headerGradient} variants={itemVariants}>
                <NavLink to='/' className='inline-flex items-center gap-1 text-sm mb-4'>
                  <ArrowLeft className='h-4 w-4' />
                  Back
                </NavLink>
                <h2 className='text-2xl font-bold'>{isLogin ? "Welcome Back" : "Create Account"}</h2>
                <p className='text-purple-100'>{isLogin ? "Sign in to access your account" : "Sign up to get started with our service"}</p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className={styles.formContainer}>
                {/* Name field (only for signup) */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      className={styles.formGroup}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}>
                      <label htmlFor='name' className={styles.labelText}>
                        Username
                      </label>
                      <div className={styles.inputContainer}>
                        <div className={styles.inputIcon}>
                          <User size={18} />
                        </div>
                        <input id='name' type='text' name='username' value={name} placeholder='John Doe' required={!isLogin} onChange={(e) => setName(e.target.value)} className={styles.inputField} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Username/Email field */}
                <motion.div className={styles.formGroup} variants={itemVariants}>
                  <label htmlFor='email' className={styles.labelText}>
                    {isLogin ? "Username" : "Email Address"}
                  </label>
                  <div className={styles.inputContainer}>
                    {isLogin ? (
                      <div className={styles.inputIcon}>
                        <User size={18} />
                      </div>
                    ) : (
                      <div className={styles.inputIcon}>
                        <Mail size={18} />
                      </div>
                    )}
                    {isLogin ? (
                      <input id='name' type='text' name='username' value={name} placeholder='John Doe' required={!isLogin} onChange={(e) => setName(e.target.value)} className={styles.inputField} />
                    ) : (
                      <input
                        id='email'
                        type='text'
                        name='email'
                        value={email}
                        placeholder={isLogin ? "Enter username" : "your@gmail.com"}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.inputField}
                      />
                    )}
                  </div>
                </motion.div>

                {/* Password field */}
                <motion.div className={styles.formGroup} variants={itemVariants}>
                  <label htmlFor='password' className={styles.labelText}>
                    Password
                  </label>
                  <div className={styles.inputContainer}>
                    <div className={styles.inputIcon}>
                      <Lock size={18} />
                    </div>
                    <input
                      id='password'
                      type={showPassword ? "text" : "password"}
                      name='password'
                      value={password}
                      placeholder='••••••••'
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      className={styles.inputField}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
                      aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  {!isLogin && (
                    <motion.div variants={itemVariants} className='flex items-center gap-6 py-2'>
                      <motion.label
                        className={`${styles.radioButtons} ${role === "Seller" ? "text-purple-800 dark:text-purple-200 border-purple-500 dark:border-purple-500" : ""}`}
                        whileTap={{ scale: 0.95 }}>
                        <input 
                          type='radio' 
                          name='role' 
                          value='Seller' 
                          checked={role === "Seller"} 
                          onChange={(e) => setRole(e.target.value)} className='hidden' 
                        />
                        <div className='flex gap-2 items-center'>
                          <FaSackDollar/>
                          <span>Seller</span>
                        </div>
                      </motion.label>

                      <motion.label
                        className={`${styles.radioButtons} ${role === "Buyer" ? "text-indigo-700 dark:text-indigo-200 border-indigo-500 dark:border-indigo-500" : ""}`}
                        whileTap={{ scale: 0.95 }}>
                        <input 
                          type='radio' 
                          name='role' 
                          value='Buyer' 
                          checked={role === "Buyer"} 
                          onChange={(e) => setRole(e.target.value)} className='hidden' 
                        />
                        <div className='flex gap-2 items-center'>
                          <FaShoppingBag/>
                          <span className={`${role === "buyer" ? "text-indigo-800 dark:text-indigo-200" : "text-gray-700 dark:text-gray-300"}`}>Buyer</span>
                        </div>
                      </motion.label>
                    </motion.div>
                  )}
                </motion.div>

                {/* Forgot password (login only) */}
                <AnimatePresence>
                  {isLogin && (
                    <motion.div
                      className='flex items-center justify-between'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}>
                      <div className='flex items-center space-x-2'>
                        <input type='checkbox' id='remember' className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500' />
                        <label htmlFor='remember' className='text-sm font-normal text-gray-700 dark:text-slate-400'>
                          Remember me
                        </label>
                      </div>
                      <a href='#' className='text-sm text-indigo-500 dark:text-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                        Forgot your password?
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.button type='submit' className={styles.gradientButton} variants={itemVariants} whileTap={{ scale: 0.98 }} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {isLogin ? "Signing In..." : "Creating an account..."}
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? "Sign In" : "Create Account"}</span>
                      <ArrowRight className='ml-2' size={18} />
                    </>
                  )}
                </motion.button>

                {/* Toggle between login/signup */}
                <motion.div className='text-center mt-6' variants={itemVariants}>
                  <div className='text-gray-600 dark:text-gray-400 text-sm'>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <motion.button type='button' onClick={toggleForm} className={styles.toggleLink} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      {isLogin ? "Sign Up" : "Sign In"}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Social login options */}
                <motion.div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700' variants={itemVariants}>
                  <div className='text-center text-sm text-gray-500 dark:text-gray-400 mb-4'>Or continue with</div>
                  <div className='flex items-center justify-center space-x-2'>
                    <motion.button
                      type='button'
                      className={styles.socialButton}
                      whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ y: 0, boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}>
                      <div className={styles.socialButtonInner}>
                        <FaGoogle />
                        Google
                      </div>
                    </motion.button>
                    <motion.button
                      type='button'
                      className={styles.socialButton}
                      whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ y: 0, boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}>
                      <div className={styles.socialButtonInner}>
                        <FaApple />
                        Apple
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              </form>
            </motion.div>
            </div>
          
          </motion.div>
      </AnimatePresence>
    </main>
    </>
  );
};

export default Register;
