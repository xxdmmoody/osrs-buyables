/**
 * Generates OSRS Wiki image URL for an item
 * @param {string} itemName - The item name
 * @param {string} skill - The skill name (for special image handling)
 * @param {number} size - Image size (default: 36px for icons)
 * @returns {string} Image URL
 */
export function getItemImageUrl(itemName, skill = null, size = 36) {
  if (!itemName) return '';

  // Strip training method suffixes for Prayer and Smithing items
  // "Dragon bones (Gilded altar)" -> "Dragon bones"
  // "Gold bar (Goldsmith gauntlets)" -> "Gold bar"
  let cleanedName = itemName
    .replace(/ \(Gilded altar\)$/i, '')
    .replace(/ \(Chaos altar\)$/i, '')
    .replace(/ \(Goldsmith gauntlets\)$/i, '');

  // Format item name for OSRS Wiki URL
  // Replace spaces with underscores, encode special characters
  const formattedName = cleanedName
    .replace(/ /g, '_')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');

  // Construction items use _built.png suffix
  const suffix = skill === 'construction' ? '_built.png' : '.png';

  // Use OSRS Wiki's image API
  // Format: https://oldschool.runescape.wiki/images/Item_name.png
  // Construction: https://oldschool.runescape.wiki/images/Item_name_built.png
  return `https://oldschool.runescape.wiki/images/${formattedName}${suffix}`;
}

/**
 * Formats item name to match OSRS Wiki image naming convention
 * Some items have specific image names that differ from in-game names
 * @param {string} itemName - The item name
 * @returns {string} Formatted name for image lookup
 */
export function formatItemNameForImage(itemName) {
  // Handle special cases if needed
  const specialCases = {
    // Add any special case mappings here
    // 'In-game Name': 'Wiki_Image_Name'
  };

  return specialCases[itemName] || itemName;
}
