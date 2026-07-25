// Input validation for KYC forms. Mirrors backend rules — never trust the UI alone.

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_RE = /^\d{9,18}$/;
const DOB_RE = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export const validatePan = (pan: string): string | null => {
    if (!pan) return 'PAN card number is required';
    return PAN_RE.test(pan.toUpperCase()) ? null : 'Enter a valid PAN (e.g. ABCDE1234F)';
};

// dd/mm/yyyy. Rejects impossible calendar dates (31/02) and future dates.
export const validateDob = (dob: string): string | null => {
    if (!dob) return 'Date of birth is required';
    const match = DOB_RE.exec(dob);
    if (!match) return 'Enter date of birth as dd/mm/yyyy';

    const [, dd, mm, yyyy] = match;
    const day = Number(dd);
    const month = Number(mm);
    const year = Number(yyyy);

    const date = new Date(year, month - 1, day);
    const isRealDate =
        date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    if (!isRealDate) return 'Enter a valid date of birth';
    if (date > new Date()) return 'Date of birth cannot be in the future';

    return null;
};

export const validateAccountNumber = (value: string): string | null => {
    if (!value) return 'Account number is required';
    return ACCOUNT_RE.test(value) ? null : 'Enter a valid account number (9-18 digits)';
};

export const validateIfsc = (value: string): string | null => {
    if (!value) return 'IFSC code is required';
    return IFSC_RE.test(value.toUpperCase()) ? null : 'Enter a valid IFSC code (e.g. SBIN0001234)';
};

// dd/mm/yyyy -> yyyy-mm-dd, the format the API expects.
export const dobToIso = (dob: string): string => {
    const match = DOB_RE.exec(dob);
    if (!match) return dob;
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
};

// Digits-only mask that inserts the dd/mm/yyyy slashes as the user types.
export const maskDob = (raw: string): string => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};
