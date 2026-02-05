import { useEffect, useState } from 'react';
import { getSkills } from '../services/api';

const SKILL_DISPLAY_NAMES = {
  herblore: 'Herblore',
  prayer: 'Prayer',
  cooking: 'Cooking',
  crafting: 'Crafting',
  smithing: 'Smithing',
  construction: 'Construction',
  fletching: 'Fletching'
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
    <div className="flex items-center gap-2">
      <label
        htmlFor="skill-select"
        className="text-sm font-medium text-light-text dark:text-dark-text"
      >
        Skill:
      </label>
      <select
        id="skill-select"
        value={selectedSkill}
        onChange={(e) => onSkillChange(e.target.value)}
        disabled={loading}
        className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
