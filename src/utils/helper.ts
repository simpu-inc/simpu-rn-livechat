export const formatName = (name: string) => {
  if (name === '') return '';
  const splitName = name
    ?.split(' ')
    ?.map(it => it?.charAt(0))
    ?.join('')
    ?.toUpperCase()
    ?.substr(0, 2);

  return splitName;
};
