import hmacSHA256 from 'crypto-js/hmac-sha256';
import * as cryptojs from 'crypto-js';
import buffer from 'react-native-buffer';
import unescape from 'lodash/unescape';
import differenceInYears from 'date-fns/differenceInYears';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';

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

export const getUserHash = ({
  user_id,
  secret_key,
  public_key,
}: {
  user_id: string;
  secret_key: string;
  public_key: string;
}) => {
  const payload = JSON.stringify({ user_id, public_key });
  const stringifyPayload = buffer.Buffer.from(payload).toString('base64');
  const hash = hmacSHA256(stringifyPayload, secret_key);
  const encoded = cryptojs.enc.Base64.stringify(hash)
    .replace(/\//g, '_')
    .replace(/\+/g, '-')
    .replace(/={1,2}$/, '');

  return `${encoded}.${stringifyPayload}`;
};

export const formatMessageDateTime = (time) => {
  const now = new Date();
  switch (true) {
    case differenceInSeconds(now, time) < 60:
      return 'a few seconds ago';
    case isToday(time):
      return format(time, 'hh:mm a');
    case isYesterday(time):
      return `Yesterday, ${format(time, 'hh:mm a')}`;
    case differenceInDays(now, time) < 7:
      return format(time, 'eee, hh:mm a ');
    case differenceInYears(now, time) === 0:
      return format(time, 'dd MMM hh:mm a');
    default:
      return format(time, 'dd MMM yyyy hh:mm a');
  }
};

export function hexToRgb(hex: string) {
  var result: RegExpExecArray | null =
    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getReference() {
  let text = '';
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=';

  for (let i = 0; i < 15; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function html2Text(html: string) {
  return unescape(
    (html || '').replace(/<\/?[^>]+>/gi, '').replace(/&nbsp;/g, ' ')
  );
}
