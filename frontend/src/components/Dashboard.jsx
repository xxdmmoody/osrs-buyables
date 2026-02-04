import { useState, useEffect } from 'react';
import { getDashboard } from '../services/api';
import { formatGP, formatXP } from '../utils/formatters';
import { getItemImageUrl } from '../utils/osrsImages';

/**
 * Dashboard component showing top 4 items from each skill
 */
export default function Dashboard({ onSkillClick }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDashboard();
      setData(result);
    } catch (err) {
      console.error('[Dashboard] Error fetching data:', err);
      setError(err.response?.data?.error?.message || err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-light-muted dark:text-dark-muted">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data || !data.skills) {
    return (
      <div className="text-center p-8 text-light-muted dark:text-dark-muted">
        No data available
      </div>
    );
  }

  const skillOrder = ['herblore', 'prayer', 'cooking', 'crafting', 'smithing', 'construction'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
          OSRS Buyables Dashboard
        </h2>
        <p className="text-light-muted dark:text-dark-muted">
          Top 4 most profitable training methods for each skill
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillOrder.map((skill) => {
          const items = data.skills[skill] || [];
          if (items.length === 0) return null;

          return (
            <div
              key={skill}
              className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-text capitalize">
                  {skill}
                </h3>
                <button
                  onClick={() => onSkillClick(skill)}
                  className="text-sm text-light-primary dark:text-dark-accent hover:underline"
                >
                  View all →
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => {
                  const isPrayer = skill === 'prayer';
                  const isProfit = !isPrayer && item.pricePerXp > 0;
                  const gpXpColor = isProfit
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400';

                  return (
                    <div
                      key={item.itemId}
                      className="flex items-center justify-between py-2 border-b border-light-border dark:border-dark-border last:border-b-0"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img
                          src={getItemImageUrl(item.name)}
                          alt={item.name}
                          className="w-8 h-8 object-contain flex-shrink-0"
                          style={{ imageRendering: 'pixelated' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm text-light-text dark:text-dark-text truncate">
                            {item.name}
                          </span>
                          {item.xpPerHour && (
                            <span className="text-xs text-light-muted dark:text-dark-muted">
                              {formatXP(item.xpPerHour)}/hr
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${gpXpColor} whitespace-nowrap ml-2`}>
                        {formatGP(item.pricePerXp)} GP/XP
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {data.lastUpdated && (
        <div className="text-center text-sm text-light-muted dark:text-dark-muted">
          Last updated: {new Date(data.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
}
