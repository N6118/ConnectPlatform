import React from "react";
import { X, Moon, Bell, Shield, Laptop } from "lucide-react";

interface UserSettingsProps {
  onClose: () => void;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onNotificationChange: (enabled: boolean) => void;
  currentTheme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
}

export default function UserSettings({
  onClose,
  onThemeChange,
  onNotificationChange,
  currentTheme,
  notificationsEnabled,
}: UserSettingsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Theme Settings */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Theme</h3>
            <div className="flex space-x-2">
              {[
                { value: 'light', icon: Laptop, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'system', icon: Laptop, label: 'System' }
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => onThemeChange(value as 'light' | 'dark' | 'system')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                    ${currentTheme === value 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Notifications</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNotificationChange(!notificationsEnabled)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Bell size={20} className="text-gray-600" />
                  <div className="text-left">
                    <p className="text-gray-800">Push Notifications</p>
                    <p className="text-sm text-gray-500">
                      {notificationsEnabled 
                        ? 'Notifications are enabled' 
                        : 'Enable notifications to stay updated'}
                    </p>
                  </div>
                </div>
                <div className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                  notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                    notificationsEnabled ? 'translate-x-5' : ''
                  }`} />
                </div>
              </button>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Privacy & Security</h3>
            <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Shield size={20} className="text-gray-600" />
              <div className="text-left">
                <p className="text-gray-800">Privacy Settings</p>
                <p className="text-sm text-gray-500">
                  Manage your privacy preferences
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <p className="text-sm text-gray-500 text-center">
            CONNECT Messaging v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
