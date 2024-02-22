export const formatName = (name: string) => {
  if (name === '') return '';
  const splitName = name
    ?.split(' ')
    ?.map((it) => it?.charAt(0))
    ?.join('')
    ?.toUpperCase()
    ?.substr(0, 2);

  return splitName;
};

export const responseTimeRegister = {
  60: 'in a few minutes',
  3600: 'in an hour',
  86400: 'in a day',
};

export const responseTimeLabelRegister = {
  60: 'in a few minutes',
  3600: 'in an hour',
  86400: 'in a day',
};
