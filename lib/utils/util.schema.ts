import { z } from "zod";

// Factory function to create price schemas with custom digit limits
export const createPriceSchema = (
    name: string,
    integerDigits: number,
    decimalDigits: number,
    minValue: number = 0.01,
    maxValue: number = Number(`${'9'.repeat(integerDigits)}.${'9'.repeat(decimalDigits)}`)
) => {

    return z
        .number()
        .min(minValue, { error: `${name} cannot be less than ${minValue.toFixed(decimalDigits)}` })
        .max(maxValue, { error: `${name} cannot exceed ${maxValue.toLocaleString('en-US', { minimumFractionDigits: decimalDigits, maximumFractionDigits: decimalDigits })}` })
        .refine(
            (val) => {
                const [integer, decimal] = val.toString().split('.');
                const intDigits = integer.replace('-', '').length;
                const decDigits = decimal ? decimal.length : 0;
                return intDigits <= integerDigits && decDigits <= decimalDigits;
            },
            { error: `Price must have at most ${integerDigits} integer digits and ${decimalDigits} decimal places` }
        );
};

// Pre-defined schemas for common use cases
export const priceSchema = createPriceSchema('Price', 10, 2);
export const costSchema = createPriceSchema('Cost', 10, 2, -9_999_999_999.99);
export const weightSchema = createPriceSchema('Weight', 6, 2, 0.00)
export const percentageSchema = createPriceSchema('Percentage', 3, 2, 0.01, 100.0);

const LOCAL_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function toLocalDateString(dt: Date): string {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function isRealLocalDateString(s: string): boolean {
    if (!LOCAL_DATE_REGEX.test(s)) return false;
    const [y, m, d] = s.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return (
        dt.getFullYear() === y &&
        dt.getMonth() === m - 1 &&
        dt.getDate() === d
    );
}

function isPresentOrFutureLocalDateString(s: string): boolean {
    const [y, m, d] = s.split("-").map(Number);

    const now = new Date();
    const ty = now.getFullYear();
    const tm = now.getMonth() + 1;
    const td = now.getDate();

    if (y !== ty) return y > ty;
    if (m !== tm) return m > tm;
    return d >= td;
}

/**
 * Accepts Date or "YYYY-MM-DD", outputs "YYYY-MM-DD",
 * validates as a real date AND present-or-future (local time).
 */
export const presentOrFutureDateSchema = z
    .union([z.string(), z.date()])
    .transform((v) => (v instanceof Date ? toLocalDateString(v) : v))
    .pipe(
        z
            .string()
            .regex(LOCAL_DATE_REGEX, {error: "Date must be in YYYY-MM-DD format"})
            .refine(isRealLocalDateString, { error: "Invalid calendar date"})
            .refine(
                isPresentOrFutureLocalDateString,
                { error: "Date must be today or in the future"}
            )
    );

/**
 * Accepts Date or "YYYY-MM-DD", outputs "YYYY-MM-DD",
 * validates format + real calendar date (suitable for Spring LocalDate).
 */
export const localDateSchema = z
    .union([z.string(), z.date()])
    .transform((v) => (v instanceof Date ? toLocalDateString(v) : v))
    .pipe(
        z
            .string()
            .regex(LOCAL_DATE_REGEX, "Date must be in YYYY-MM-DD format")
            .refine(isRealLocalDateString, "Invalid calendar date")
    );

/**
 * Java LocalTime as "HH:mm" (00:00..23:59)
 */
export const localTimeSchema = z
    .string({ error: "Time must be a string" })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm (00:00-23:59) format");