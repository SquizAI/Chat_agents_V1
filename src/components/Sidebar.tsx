import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Users, Calendar, Settings, PlusCircle, MapPin } from 'lucide-react';

const menuItems = [
  { icon: MessageCircle, label: 'Messages', path: '/' },
  { icon: Users, label: 'Contacts', path: '/contacts' },
  { icon: MapPin, label: 'Address Research', path: '/address-research' },
  { icon: Calendar, label: 'Reminders', path: '/reminders' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-20 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col items-center py-6">
      <div className="mb-8">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
          <MessageCircle className="text-white" size={24} />
        </div>
      </div>
      
      <nav className="flex-1 space-y-4">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
              location.pathname === path
                ? 'bg-blue-50 dark:bg-blue-900'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={label}
          >
            <Icon 
              className={`${
                location.pathname === path
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`} 
              size={24} 
            />
          </Link>
        ))}
      </nav>

      <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <PlusCircle className="text-blue-500" size={24} />
      </button>
    </div>
  );
}