exports.calculateLevel = (xp) => {
  if (xp < 100) return { level: 1, title: 'Novice Coder' };
  if (xp < 300) return { level: 2, title: 'Code Apprentice' };
  if (xp < 650) return { level: 3, title: 'Algorithm Warrior' };
  if (xp < 1150) return { level: 4, title: 'Data Structure Knight' };
  if (xp < 1900) return { level: 5, title: 'Code Sage' };
  return { level: 6, title: 'DSA Legend' };
};
