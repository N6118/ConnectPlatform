import React from "react";
import { X, Moon, Sun, Monitor, Bell } from "lucide-react";

interface UserSettingsProps {
  onClose: () => void;
  onThemeChange: (theme: "light" | "dark" | "system") => void;
  onNotificationChange: (enabled: boolean) => void;
  currentTheme: "light" | "dark" | "system";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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

        {/* Settings Content */}
        <div className="p-4 space-y-6">
          {/* Theme Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onThemeChange("light")}
                className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                  currentTheme === "light"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Sun size={24} className="text-gray-600 mb-2" />
                <span className="text-sm">Light</span>
              </button>
              <button
                onClick={() => onThemeChange("dark")}
                className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                  currentTheme === "dark"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Moon size={24} className="text-gray-600 mb-2" />
                <span className="text-sm">Dark</span>
              </button>
              <button
                onClick={() => onThemeChange("system")}
                className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                  currentTheme === "system"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Monitor size={24} className="text-gray-600 mb-2" />
                <span className="text-sm">System</span>
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Notifications
            </h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Bell size={20} className="text-gray-600" />
                <span className="ml-3 text-gray-700">Enable Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => onNotificationChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
