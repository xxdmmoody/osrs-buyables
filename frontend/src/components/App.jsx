import { useState, useEffect } from 'react';
import { Header } from './Header';
import { SkillSelector } from './SkillSelector';
import { BuyablesTable } from './BuyablesTable';
import { useBuyables } from '../hooks/useBuyables';
import { Loader2, AlertCircle, RefreshCw, Zap, Info } from 'lucide-react';

function App() {
  const [selectedSkill, setSelectedSkill] = useState(() => {
    // Load from localStorage or default to herblore
    return localStorage.getItem('selectedSkill') || 'herblore';
  });

  const { data, loading, error, refetch } = useBuyables(selectedSkill);

  // Save selected skill to localStorage
  useEffect(() => {
    localStorage.setItem('selectedSkill', selectedSkill);
  }, [selectedSkill]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Controls Section */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-6 animate-fade-in">
          <SkillSelector
            selectedSkill={selectedSkill}
            onSkillChange={setSelectedSkill}
          />

          {data && (
            <div className="flex items-center gap-4 px-4 py-3 bg-light-accent/5 dark:bg-dark-accent/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-light-accent dark:text-dark-accent" />
                <div className="text-xs font-mono text-light-muted dark:text-dark-muted uppercase tracking-wider">
                  {new Date(data.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={refetch}
                disabled={loading}
                className="p-2 rounded-lg transition-all hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                aria-label="Refresh data"
                title="Refresh data"
              >
                <RefreshCw
                  className={`w-5 h-5 text-light-accent dark:text-dark-accent ${
                    loading ? 'animate-spin' : ''
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && !data && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="relative w-16 h-16 mb-6">
              <Loader2 className="w-16 h-16 text-light-accent dark:text-dark-accent animate-spin" />
            </div>
            <p className="text-light-muted dark:text-dark-muted font-display font-semibold">
              Loading buyables data...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-300 dark:border-red-700/50 rounded-xl p-8 animate-slide-down">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-display font-bold text-red-900 dark:text-red-200 mb-2">
                  Error Loading Data
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4 text-sm">{error}</p>
                <button
                  onClick={refetch}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-semibold text-sm active:scale-95"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && data && data.items && (
          <>
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-3xl font-display font-bold text-light-text dark:text-dark-text capitalize mb-2">
                {data.skill} Buyables
              </h2>
              <p className="text-sm font-mono text-light-muted dark:text-dark-muted">
                <span className="font-semibold text-light-accent dark:text-dark-accent">{data.items.length}</span> items • Sorted by best GP/XP value
              </p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <BuyablesTable data={data.items} skill={data.skill} />
            </div>

            {/* Info Section */}
            <div className="mt-8 p-6 bg-light-accent/5 dark:bg-dark-accent/10 border border-light-accent/30 dark:border-dark-accent/30 rounded-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-light-accent dark:text-dark-accent flex-shrink-0 mt-0.5" />
                <h3 className="text-sm font-display font-bold text-light-accent dark:text-dark-accent uppercase tracking-wider">
                  Understanding GP/XP
                </h3>
              </div>
              <ul className="text-sm text-light-muted dark:text-dark-muted space-y-2 ml-8">
                {selectedSkill === 'prayer' ? (
                  <>
                    <li>
                      <strong className="text-red-600 dark:text-red-400">
                        GP/XP
                      </strong>{' '}
                      shows the cost per experience point
                    </li>
                    <li>Lower values = more efficient training (less cost per XP)</li>
                    <li>Items are consumed for XP, so there is no profit</li>
                    <li>
                      Chaos altar methods use 0.5x bones due to 50% save chance
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <strong className="text-green-600 dark:text-green-400">
                        Negative GP/XP
                      </strong>{' '}
                      = You make profit while training!
                    </li>
                    <li>
                      <strong className="text-red-600 dark:text-red-400">
                        Positive GP/XP
                      </strong>{' '}
                      = It costs GP to train
                    </li>
                    <li>Lower values = better efficiency (less cost per XP)</li>
                  </>
                )}
                <li className="text-xs pt-1 border-t border-light-accent/20 dark:border-dark-accent/20">
                  💡 Prices update every 5 minutes from OSRS Wiki real-time data
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && data && data.items && data.items.length === 0 && (
          <div className="text-center py-24 animate-fade-in">
            <p className="text-light-muted dark:text-dark-muted text-lg font-display font-semibold">
              No buyables data available for this skill.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
