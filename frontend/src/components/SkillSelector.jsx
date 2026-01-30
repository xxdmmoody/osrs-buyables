import { useEffect, useState } from 'react';
import { getSkills } from '../services/api';
import { Wand2 } from 'lucide-react';

const SKILL_DISPLAY_NAMES = {
  herblore: 'Herblore',
  prayer: 'Prayer',
  cooking: 'Cooking',
  crafting: 'Crafting',
  smithing: 'Smithing'
};

export function SkillSelector({ selectedSkill, onSkillChange }) {
  const [skills, setSkills] = useState(['herblore']); // Default to herblore
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const data = await getSkills();
        setSkills(data.skills);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
        // Keep default skills
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-light-accent/10 dark:bg-dark-accent/10 rounded-lg">
        <Wand2 className="w-4 h-4 text-light-accent dark:text-dark-accent" />
      </div>
      <label
        htmlFor="skill-select"
        className="text-sm font-display font-bold text-light-text dark:text-dark-text uppercase tracking-wide"
      >
        Skill:
      </label>
      <select
        id="skill-select"
        value={selectedSkill}
        onChange={(e) => onSkillChange(e.target.value)}
        disabled={loading}
        className="px-4 py-2 rounded-lg border-2 border-light-accent dark:border-dark-accent bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text font-display font-semibold focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:ring-offset-2 dark:focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer hover:border-light-accent/80 dark:hover:border-dark-accent/80"
      >
        {skills.map((skill) => (
          <option key={skill} value={skill}>
            {SKILL_DISPLAY_NAMES[skill] || skill}
          </option>
        ))}
      </select>
    </div>
  );
}
