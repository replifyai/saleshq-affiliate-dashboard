// Self-check for the KYC validators. Run: node src/components/kyc/validators.check.ts
import assert from 'node:assert/strict';
import {
    validatePan,
    validateDob,
    validateAccountNumber,
    validateIfsc,
    dobToIso,
    maskDob,
} from './validators.ts';

// PAN: 5 letters, 4 digits, 1 letter.
assert.equal(validatePan('ABCDE1234F'), null);
assert.equal(validatePan('abcde1234f'), null, 'lowercase is upcased before matching');
assert.ok(validatePan(''), 'empty rejected');
assert.ok(validatePan('A1B2C3D4E5'), 'Figma placeholder value is not a real PAN');
assert.ok(validatePan('ABCDE1234'), 'too short rejected');
assert.ok(validatePan('ABCDE12345'), 'trailing digit rejected');

// DOB: dd/mm/yyyy, real calendar dates, not in the future.
assert.equal(validateDob('01/01/1999'), null);
assert.equal(validateDob('29/02/2000'), null, 'leap year accepted');
assert.ok(validateDob('31/02/1999'), 'impossible date rejected');
assert.ok(validateDob('29/02/1999'), 'non-leap 29 Feb rejected');
assert.ok(validateDob('1999-01-01'), 'wrong format rejected');
assert.ok(validateDob('01/01/2999'), 'future date rejected');

// Bank account.
assert.equal(validateAccountNumber('123456789'), null);
assert.ok(validateAccountNumber('12345678'), 'under 9 digits rejected');
assert.ok(validateAccountNumber('12345678a'), 'non-digits rejected');

// IFSC: 4 letters, a 0, then 6 alphanumerics.
assert.equal(validateIfsc('SBIN0001234'), null);
assert.equal(validateIfsc('sbin0001234'), null, 'lowercase is upcased before matching');
assert.ok(validateIfsc('SBIN1001234'), '5th char must be 0');
assert.ok(validateIfsc('SBI0001234'), 'too short rejected');

// Format helpers.
assert.equal(dobToIso('01/01/1999'), '1999-01-01');
assert.equal(maskDob('01011999'), '01/01/1999');
assert.equal(maskDob('0101'), '01/01');
assert.equal(maskDob('1'), '1');
assert.equal(maskDob('010119991234'), '01/01/1999', 'overflow digits dropped');

console.log('kyc validators: all checks passed');
