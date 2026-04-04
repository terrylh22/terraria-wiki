export const colors = {
  bg: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    surface: '#0f3460',
  },
  brand: {
    gold: '#e8b84b',
    silver: '#c0c0c0',
  },
  rarity: {
    [-1]: '#828282',
    [0]: '#828282',
    [1]: '#ffffff',
    [2]: '#9696ff',
    [3]: '#96ff96',
    [4]: '#ffa500',
    [5]: '#ff9696',
    [6]: '#ff96ff',
    [7]: '#d2ff00',
    [8]: '#ffff00',
    [9]: '#05c3dd',
    [10]: '#ff2020',
    [11]: '#b220ff',
  } as Record<number, string>,
  text: {
    primary: '#e8e8e8',
    secondary: '#a0a0b0',
    muted: '#666680',
  },
  border: '#2a2a4a',
} as const;

export const rarityNames: Record<number, string> = {
  [-1]: 'Gray',
  [0]: 'Gray',
  [1]: 'White',
  [2]: 'Blue',
  [3]: 'Green',
  [4]: 'Orange',
  [5]: 'Light Red',
  [6]: 'Pink',
  [7]: 'Light Purple',
  [8]: 'Yellow',
  [9]: 'Cyan',
  [10]: 'Red',
  [11]: 'Purple',
};
