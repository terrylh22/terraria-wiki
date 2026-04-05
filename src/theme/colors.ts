export const colors = {
  bg: {
    primary: '#111118',
    secondary: '#1a1a24',
    surface: '#22222e',
  },
  brand: {
    accent: '#a78bfa',
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
    primary: '#dddde4',
    secondary: '#9595a8',
    muted: '#5e5e78',
  },
  border: '#2e2e3e',
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
