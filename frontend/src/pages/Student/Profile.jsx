import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";
import { getUser, setUser } from "../../auth/auth";

const Profile = () => {
  const navigate = useNavigate();
  const currentUser = getUser();
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    class: "",
    cet_year: "",
    phone: "",
    address: ""
  });
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    accuracy: 0,
    rank: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/profile");
      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        class: res.data.class || "",
        cet_year: res.data.cet_year || "",
        phone: res.data.phone || "",
        address: res.data.address || ""
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      // Fallback to stored user
      if (currentUser) {
        setProfile({
          name: currentUser.name || "",
          email: currentUser.email || "",
          class: currentUser.class || "",
          cet_year: currentUser.cet_year || "",
          phone: currentUser.phone || "",
          address: currentUser.address || ""
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/results/my-results");
      const results = res.data;
      
      if (results.length > 0) {
        const totalQuizzes = results.length;
        const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
        const totalPossible = results.reduce((sum, r) => sum + (r.total_marks || 0), 0);
        const averageScore = (totalScore / totalQuizzes).toFixed(2);
        const accuracy = totalPossible > 0 ? ((totalScore / totalPossible) * 100).toFixed(2) : 0;
        
        setStats({
          totalQuizzes,
          averageScore,
          accuracy,
          rank: null
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profile.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!profile.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (profile.phone && !/^\d{10}$/.test(profile.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone must be 10 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      const res = await api.put("/auth/profile", profile);
      
      // Update local storage
      const updatedUser = { ...currentUser, ...res.data };
      setUser(updatedUser);
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
    setErrors({});
  };

  if (loading) {
    return (
      <Navbar>
        <PageContainer title="Profile">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </PageContainer>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <PageContainer
        title="My Profile"
        subtitle="View and manage your account information"
        actions={
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 bg-background text-text-primary rounded-lg hover:bg-border/30 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium inline-flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100 text-sm">Total Quizzes</span>
                <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-3xl font-bold">{stats.totalQuizzes}</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-100 text-sm">Average Score</span>
                <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-3xl font-bold">{stats.averageScore}</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-100 text-sm">Accuracy</span>
                <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold">{stats.accuracy}%</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-100 text-sm">Class Rank</span>
                <svg className="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="text-3xl font-bold">{stats.rank || "-"}</div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-border'} bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </>
                  ) : (
                    <div className="px-4 py-2 bg-background rounded-lg text-text-primary">
                      {profile.name || "-"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                  {isEditing ? (
                    <>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-border'} bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </>
                  ) : (
                    <div className="px-4 py-2 bg-background rounded-lg text-text-primary">
                      {profile.email || "-"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Phone Number</label>
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-border'} bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        placeholder="Enter 10-digit phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </>
                  ) : (
                    <div className="px-4 py-2 bg-background rounded-lg text-text-primary">
                      {profile.phone || "-"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-background rounded-lg text-text-primary">
                      {profile.address || "-"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Academic Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Class</label>
                  {isEditing ? (
                    <select
                      name="class"
                      value={profile.class}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select Class</option>
                      <option value="11th">11th</option>
                      <option value="12th">12th</option>
                      <option value="Dropper">Dropper</option>
                    </select>
                  ) : (
                    <div className="px-4 py-2 bg-background rounded-lg text-text-primary">
                      {profile.class || "-"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">CET Target Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="cet_year"
                      value={profile.cet_year}
                      onChange={handleChange}
                      min="2024"
                      max="2030"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g., 2025"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-background rounded-lg text-text-primary">
                      {profile.cet_year || "-"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-xl border border-primary/20">
              <h4 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/practice")}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Start Practice
                </button>
                <button
                  onClick={() => navigate("/student")}
                  className="w-full px-4 py-2 bg-background text-text-primary rounded-lg hover:bg-border/30 transition-colors text-sm font-medium"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </Navbar>
  );
};

export default Profile;
