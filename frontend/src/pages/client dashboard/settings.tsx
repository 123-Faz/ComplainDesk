// src/pages/client dashboard/settings.tsx
import { useSelector } from "react-redux";
import { getAuthToken } from "@/store/authSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { type userLayoutContextType } from "@/layout/client dashboard/types";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  Shield,
  Key
} from "lucide-react";

interface PasswordStrength {
  score: number;
  feedback: string[];
}

export default function Settings() {
  const token = useSelector(getAuthToken);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setBreadcrumb } = useOutletContext<userLayoutContextType>();

  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: ""
  });

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: []
  });

  useEffect(() => {
    setBreadcrumb(["Dashboard", "Settings"]);
  }, [setBreadcrumb]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    setPasswordStrength({ score, feedback });
  };

  const getStrengthColor = (score: number) => {
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score <= 2) return "Weak";
    if (score <= 3) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage({ type: 'error', text: 'You must be logged in to change password' });
      return;
    }

    // Validation
    if (formData.password !== formData.password_confirmation) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.put(
        "http://localhost:8000/api/v1/user/password",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({ 
        type: 'success', 
        text: 'Password updated successfully!' 
      });
      
      // Clear form
      setFormData({
        current_password: "",
        password: "",
        password_confirmation: ""
      });
      setPasswordStrength({ score: 0, feedback: [] });
    } catch (err: any) {
      console.error("Failed to update password:", err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Failed to update password";
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ 
    name, 
    value, 
    onChange, 
    placeholder, 
    showPassword, 
    setShowPassword 
  }: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
  }) => (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Security Settings</h1>
              <p className="text-green-100">Update your password and security preferences</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Key className="h-4 w-4 mr-2" />
                Current Password
              </label>
              <PasswordInput
                name="current_password"
                value={formData.current_password}
                onChange={handleInputChange}
                placeholder="Enter your current password"
                showPassword={showCurrentPassword}
                setShowPassword={setShowCurrentPassword}
              />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Lock className="h-4 w-4 mr-2" />
                New Password
              </label>
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password (min 6 characters)"
                showPassword={showNewPassword}
                setShowPassword={setShowNewPassword}
              />
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-600' :
                      passwordStrength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        getStrengthColor(passwordStrength.score)
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  
                  {passwordStrength.feedback.length > 0 && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Requirements:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <li key={index} className="text-red-500">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Lock className="h-4 w-4 mr-2" />
                Confirm New Password
              </label>
              <PasswordInput
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />
              
              {formData.password_confirmation && formData.password !== formData.password_confirmation && (
                <p className="text-red-500 text-sm flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  Passwords do not match
                </p>
              )}
              
              {formData.password_confirmation && formData.password === formData.password_confirmation && (
                <p className="text-green-500 text-sm flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || formData.password !== formData.password_confirmation || formData.password.length < 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>

          {/* Security Tips */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security Tips
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>Use a strong, unique password that you don't use elsewhere</li>
              <li>Consider using a password manager</li>
              <li>Never share your password with anyone</li>
              <li>Change your password regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}