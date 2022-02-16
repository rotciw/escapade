export const generateGameCode = (length: number) => {
  return Array(length)
    .fill('x')
    .join('')
    .replace(/x/g, () => {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    });
};

export const generatePlayerId = () => {
  return '' + Math.random().toString(36).substring(2, 9);
};
