import hmacSHA256 from 'crypto-js/hmac-sha256';
import * as cryptojs from 'crypto-js';
import buffer from 'buffer';
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

export const generateNewMessage = ({
  attachments,
  content,
  user_id,
  user_name,
}: {
  attachments: any;
  content: string;
  user_name: string;
  user_id: string;
}) => {
  return {
    type: 'message/normal',
    uuid: Date.now(),
    content_id: Date.now(),
    session_id: Date.now(),
    entity: {
      attachments,
      quoted: null,
      status: 'sent',
      uuid: Date.now(),
      content: {
        body: content,
      },
      meta: { type: 'normal' },
      has_attachment: !!attachments?.length,
      created_datetime: new Date().toISOString(),
    },
    author: {
      uuid: user_id,
      name: user_name,
      type: 'customer',
    },
    author_type: 'customer',
    author_id: user_id ?? '',
    created_datetime: new Date(),
  };
};

export const generateUUID = () => {
  // Get current time in milliseconds
  let d = new Date().getTime();

  // Define the UUID template with placeholder characters
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  // Replace the placeholders with random hexadecimal digits
  return uuid.replace(/[xy]/g, function (c) {
    // Generate a random number between 0 and 15
    var r = (d + Math.random() * 16) % 16 | 0;

    // Update value of d for the next placeholder
    d = Math.floor(d / 16);

    // Convert the number to a hexadecimal digit and return it
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};
