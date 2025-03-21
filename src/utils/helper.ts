import buffer from 'buffer';
import * as cryptojs from 'crypto-js';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import unescape from 'lodash/unescape';

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



export function hexToRgb(hex: string) {
  var result: RegExpExecArray | null =
    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16),
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
  body,
  user_id,
  user_name,
}: {
  attachments: any;
  body: string;
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
        body: body,
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

//snippet to trim length of string
export const trimText = (text: string | undefined, lenght: number) => {
  if (!text?.length) return '';
  if (text?.length <= lenght) return text;

  return text?.substring(0, lenght) + '..';
};





export const formatMessageTimeLine = <T extends {created_datetime: string}>(
  MessageList: Array<T>,
): (
  | T
  | {
      type: string;
      marginalTime: string;
    }
)[] => {


  if (MessageList?.length === 0) return [];

  const tempMessages: (
    | T
    | {
        type: string;
        marginalTime: string;
      }
  )[] = [];

  for (let i = 0; i < MessageList?.length; i++) {
    const item = MessageList?.[i];

    const itemDate = new Date(item?.created_datetime as unknown as Date);
    const itemDateString = getDayString(itemDate);

    tempMessages.push(item as T);

    if (
      i === MessageList.length - 1 ||
      itemDateString !==
        getDayString(new Date(MessageList[i + 1]?.created_datetime as unknown as Date))
    ) {
      tempMessages.push({
        type: 'time/interval',
        marginalTime: itemDate.toISOString(),
      });
    }
  }

  return tempMessages;
};


const getDayString = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  return formatDate(date);
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
