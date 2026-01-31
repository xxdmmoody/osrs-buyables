import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getLatestPrices } from './osrsWikiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const AVAILABLE_SKILLS = ['herblore', 'prayer', 'cooking', 'crafting', 'smithing'];

/**
 * Loads skill data from JSON file
 * @param {string} skill - Skill name (e.g., 'herblore')
 * @returns {Promise<Object>} Skill data object
 */
async function loadSkillData(skill) {
  const skillPath = join(__dirname, '../data/skills', `${skill}.json`);

  try {
    const data = await readFile(skillPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Skill data not found for: ${skill}`);
    }
    throw error;
  }
}

/**
 * Calculates buyables data for a given skill
 * @param {string} skill - Skill name
 * @returns {Promise<Object>} Calculated buyables data
 */
export async function getBuyablesForSkill(skill) {
  const normalizedSkill = skill.toLowerCase();

  // Validate skill
  if (!AVAILABLE_SKILLS.includes(normalizedSkill)) {
    throw new Error(`Invalid skill: ${skill}. Available: ${AVAILABLE_SKILLS.join(', ')}`);
  }

  // Load skill data
  const skillData = await loadSkillData(normalizedSkill);

  // Fetch current prices from OSRS Wiki
  const prices = await getLatestPrices();

  // Calculate metrics for each item
  const calculatedItems = skillData.items.map(item => {
    const calculation = calculateItemMetrics(item, prices, normalizedSkill);
    return {
      ...item,
      ...calculation,
      lastUpdated: new Date().toISOString()
    };
  });

  // Sort by price per XP (descending - highest profit first)
  calculatedItems.sort((a, b) => b.pricePerXp - a.pricePerXp);

  return {
    skill: normalizedSkill,
    items: calculatedItems,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Calculates price per XP and related metrics for an item
 * @param {Object} item - Item data with materials
 * @param {Object} prices - Price data from OSRS Wiki
 * @param {string} skill - Skill name (for special calculations)
 * @returns {Object} Calculated metrics
 */
function calculateItemMetrics(item, prices, skill) {
  const itemIdStr = item.itemId.toString();
  const isPrayerSkill = skill === 'prayer';

  // Get sell price (use 'high' for instant sell)
  // For Prayer, items are consumed so sell price is 0
  const priceData = prices[itemIdStr];
  const sellPrice = isPrayerSkill ? 0 : (priceData?.high || 0);

  // Calculate material cost (use 'low' for instant buy)
  let materialCost = 0;
  const materialsWithCosts = item.materials.map(material => {
    const matIdStr = material.itemId.toString();
    const matPrice = prices[matIdStr]?.low || 0;
    const totalCost = matPrice * material.quantity;
    materialCost += totalCost;

    return {
      ...material,
      unitCost: matPrice,
      totalCost: totalCost
    };
  });

  // Calculate net profit (positive = profit, negative = loss)
  const netProfit = sellPrice - materialCost;

  // Calculate price per XP
  // For Prayer: negative value (cost) = -materialCost / xpGained
  // For other skills: positive = you profit while training (netProfit / xpGained)
  let pricePerXp = 0;
  if (item.xpGained > 0) {
    pricePerXp = isPrayerSkill
      ? -materialCost / item.xpGained  // Prayer: negative cost per XP
      : netProfit / item.xpGained;     // Other skills: positive = profit
  }

  // Determine if this is profitable
  const isProfit = netProfit > 0;

  return {
    sellPrice,
    materialCost,
    netProfit,
    pricePerXp,
    isProfit,
    materials: materialsWithCosts
  };
}

/**
 * Gets list of available skills
 * @returns {Array<string>} List of skill names
 */
export function getAvailableSkills() {
  return AVAILABLE_SKILLS;
}
