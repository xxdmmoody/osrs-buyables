import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { SkillSelector } from './SkillSelector';
import { BuyablesTable } from './BuyablesTable';
import Dashboard from './Dashboard';
import { useBuyables } from '../hooks/useBuyables';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

function SkillDetail() {
  const { skill } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useBuyables(skill);

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleSkillChange = (newSkill) => {
    navigate(`/${newSkill}`);
  };

  return (
    <>
      {/* Controls Section */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
          >
            <img
              src="https://oldschool.runescape.wiki/images/Teleport_to_House.png"
              alt="Teleport to House"
              className="w-5 h-5"
              style={{ imageRendering: 'pixelated' }}
            />
            Dashboard
          </button>
          <SkillSelector
            selectedSkill={skill}
            onSkillChange={handleSkillChange}
          />
        </div>

        {data && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-light-muted dark:text-dark-muted">
              Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="p-2 rounded-lg transition-colors hover:bg-light-hover dark:hover:bg-dark-hover disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh data"
              title="Refresh data"
            >
              <RefreshCw
                className={`w-5 h-5 text-light-muted dark:text-dark-muted ${
                  loading ? 'animate-spin' : ''
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-light-muted dark:text-dark-muted">
            Loading buyables data...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                Error Loading Data
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {!error && (data || loading) && (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-light-text dark:text-dark-text capitalize">
              {skill} Buyables
            </h2>
            {data && data.items && (
              <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
                {data.items.length} items • Sorted by best GP/XP value
              </p>
            )}
          </div>

          <div className={`transition-all duration-300 ${loading ? 'opacity-40 blur-sm pointer-events-none' : 'opacity-100 blur-0'}`}>
            {data && data.items && (
              <BuyablesTable data={data.items} skill={data.skill} />
            )}
          </div>

          {/* Info Section */}
          <div className={`mt-6 p-4 bg-[#f5f1e8] dark:bg-blue-900/20 border border-light-border dark:border-blue-800 rounded-lg transition-all duration-300 ${loading ? 'opacity-40 blur-sm' : 'opacity-100 blur-0'}`}>
            <h3 className="text-sm font-semibold text-light-text dark:text-blue-200 mb-2">
              Understanding GP/XP
            </h3>
            <ul className="text-sm text-light-muted dark:text-blue-300 space-y-1">
              {skill === 'prayer' || skill === 'construction' ? (
                <>
                  <li>
                    <strong className="text-red-600 dark:text-red-400">
                      GP/XP
                    </strong>{' '}
                    shows the cost per experience point
                  </li>
                  <li>Higher values = more expensive training (more cost per XP)</li>
                  {skill === 'prayer' && (
                    <li>
                      Chaos altar methods use ~0.5x bones due to 50% save chance
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li>
                    <strong className="text-green-600 dark:text-green-400">
                      Positive GP/XP
                    </strong>{' '}
                    = You make profit while training!
                  </li>
                  <li>
                    <strong className="text-red-600 dark:text-red-400">
                      Negative GP/XP
                    </strong>{' '}
                    = It costs GP to train
                  </li>
                  <li>Higher values = better efficiency (more profit per XP)</li>
                </>
              )}
              <li>
                Prices update every 5 minutes from OSRS Wiki real-time data
              </li>
              <li>
                XP/hr rates are taken from the OSRS Wiki and are estimates, your in-game experience rates might be slightly different
              </li>
            </ul>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && data && data.items && data.items.length === 0 && (
        <div className="text-center py-20">
          <p className="text-light-muted dark:text-dark-muted">
            No buyables data available for this skill.
          </p>
        </div>
      )}
    </>
  );
}

function App() {
  const navigate = useNavigate();

  const handleSkillClick = (skill) => {
    navigate(`/${skill}`);
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard onSkillClick={handleSkillClick} />} />
          <Route path="/:skill" element={<SkillDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
