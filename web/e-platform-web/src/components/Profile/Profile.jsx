import React, { useState } from 'react';

// --- Icon Components (SVG conversion) ---

const HomeIcon = () => (
  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
    <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
  </svg>
);

const VideoIcon = () => (
  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
    <path d="M164.44,105.34l-48-32A8,8,0,0,0,104,80v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,129.05V95l25.58,17ZM216,40H40A16,16,0,0,0,24,56V168a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,128H40V56H216V168Zm16,40a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16H224A8,8,0,0,1,232,208Z"></path>
  </svg>
);

const EnvelopeIcon = () => (
  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"></path>
  </svg>
);

const BellIcon = () => (
  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
    <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
  </svg>
);

const GearIcon = () => (
  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
  </svg>
);

// --- Reusable Components ---

const NavItem = ({ icon: Icon, label, isActive }) => {
  const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg";
  const activeClasses = isActive ? "bg-[#f0f2f4]" : "";
  
  return (
    <div className={`${baseClasses} ${activeClasses}`}>
      <div className="text-[#111418] size-6">
        <Icon />
      </div>
      <p className="text-[#111418] text-sm font-medium leading-normal">{label}</p>
    </div>
  );
};

const ToggleSwitch = ({ name, checked, onChange }) => (
  <label className="relative inline-flex cursor-pointer items-center">
    <input 
      checked={checked} 
      className="peer sr-only" 
      type="checkbox" 
      name={name}
      onChange={onChange}
    />
    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full"></div>
  </label>
);

// --- Main Component ---

const SettingsPage = () => {
  // --- State Management ---
  const [profileData, setProfileData] = useState({
    fullName: 'Sarah',
    email: 'sarah@example.com',
    profilePicUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcJbkGXYhfKH6a48kBUXBfZSUZkEtHE1wepC-oY7rhadisAbvkzTc7-wTuhyIjzgngDcQsEy4PK2b3XuKclqaOYetFgPhVytWGjZrP95DcvUmsXd6TQ-oMnLXh9STLWucBYm5lZhvjdizHApSF47ZfVMl9wQmWwqql72DCWvwLWXeP6VmtWGjZrP95DcvUmsXd6TQ-oMnLXh9STLWucBYm5lZhvjdizHApSF47ZfVMl9wQmWwqql72DCWvwLWXeP6VmtG5_CqRVXG09fTrqrkStfjCiI91xk-KKIt7ZlsMxdlxpwXZHGByob51pTopqrHhAG4XMLR0uackzP3INmrN-YhpYgqw",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    courseProgressReminders: true,
    newMessageAlerts: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
  });

  // --- Handlers ---

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handlePrivacyToggle = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log('Profile Changes Saved:', profileData);
    alert('Profile Changes Saved! Check the console for data.');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log('Password Updated:', passwordData);
    alert('Password Updated! Check the console for data.');
    // Clear fields after submission (optional)
    setPasswordData({ currentPassword: '', newPassword: '' });
  };

  // --- JSX Structure ---

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          
          {/* Left Column: Sidebar */}
          <div className="layout-content-container flex flex-col w-80 hidden md:flex"> {/* Added hidden md:flex for responsiveness */}
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
              <div className="flex flex-col gap-4">
                {/* User Profile */}
                <div className="flex gap-3">
                  <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
                    style={{ backgroundImage: `url("${profileData.profilePicUrl}")` }}
                  ></div>
                  <div className="flex flex-col">
                    <h1 className="text-[#111418] text-base font-medium leading-normal">{profileData.fullName}</h1>
                    <p className="text-[#617589] text-sm font-normal leading-normal">Student</p>
                  </div>
                </div>
                
                {/* Navigation Links */}
                <div className="flex flex-col gap-2">
                  <NavItem icon={HomeIcon} label="Home" isActive={false} />
                  <NavItem icon={VideoIcon} label="Courses" isActive={false} />
                  <NavItem icon={EnvelopeIcon} label="Messages" isActive={false} />
                  <NavItem icon={BellIcon} label="Notifications" isActive={false} />
                  <NavItem icon={GearIcon} label="Settings" isActive={true} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col gap-8 p-4 md:p-6">
              
              {/* Header */}
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-[#111418] md:text-4xl">Settings</h1>
                <p className="text-base text-[#617589]">Manage your account settings and preferences.</p>
              </div>

              <div className="flex flex-col gap-8">
                
                {/* 1. Profile Information */}
                <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-[#111418]">Profile Information</h2>
                    <p className="text-base text-[#617589]">Update your personal details here.</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 shrink-0" 
                      style={{ backgroundImage: `url("${profileData.profilePicUrl}")` }}
                    ></div>
                    <div className="flex flex-col gap-2">
                      <button type="button" className="w-fit rounded-lg bg-[#111418] px-4 py-2.5 text-sm font-semibold text-white">Upload New Photo</button>
                      <button type="button" className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#111418]">Remove Photo</button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#111418]" htmlFor="fullName">Full Name</label>
                      <input 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base text-[#111418] placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500" 
                        id="fullName" 
                        name="fullName"
                        placeholder="Sarah" 
                        type="text" 
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#111418]" htmlFor="email">Email Address</label>
                      <input 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base text-[#111418] placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500" 
                        id="email" 
                        name="email"
                        placeholder="sarah@example.com" 
                        type="email" 
                        value={profileData.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="w-full sm:w-auto rounded-lg bg-[#111418] px-4 py-2.5 text-sm font-semibold text-white">Save Changes</button>
                  </div>
                </form>

                {/* 2. Change Password */}
                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-[#111418]">Change Password</h2>
                    <p className="text-base text-[#617589]">For security, choose a strong password.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#111418]" htmlFor="currentPassword">Current Password</label>
                      <input 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base text-[#111418] placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500" 
                        id="currentPassword" 
                        name="currentPassword"
                        placeholder="Enter current password" 
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#111418]" htmlFor="newPassword">New Password</label>
                      <input 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base text-[#111418] placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500" 
                        id="newPassword" 
                        name="newPassword"
                        placeholder="Enter new password" 
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="w-full sm:w-auto rounded-lg bg-[#111418] px-4 py-2.5 text-sm font-semibold text-white">Update Password</button>
                  </div>
                </form>

                {/* 3. Notification Preferences */}
                <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-[#111418]">Notification Preferences</h2>
                    <p className="text-base text-[#617589]">Control how you receive notifications from us.</p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h4 className="font-medium text-[#111418]">Email Notifications</h4>
                        <p className="text-sm text-[#617589]">Receive updates and announcements via email.</p>
                      </div>
                      <ToggleSwitch 
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationToggle}
                      />
                    </div>
                    
                    {/* Course Progress Reminders */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h4 className="font-medium text-[#111418]">Course Progress Reminders</h4>
                        <p className="text-sm text-[#617589]">Get reminders to continue your learning streak.</p>
                      </div>
                      <ToggleSwitch 
                        name="courseProgressReminders"
                        checked={notificationSettings.courseProgressReminders}
                        onChange={handleNotificationToggle}
                      />
                    </div>
                    
                    {/* New Message Alerts */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h4 className="font-medium text-[#111418]">New Message Alerts</h4>
                        <p className="text-sm text-[#617589]">Notify me when I receive a new message.</p>
                      </div>
                      <ToggleSwitch 
                        name="newMessageAlerts"
                        checked={notificationSettings.newMessageAlerts}
                        onChange={handleNotificationToggle}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Privacy Settings */}
                <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-[#111418]">Privacy Settings</h2>
                    <p className="text-base text-[#617589]">Manage your profile's visibility.</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <h4 className="font-medium text-[#111418]">Public Profile</h4>
                      <p className="text-sm text-[#617589]">Allow others to see your course progress and achievements.</p>
                    </div>
                    <ToggleSwitch 
                      name="publicProfile"
                      checked={privacySettings.publicProfile}
                      onChange={handlePrivacyToggle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

/*
  NOTES IMPORTANTES POUR L'UTILISATION:

  1.  **Tailwind CSS:** Ce composant est basé sur Tailwind CSS. Pour qu'il fonctionne correctement, vous devez avoir Tailwind CSS configuré dans votre projet React.
  2.  **Configuration Tailwind personnalisée:** Le code HTML original utilisait des couleurs et des polices spécifiques. Assurez-vous que votre configuration Tailwind inclut :
      
      ```javascript
      // Dans tailwind.config.js
      module.exports = {
        // ...
        theme: {
          extend: {
            colors: {
              // Couleurs principales utilisées dans le composant
              "#111418": "#111418", // Texte principal
              "#617589": "#617589", // Texte secondaire
              "#f0f2f4": "#f0f2f4", // Fond du lien actif
              // Ajoutez d'autres couleurs si nécessaire
            },
            fontFamily: {
              "sans": ['Inter', 'Noto Sans', 'sans-serif'], // Assurez-vous que Inter et Noto Sans sont disponibles
            },
          },
        },
        // ...
      }
      ```
      
      Vous devez également vous assurer que les polices sont chargées, comme dans le HTML original :
      
      ```html
      <link href="https://fonts.googleapis.com/css2?display=swap&family=Inter%3Awght%40400%3B500%3B700%3B900&family=Noto+Sans%3Awght%40400%3B500%3B700%3B900" rel="stylesheet"/>
      ```

  3.  **Icônes SVG:** Les icônes de navigation ont été converties en composants React (`HomeIcon`, `VideoIcon`, etc.) pour une meilleure gestion.
  4.  **Gestion d'État:**
      -   `profileData`, `passwordData`, `notificationSettings`, et `privacySettings` gèrent l'état des différentes sections.
      -   Les fonctions `handle...Change` et `handle...Toggle` gèrent les mises à jour d'état.
      -   Les fonctions `handle...Submit` gèrent la soumission des formulaires (elles affichent une alerte et loguent les données dans la console).
*/
