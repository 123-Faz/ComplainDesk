// src/pages/client dashboard/profile.tsx
import { useSelector } from "react-redux";
import { getAuthToken } from "@/store/authSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { type userLayoutContextType } from "@/layout/client dashboard/types";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  Camera,
  User as UserIcon
} from "lucide-react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  image: string;
  username: string;
  createdAt: string;
}

export default function Profile() {
  const token = useSelector(getAuthToken);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { setBreadcrumb } = useOutletContext<userLayoutContextType>();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    bio: ""
  });

  useEffect(() => {
    setBreadcrumb(["Dashboard", "Profile"]);
  }, [setBreadcrumb]);

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setFormData({
        name: res.data.name || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        bio: res.data.bio || ""
      });
      setImagePreview(res.data.image ? `http://localhost:8000/uploads/users/${res.data.image}` : "");
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!token) return;

    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('bio', formData.bio);

      const imageInput = document.getElementById('user_image') as HTMLInputElement;
      if (imageInput?.files?.[0]) {
        formDataToSend.append('user_image', imageInput.files[0]);
      }

      const res = await axios.put(
        "http://localhost:8000/api/v1/user/profile",
        formDataToSend,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      setProfile(res.data);
      setIsEditing(false);
      // Show success message
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      alert(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      bio: profile?.bio || ""
    });
    setImagePreview(profile?.image ? `http://localhost:8000/uploads/users/${profile.image}` : "");
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="flex space-x-6">
              <div className="bg-gray-200 rounded-full h-24 w-24"></div>
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="text-blue-100">Manage your personal information</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Image */}
            <div className="lg:w-1/3 flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                
                {isEditing && (
                  <label htmlFor="user_image" className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      id="user_image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-center bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      placeholder="Your Name"
                    />
                  ) : (
                    profile?.name || "Unknown User"
                  )}
                </h2>
                <p className="text-gray-500 flex items-center justify-center mt-1">
                  <Mail className="h-4 w-4 mr-1" />
                  {profile?.email}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Member since {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '2024'}
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:w-2/3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {profile?.phone || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4 mr-2" />
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {profile?.address || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 mr-2" />
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg min-h-[100px]">
                    {profile?.bio || "No bio provided"}
                  </p>
                )}
              </div>

              {/* Read-only Info */}
              {!isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    <p className="text-gray-900 font-medium">{profile?.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">User ID</label>
                    <p className="text-gray-900 font-mono text-sm">{profile?._id}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}