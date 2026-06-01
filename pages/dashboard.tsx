import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  studentId: string;
}

interface Subject {
  id: string;
  subject_name: string;
  subject_code: string;
  first_name: string;
  last_name: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchSubjects(token);
  }, [router]);

  const fetchSubjects = async (token: string) => {
    try {
      const response = await axios.get('/api/subjects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubjects(response.data.subjects);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Maranatha Portal</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.firstName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.firstName} {user?.lastName}!
          </h2>
          <p className="text-gray-600">Student ID: {user?.studentId}</p>
          <p className="text-gray-600">Role: {user?.role}</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Subjects</h3>
          {subjects.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              <p>No subjects assigned yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Link key={subject.id} href={`/subject/${subject.id}`}>
                  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
                    <h4 className="text-xl font-bold text-blue-600 mb-2">
                      {subject.subject_name}
                    </h4>
                    <p className="text-gray-600 mb-4">Code: {subject.subject_code}</p>
                    <p className="text-sm text-gray-500">
                      Teacher: {subject.first_name} {subject.last_name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
