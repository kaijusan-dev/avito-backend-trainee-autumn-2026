const PERM_TIME_ZONE = 'Asia/Yekaterinburg';
const PERM_UTC_OFFSET = '+05:00';

export const toPermISOString = (date: Date = new Date()): string => {
    const dateTime = new Intl.DateTimeFormat('sv-SE', {
        timeZone: PERM_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    }).format(date);

    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${dateTime.replace(' ', 'T')}.${milliseconds}${PERM_UTC_OFFSET}`;
};