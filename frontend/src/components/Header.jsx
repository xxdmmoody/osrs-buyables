import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl font-bold text-light-text dark:text-dark-text hover:opacity-80 transition-opacity">
            Buyables
          </Link>
          <span className="text-sm text-light-muted dark:text-dark-muted">
            OSRS Price per XP Tracker
          </span>
        </div>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-3 text-sm">
            <Link
              to="/about"
              className="text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
            >
              Contact
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
