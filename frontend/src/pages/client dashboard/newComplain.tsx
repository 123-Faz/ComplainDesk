import React, { useState } from 'react';
import { Calendar, User, Stethoscope, Heart, MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface AppointmentFormData {
  doctor_name: string;
  patient_name: string;
  appointment_date: string;
  type: string;
  symptoms: string;
  notes: string;
}

const AppointmentBooking: React.FC = () => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    doctor_name: '',
    patient_name: '',
    appointment_date: '',
    type: 'consultation',
    symptoms: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  // Enum values for appointment types
  const appointmentTypes = [
    'consultation',
    'checkup', 
    'follow-up',
    'emergency',
    'surgery',
    'therapy',
    'vaccination',
    'test'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const submitData = new FormData();
      submitData.append('doctor_name', formData.doctor_name);
      submitData.append('patient_name', formData.patient_name);
      submitData.append('appointment_date', formData.appointment_date);
      submitData.append('type', formData.type);
      submitData.append('symptoms', formData.symptoms);
      submitData.append('notes', formData.notes);

      const response = await fetch('http://localhost:3000/api/v1/user/appointments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: submitData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to book appointment');
      }

      setSuccess(true);
      // Reset form
      setFormData({
        doctor_name: '',
        patient_name: '',
        appointment_date: '',
        type: 'consultation',
        symptoms: '',
        notes: ''
      });
      
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error: any) {
      console.error('Booking failed:', error);
      setError(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Book Your Appointment</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Schedule your medical visit with our expert healthcare professionals
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 animate-in slide-in-from-top duration-500">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="text-green-800 font-semibold">Appointment Booked Successfully!</h3>
              <p className="text-green-700 text-sm">Your appointment has been scheduled and confirmation details will be sent to you.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">Booking Failed</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Booking Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Doctor Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Stethoscope className="w-4 h-4 mr-2 text-blue-600" />
                  Doctor Name
                </label>
                <input
                  type="text"
                  name="doctor_name"
                  value={formData.doctor_name}
                  onChange={handleChange}
                  placeholder="Enter doctor's username (e.g., doctor, dr_smith)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
                <p className="text-xs text-gray-500">Enter the doctor's username as registered in the system</p>
              </div>

              {/* Patient Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Patient Full Name
                </label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  placeholder="Enter patient's full name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Date and Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Appointment Date */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                    required
                  />
                </div>

                {/* Appointment Type */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Heart className="w-4 h-4 mr-2 text-blue-600" />
                    Appointment Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors cursor-pointer"
                    required
                  >
                    {appointmentTypes.map(type => (
                      <option key={type} value={type}>
                        {type.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Symptoms Description
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Please describe your symptoms, when they started, and their severity..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
                <p className="text-xs text-gray-500">Be as detailed as possible to help your doctor</p>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <MessageCircle className="w-4 h-4 mr-2 text-blue-600" />
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any other information you'd like to share with the doctor..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Booking Your Appointment...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-3" />
                    Book Appointment Now
                  </>
                )}
              </button>

              {/* Help Text */}
              <p className="text-center text-sm text-gray-500 pt-4">
                You will receive a confirmation email and SMS with appointment details
              </p>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Easy Scheduling</h3>
            <p className="text-sm text-gray-600">Book appointments 24/7 at your convenience</p>
          </div>
          
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Expert Doctors</h3>
            <p className="text-sm text-gray-600">Qualified healthcare professionals</p>
          </div>
          
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Instant Confirmation</h3>
            <p className="text-sm text-gray-600">Get immediate booking confirmation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;