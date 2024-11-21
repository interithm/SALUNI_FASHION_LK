import colorNameList from '../src/data/colornames.json';

export function getColorName(hex) {
  const match = colorNameList.find(color => color.hex.toLowerCase() === hex.toLowerCase());
  return match ? match.name : "Unknown color";
}

// console.log("this is color function", getColorName("#ffffff")); // Output: Some color name (depends on the library)