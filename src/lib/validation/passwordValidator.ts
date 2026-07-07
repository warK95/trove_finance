/**
 * Checks if the password string inputed is compliant with NIST (National Institute of Standards and Technology) password policy.
 * @param password The password string to be validated.
 * @returns A boolean indicating if the password is valid or not.
 */
// NIST password policy regex pattern
const NIST_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function isValidPassword(password: string): boolean {
  return NIST_PASSWORD_PATTERN.test(password);
}
