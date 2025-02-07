import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { Question } from '../types';

const API_URL = 'https://quiz-project-dpaw.onrender.com/api/admin';
const categories = ['Food', 'Water', 'Minerals', 'Forest'] as const;

const Popup = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <p className="text-lg font-medium text-gray-800">{message}</p>
      <button
        onClick={onClose}
        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
      >
        Close
      </button>
    </div>
  </div>
);

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Question>({
    category: 'Food',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(`${API_URL}/questions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
        } else {
          throw new Error('Failed to fetch questions');
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
      }
    };

    loadQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newQuestion.question.trim()) {
      setError('Question text is required');
      return;
    }

    if (newQuestion.options.some((opt) => !opt.trim())) {
      setError('All options must be filled out');
      return;
    }

    if (!newQuestion.correctAnswer) {
      setError('Please select the correct answer');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        const createdQuestion = await response.json();
        setQuestions([...questions, createdQuestion]);
        setSuccess('Question added successfully!');
        setNewQuestion({
          category: 'Food',
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
        });
        setError(null);
        setShowPopup(true);
      } else {
        throw new Error('Failed to add question');
      }
    } catch (err) {
      console.error('Failed to save question:', err);
      setError('Failed to save question. Please try again.');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const response = await fetch(`${API_URL}/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        setQuestions(questions.filter((q) => q.id !== questionId));
        setSuccess('Question deleted successfully!');
      } else {
        throw new Error('Failed to delete question');
      }
    } catch (err) {
      console.error('Failed to delete question:', err);
      setError('Failed to delete question');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Manage Questions</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={newQuestion.category}
            onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value as Question['category'] })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Question</label>
          <input
            type="text"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
          {newQuestion.options.map((option, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...newQuestion.options];
                  newOptions[index] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: newOptions });
                }}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
          <select
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          >
            <option value="">Select correct answer</option>
            {newQuestion.options.map((option, index) => (
              option && <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Question
        </button>
      </form>

      {showPopup && <Popup message="Question added successfully!" onClose={() => setShowPopup(false)} />}
    </div>
  );
}
