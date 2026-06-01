import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  file_url: string;
  created_at: string;
}

export default function SubjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchTasks(token);
  }, [id, router]);

  const fetchTasks = async (token: string) => {
    try {
      const response = await axios.get(`/api/tasks?subjectId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tasks & Assignments</h1>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
            <p>No tasks assigned yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  {task.title}
                </h3>
                <p className="text-gray-700 mb-4">{task.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Posted: {new Date(task.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {task.file_url && (
                    <a
                      href={task.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
