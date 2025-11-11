export function getParam(
    params: Record<string, string | string[] | undefined>,
    key: string
): string | undefined {
    const value = params[key];
    if (Array.isArray(value)) return value[0];
    return value ?? undefined;
}

export function toQueryString(
    params?: Record<string, string | string[] | undefined>
): string {
    if (!params) return "";

    const entries = Object.entries(params)
        .flatMap(([k, v]) => {
            if (v === undefined) return [];
            if (Array.isArray(v)) return v.filter(Boolean).map(val => [k, val]);
            return [[k, v]];
        }) as [string, string][];

    const qs = new URLSearchParams(entries).toString();
    return qs ? `?${qs}` : "";
}