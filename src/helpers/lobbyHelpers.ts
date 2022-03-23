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

export const convertDate = (dateString: string | undefined) => {
  var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
  if (!dateString || !dateString.match(pattern)) {
    return null;
  }
  return dateString.replace(pattern, '$3/$2/$1');
};
