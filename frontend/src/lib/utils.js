export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getProfilePicUrl(profilePicPath) {
  if (!profilePicPath || profilePicPath === "/avatar.png") {
    return "/avatar.png";
  }
  
  // If it's already a full URL, return as is
  if (profilePicPath.startsWith('http://') || profilePicPath.startsWith('https://')) {
    return profilePicPath;
  }
  
  // For relative paths starting with /profilepics, prepend backend base URL
  if (profilePicPath.startsWith('/profilepics')) {
    const backendBaseUrl = import.meta.env.MODE === "development" 
      ? "http://localhost:5000" 
      : "";
    return backendBaseUrl + profilePicPath;
  }
  
  return profilePicPath;
}
