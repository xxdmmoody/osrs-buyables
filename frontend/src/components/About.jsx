import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
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
      </div>

      <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-8">
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">
          About Buyables
        </h2>

        <div className="space-y-4 text-light-text dark:text-dark-text">
          <p>
            Buyables is a tool for Old School RuneScape players to compare the cost
            and efficiency of various buyable skills. We pull real-time price data
            from the OSRS Wiki so you always have up-to-date GP/XP values.
          </p>

          <h3 className="text-lg font-semibold mt-6">How It Works</h3>
          <p>
            Item prices are fetched from the OSRS Wiki real-time pricing API and
            cached for 5 minutes. We calculate the material cost, sell price, net
            profit, and GP/XP ratio for each training method so you can make
            informed decisions about how to train your skills.
          </p>

          <h3 className="text-lg font-semibold mt-6">Supported Skills</h3>
          <p>
            We currently support Herblore, Prayer, Cooking, Crafting, Smithing,
            Construction, and Fletching, with more skills planned in the future.
          </p>

          <h3 className="text-lg font-semibold mt-6">Disclaimer</h3>
          <p className="text-light-muted dark:text-dark-muted">
            XP/hr rates are estimates sourced from the OSRS Wiki. Your actual
            in-game rates may vary depending on your setup, attention level, and
            other factors. Prices fluctuate constantly on the Grand Exchange, so
            the values shown here are approximate.
          </p>
        </div>
      </div>
    </div>
  );
}
