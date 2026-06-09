// src/layout/adminDashboard/components/AdminFooter.tsx

const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-0">
          © 2024 Complaint Desk. All rights reserved.
        </div>
        <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;