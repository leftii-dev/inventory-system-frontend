export function parseSetCookieExpiry(setCookieHeader?: string | null): Date | null {
    if (!setCookieHeader) return null;

    const parts = setCookieHeader.split(';').map(p => p.trim());

    const expiresPart = parts.find(p => p.toLowerCase().startsWith('expires='));
    if (expiresPart) {
        const dateStr = expiresPart.split('=')[1];
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) return date;
    }

    const maxAgePart = parts.find(p => p.toLowerCase().startsWith('max-age='));
    if (maxAgePart) {
        const seconds = parseInt(maxAgePart.split('=')[1], 10);
        if (!isNaN(seconds)) {
            return new Date(Date.now() + seconds * 1000);
        }
    }

    return null;
}