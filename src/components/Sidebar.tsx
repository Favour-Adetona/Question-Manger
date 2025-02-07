import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="w-64 bg-white h-screen shadow-lg">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center p-3 text-gray-700 rounded-lg ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/questions"
            className={({ isActive }) =>
              `flex items-center p-3 text-gray-700 rounded-lg ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
              }`
            }
          >
            <BookOpen className="w-5 h-5 mr-3" />
            Manage Questions
          </NavLink>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}