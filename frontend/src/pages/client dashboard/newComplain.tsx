// src/pages/client dashboard/newComplaint.tsx
import { useSelector } from "react-redux";
import { getAuthToken, getUser } from "@/store/authSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";
import { type userLayoutContextType } from "@/layout/client dashboard/types";
import { 
  AlertCircle, 
  CheckCircle, 
  Send, 
  FileText, 
  User,
  Calendar,
  Flag,
  X,
  HelpCircle,
  Info,
  Sparkles,
  ArrowLeft
} from "lucide-react";

interface ComplaintFormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
}

interface ValidationState {
  title: boolean;
  description: boolean;
}

const CATEGORIES = [
  { value: "technical", label: "Technical Issue", icon: "🔧", color: "bl" },
  { value: "billing", label: "Billing Problem", icon: "💰", color: "gr" },
  { value: "account", label: "Account Issue", icon: "👤", color: "pr" },
  { value: "feature", label: "Feature Request", icon: "✨", color: "or" },
  { value: "feedback", label: "General Feedback", icon: "💬", color: "yl" },
  { value: "other", label: "Other", icon: "📝", color: "gy" }
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "gr", description: "Minor issue, no urgency" },
  { value: "medium", label: "Medium", color: "yl", description: "Important but not critical" },
  { value: "high", label: "High", color: "or", description: "Urgent matter requiring attention" },
  { value: "urgent", label: "Urgent", color: "rd", description: "Critical issue needing immediate action" }
];

export default function NewComplaint() {
  const token = useSelector(getAuthToken);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const { setBreadcrumb } = useOutletContext<userLayoutContextType>();
  
  const [formData, setFormData] = useState<ComplaintFormData>({
    title: "",
    description: "",
    category: "technical",
    priority: "medium"
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [validationState, setValidationState] = useState<ValidationState>({
    title: false,
    description: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [characterCount, setCharacterCount] = useState(0);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setBreadcrumb(["Dashboard", "New Complaint"]);
  }, [setBreadcrumb]);

  useEffect(() => {
    setCharacterCount(formData.description.length);
  }, [formData.description]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'title':
        if (!value.trim()) return "Title is required";
        if (value.trim().length < 3) return "Title must be at least 3 characters";
        if (value.trim().length > 100) return "Title must not exceed 100 characters";
        return "";
      case 'description':
        if (!value.trim()) return "Description is required";
        if (value.trim().length < 100) return `Description must be at least 100 characters (${value.trim().length}/100)`;
        if (value.trim().length > 5000) return "Description must not exceed 5000 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    setValidationState(prev => ({
      ...prev,
      [name]: error === "" && value.trim().length > 0
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate title
    const titleError = validateField('title', formData.title);
    if (titleError) {
      newErrors.title = titleError;
      isValid = false;
    }

    // Validate description
    const descriptionError = validateField('description', formData.description);
    if (descriptionError) {
      newErrors.description = descriptionError;
      isValid = false;
    }

    // Validate category
    if (!formData.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }

    // Validate priority
    if (!formData.priority) {
      newErrors.priority = "Please select a priority level";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setSubmitStatus({
        type: 'error',
        message: 'Please log in to submit a complaint'
      });
      return;
    }

    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fix the errors before submitting'
      });
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/rgcomp",
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          priority: formData.priority
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setSubmitStatus({
          type: 'success',
          message: 'Complaint submitted successfully! Redirecting...'
        });
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "technical",
          priority: "medium"
        });
        setCharacterCount(0);
        setTouched({});
        setValidationState({ title: false, description: false });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/dashboard/mycomplains', { 
            state: { newComplaintSubmitted: true, complaintId: response.data._id }
          });
        }, 2000);
      }
    } catch (error: any) {
      console.error("Complaint submission error:", error);
      
      let errorMessage = "Failed to submit complaint. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your connection.";
      }
      
      // Handle validation errors from backend
      if (error.response?.data && typeof error.response.data === 'string') {
        try {
          const backendErrors = JSON.parse(error.response.data);
          if (backendErrors.title) {
            setErrors(prev => ({ ...prev, title: backendErrors.title }));
            errorMessage = backendErrors.title;
          }
          if (backendErrors.description) {
            setErrors(prev => ({ ...prev, description: backendErrors.description }));
            errorMessage = backendErrors.description;
          }
        } catch (e) {
          // Not JSON, use as is
        }
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.description) {
      if (window.confirm('Are you sure you want to cancel? Your complaint will not be saved.')) {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'rd';
      case 'high': return 'or';
      case 'medium': return 'yl';
      case 'low': return 'gr';
      default: return 'bl';
    }
  };

  const getCategoryIcon = (categoryValue: string) => {
    const category = CATEGORIES.find(c => c.value === categoryValue);
    return category ? category.icon : "📝";
  };

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-bg1 rounded-xl shadow-lg p-8 text-center border border-bg0">
          <AlertCircle className="h-16 w-16 text-yl6 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-fg2 mb-2">Authentication Required</h2>
          <p className="text-fg2 mb-6">Please log in to submit a complaint</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-bl6 text-fg0 px-6 py-2 rounded-lg hover:bg-bl7 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-fg2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-bg4 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-fg2">Submit New Complaint</h1>
            <p className="text-fg2 mt-1">Please provide detailed information about your issue</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-bl5 to-purple-500 p-3 rounded-full">
          <FileText className="h-6 w-6 text-fg0" />
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-bl5 to-bl6 rounded-xl shadow-lg p-6 text-fg0">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Guidelines for Submitting a Complaint</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Provide a clear and descriptive title (minimum 3 characters)</li>
              <li>Describe your issue in detail (minimum 100 characters)</li>
              <li>Select the appropriate category and priority level</li>
              <li>Be respectful and professional in your communication</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0">
          <label className="block mb-2">
            <span className="text-lg font-semibold text-fg2">Title</span>
            <span className="text-rd6 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-bg2 border rounded-lg focus:ring-2 focus:ring-bl6 focus:border-bl6 transition-all text-fg2 placeholder-fg2 ${
                touched.title && errors.title ? 'border-rd5' : 'border-bg0'
              } ${validationState.title && !errors.title ? 'border-gr5' : ''}`}
              placeholder="Enter a clear and concise title for your complaint"
              disabled={isSubmitting}
            />
            {validationState.title && !errors.title && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gr5 h-5 w-5" />
            )}
          </div>
          {touched.title && errors.title && (
            <p className="error-message text-rd6 text-sm mt-2 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.title}
            </p>
          )}
          <p className="text-xs text-fg2 mt-2">
            Tip: Use a specific title that summarizes your issue (3-100 characters)
          </p>
        </div>

        {/* Description Field */}
        <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0">
          <label className="block mb-2">
            <span className="text-lg font-semibold text-fg2">Description</span>
            <span className="text-rd6 ml-1">*</span>
          </label>
          <div className="relative">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={8}
              className={`w-full px-4 py-3 bg-bg2 border rounded-lg focus:ring-2 focus:ring-bl6 focus:border-bl6 transition-all text-fg2 placeholder-fg2 resize-y ${
                touched.description && errors.description ? 'border-rd5' : 'border-bg0'
              } ${validationState.description && !errors.description ? 'border-gr5' : ''}`}
              placeholder="Please provide detailed information about your complaint. Include steps to reproduce, error messages, screenshots (if applicable), and any other relevant details..."
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center space-x-4">
              {touched.description && errors.description && (
                <p className="error-message text-rd6 text-sm flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.description}
                </p>
              )}
              {validationState.description && !errors.description && (
                <p className="text-gr6 text-sm flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid description
                </p>
              )}
            </div>
            <div className={`text-sm ${characterCount >= 100 ? 'text-gr6' : characterCount > 0 ? 'text-yl6' : 'text-fg2'}`}>
              {characterCount}/100 characters minimum
            </div>
          </div>
          <div className="mt-3 p-3 bg-bg2 rounded-lg border border-bg0">
            <div className="flex items-center space-x-2 text-sm text-fg2 mb-2">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Writing Tips:</span>
            </div>
            <ul className="text-xs space-y-1 text-fg2 list-disc list-inside">
              <li>Be specific about what happened and when</li>
              <li>Include any error messages you received</li>
              <li>Explain the impact of the issue</li>
              <li>Mention what you've already tried to resolve it</li>
            </ul>
          </div>
        </div>

        {/* Category and Priority Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Selection */}
          <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0">
            <label className="block mb-3">
              <span className="text-lg font-semibold text-fg2">Category</span>
              <span className="text-rd6 ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: category.value }));
                    setErrors(prev => ({ ...prev, category: '' }));
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    formData.category === category.value
                      ? `border-${category.color}6 bg-${category.color}1`
                      : 'border-bg0 bg-bg2 hover:bg-bg4'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium text-fg2">{category.label}</span>
                  </div>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-rd6 text-sm mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Priority Selection */}
          <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0">
            <label className="block mb-3">
              <span className="text-lg font-semibold text-fg2">Priority Level</span>
              <span className="text-rd6 ml-1">*</span>
            </label>
            <div className="space-y-2">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, priority: priority.value as any }));
                    setErrors(prev => ({ ...prev, priority: '' }));
                  }}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    formData.priority === priority.value
                      ? `border-${priority.color}6 bg-${priority.color}1`
                      : 'border-bg0 bg-bg2 hover:bg-bg4'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Flag className={`h-5 w-5 text-${priority.color}6`} />
                      <div className="text-left">
                        <span className="font-medium text-fg2">{priority.label}</span>
                        <p className="text-xs text-fg2 mt-0.5">{priority.description}</p>
                      </div>
                    </div>
                    {formData.priority === priority.value && (
                      <CheckCircle className={`h-5 w-5 text-${priority.color}6`} />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {errors.priority && (
              <p className="text-rd6 text-sm mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.priority}
              </p>
            )}
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-r from-bg2 to-bg1 rounded-xl shadow-lg p-6 border border-bg0">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-bl5 to-purple-500 p-3 rounded-full">
              <User className="h-6 w-6 text-fg0" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-fg2">Submitting as</p>
              <p className="font-semibold text-fg2">{user?.username || 'User'}</p>
              <p className="text-sm text-fg2">{user?.email}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-fg2">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Submit Status */}
        {submitStatus.type && (
          <div className={`rounded-xl p-4 ${
            submitStatus.type === 'success' ? 'bg-gr1 border border-gr3' : 'bg-rd1 border border-rd3'
          }`}>
            <div className="flex items-center space-x-3">
              {submitStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-gr6" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rd6" />
              )}
              <p className={`flex-1 ${
                submitStatus.type === 'success' ? 'text-gr6' : 'text-rd6'
              }`}>
                {submitStatus.message}
              </p>
              <button
                onClick={() => setSubmitStatus({ type: null, message: '' })}
                className="hover:opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !validationState.title || !validationState.description}
            className="flex-1 bg-bl6 text-fg0 py-3 px-6 rounded-lg font-semibold hover:bg-bl7 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-fg0"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Submit Complaint</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 border-2 border-bg0 bg-bg2 py-3 px-6 rounded-lg font-semibold hover:bg-bg4 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {/* Validation Summary */}
        {Object.keys(touched).length > 0 && (errors.title || errors.description) && (
          <div className="bg-yl1 border border-yl3 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <HelpCircle className="h-4 w-4 text-yl6" />
              <span className="font-semibold text-yl6">Please fix the following before submitting:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-yl6">
              {errors.title && <li>{errors.title}</li>}
              {errors.description && <li>{errors.description}</li>}
            </ul>
          </div>
        )}
      </form>

      {/* Help Section */}
      <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0">
        <div className="flex items-start space-x-3">
          <HelpCircle className="h-5 w-5 text-bl6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-fg2 mb-2">Need Help?</h3>
            <p className="text-sm text-fg2 mb-3">
              If you're experiencing technical issues while submitting this form, please contact our support team.
            </p>
            <button
              onClick={() => window.location.href = 'mailto:support@complaintdesk.com'}
              className="text-bl6 hover:text-bl7 text-sm font-medium"
            >
              Contact Support →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}