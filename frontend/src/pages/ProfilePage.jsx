import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import { getProfilePicUrl } from "../lib/utils.js";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImg(reader.result);
      setUploadError(null);
    };

    // Create FormData and send the file directly
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await updateProfile(formData);
      // Clear selectedImg after successful upload since authUser.profilePic will be updated
      setSelectedImg(null);
    } catch (error) {
      // Revert to previous image if upload fails
      setSelectedImg(null);
      setUploadError("Failed to upload profile picture. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 dark:from-base-200 dark:via-base-300 dark:to-base-100 py-10 px-2">
      <div className="w-full max-w-2xl mx-auto">
  <div className="bg-white/80 dark:bg-base-200/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 space-y-10 border border-white/30 animate-fade-in-up">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-pink-400 text-transparent bg-clip-text">Profile</h1>
            <p className="mt-2 text-base-content/70 text-base">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="size-36 rounded-full bg-gradient-to-tr from-primary to-pink-400 p-1 animate-spin-slow group-hover:animate-none">
                <div className="size-36 rounded-full bg-white dark:bg-base-200 flex items-center justify-center">
<img
  src={selectedImg || getProfilePicUrl(authUser.profilePic) || "/avatar.png"}
  alt="Profile"
  className="size-36 rounded-full object-cover border-4 border-white dark:border-base-200 shadow-lg"
  onError={(e) => {
    e.target.src = "/avatar.png";
  }}
/>
                </div>
              </div>
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-2 right-2 
                  bg-primary hover:scale-110
                  p-2 rounded-full cursor-pointer 
                  shadow-lg transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-base-content/60">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
            {uploadError && (
              <p className="text-sm text-red-500 text-center">{uploadError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="text-sm text-base-content/70 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-100 rounded-lg border border-base-300 font-semibold text-base-content">{authUser?.fullName}</p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-base-content/70 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-100 rounded-lg border border-base-300 font-semibold text-base-content">{authUser?.email}</p>
            </div>
          </div>

          <div className="border-t border-base-300 pt-8">
            <h2 className="text-xl font-bold mb-4 text-primary">Account Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base-content/80">
              <div className="flex items-center justify-between py-2 border-b border-base-200">
                <span>Member Since</span>
                <span className="font-semibold">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-base-200 sm:border-b-0">
                <span>Account Status</span>
                <span className="text-green-500 font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
