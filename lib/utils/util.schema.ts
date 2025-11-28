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
        .min(minValue, { message: `${name} cannot be less than ${minValue.toFixed(decimalDigits)}` })
        .max(maxValue, { message: `${name} cannot exceed ${maxValue.toLocaleString('en-US', { minimumFractionDigits: decimalDigits, maximumFractionDigits: decimalDigits })}` })
        .refine(
            (val) => {
                const [integer, decimal] = val.toString().split('.');
                const intDigits = integer.replace('-', '').length;
                const decDigits = decimal ? decimal.length : 0;
                return intDigits <= integerDigits && decDigits <= decimalDigits;
            },
            { message: `Price must have at most ${integerDigits} integer digits and ${decimalDigits} decimal places` }
        );
};

// Pre-defined schemas for common use cases
export const priceSchema = createPriceSchema('Price', 10, 2);
export const costSchema = createPriceSchema('Cost', 10, 2, -9_999_999_999.99);
export const weightSchema = createPriceSchema('Weight', 6, 2, 0.00)
export const percentageSchema = createPriceSchema('Percentage', 3, 2, 0.01, 100.0);