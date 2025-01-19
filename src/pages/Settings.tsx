import React from 'react';

const Settings = () => {
  return (
    <div className="bg-white min-h-screen p-8 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      <h1 className="text-2xl font-semibold text-nino-text mb-6">Settings</h1>
      <div className="max-w-3xl">
        <div className="space-y-6">
          <div className="bg-nino-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-nino-text mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-nino-gray mb-1">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-nino-primary/10"></div>
                  <button className="px-4 py-2 text-sm text-nino-primary border border-nino-primary rounded-md hover:bg-nino-primary/5 transition-colors">
                    Change Photo
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nino-gray mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-nino-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nino-gray mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-nino-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-nino-gray mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-nino-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="bg-nino-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-nino-text mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-nino-text">Email Notifications</h3>
                  <p className="text-sm text-nino-gray">Receive email updates about your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-nino-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nino-primary"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-nino-primary text-white rounded-md hover:bg-nino-primary/90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;