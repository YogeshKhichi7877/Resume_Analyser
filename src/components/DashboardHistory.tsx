import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Eye, FileText, TrendingUp, Calendar, ArrowRight, X } from 'lucide-react';

interface HistoryItem {
  id: string;
  targetDomain: string;
  score: number;
  atsCompatibility: number;
  grammarScore: number;
  readabilityScore: number;
  createdAt: string;
  summary: string;
}

interface DashboardHistoryProps {
  userEmail: string;
  onViewAnalysis?: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DashboardHistory: React.FC<DashboardHistoryProps> = ({ 
  userEmail, 
  onViewAnalysis, 
  isOpen, 
  onClose 
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API URL - update this to match your backend
  const API_URL = 'https://resume-analyser-ch1f.onrender.com';

  useEffect(() => {
    if (isOpen && userEmail) {
      fetchHistory();
    }
  }, [isOpen, userEmail]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/resume/history?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (data.success) {
        setHistory(data.history);
      } else {
        setError(data.error || 'Failed to fetch history');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/resume/analysis/${id}?email=${encodeURIComponent(userEmail)}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      
      if (data.success) {
        setHistory(history.filter(item => item.id !== id));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete analysis');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDomainLabel = (domain: string) => {
    return domain.replace('-', ' ').toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden border-4 border-black dark:border-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black dark:border-white bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-black text-white uppercase">Analysis History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          
          {/* Info Banner */}
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Showing your last {history.length} analysis{history.length >= 20 ? ' (maximum)' : ''}. 
              Older entries are automatically deleted.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-gray-600 dark:text-gray-400">Loading history...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-600 rounded-lg">
              <p className="font-bold text-red-800 dark:text-red-200">{error}</p>
              <button 
                onClick={fetchHistory}
                className="mt-2 text-sm font-medium text-red-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl font-bold text-gray-600 dark:text-gray-400">No analysis history yet</p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">Upload and analyze a resume to see your history here</p>
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onViewAnalysis?.(item.id)}
                  className="p-4 border-4 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    
                    {/* Left: Domain & Date */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold rounded-full uppercase">
                          {getDomainLabel(item.targetDomain)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>

                    {/* Right: Score & Actions */}
                    <div className="flex items-center gap-4 ml-4">
                      
                      {/* Scores */}
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className={`text-2xl font-black ${getScoreColor(item.score)}`}>
                            {item.score}
                          </span>
                          <span className="text-xs text-gray-400">/100</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ATS: {item.atsCompatibility} | Grammar: {item.grammarScore}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewAnalysis?.(item.id);
                          }}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-2 bg-red--700 text-white600 hover:bg-red rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHistory;
