import { ThemeToggle } from './ThemeToggle';
import { Scroll } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-light-border dark:border-dark-border bg-light-surface/60 dark:bg-dark-surface/60 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-light-accent dark:bg-dark-accent rounded-xl shadow-sm transform transition-transform hover:scale-105">
            <Scroll className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-light-accent to-light-muted dark:from-dark-accent dark:to-dark-muted bg-clip-text text-transparent">
              Buyables
            </h1>
            <span className="text-xs font-medium text-light-muted dark:text-dark-muted uppercase tracking-wider">
              OSRS Price per XP Tracker
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block h-8 w-px bg-light-border dark:bg-dark-border"></div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
