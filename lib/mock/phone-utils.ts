const COUNTRY_PHONE: Record<string, { code: string; digits: number }> = {
  US: { code: '+1', digits: 10 },
  CA: { code: '+1', digits: 10 },
  GB: { code: '+44', digits: 10 },
  AU: { code: '+61', digits: 9 },
  DE: { code: '+49', digits: 11 },
  FR: { code: '+33', digits: 9 },
  IT: { code: '+39', digits: 10 },
  ES: { code: '+34', digits: 9 },
  NL: { code: '+31', digits: 9 },
  BE: { code: '+32', digits: 9 },
  CH: { code: '+41', digits: 9 },
  AT: { code: '+43', digits: 10 },
  SE: { code: '+46', digits: 9 },
  NO: { code: '+47', digits: 8 },
  DK: { code: '+45', digits: 8 },
  FI: { code: '+358', digits: 9 },
  IE: { code: '+353', digits: 9 },
  PT: { code: '+351', digits: 9 },
  PL: { code: '+48', digits: 9 },
  CZ: { code: '+420', digits: 9 },
  HU: { code: '+36', digits: 9 },
  GR: { code: '+30', digits: 10 },
  RO: { code: '+40', digits: 10 },
  RU: { code: '+7', digits: 10 },
  JP: { code: '+81', digits: 10 },
  KR: { code: '+82', digits: 10 },
  CN: { code: '+86', digits: 11 },
  TW: { code: '+886', digits: 9 },
  HK: { code: '+852', digits: 8 },
  SG: { code: '+65', digits: 8 },
  IN: { code: '+91', digits: 10 },
  AE: { code: '+971', digits: 9 },
  SA: { code: '+966', digits: 9 },
  IL: { code: '+972', digits: 9 },
  TR: { code: '+90', digits: 10 },
  TH: { code: '+66', digits: 9 },
  VN: { code: '+84', digits: 9 },
  MY: { code: '+60', digits: 9 },
  PH: { code: '+63', digits: 10 },
  ID: { code: '+62', digits: 10 },
  BR: { code: '+55', digits: 11 },
  MX: { code: '+52', digits: 10 },
  AR: { code: '+54', digits: 10 },
  CL: { code: '+56', digits: 9 },
  CO: { code: '+57', digits: 10 },
  PE: { code: '+51', digits: 9 },
  ZA: { code: '+27', digits: 9 },
  NG: { code: '+234', digits: 10 },
  EG: { code: '+20', digits: 10 },
  MA: { code: '+212', digits: 9 },
  KE: { code: '+254', digits: 9 },
  NZ: { code: '+64', digits: 9 },
  PK: { code: '+92', digits: 10 },
  BD: { code: '+880', digits: 10 },
}

export function getPhoneCode(countryCode: string): string {
  return COUNTRY_PHONE[countryCode]?.code ?? ''
}

export function getExpectedDigits(countryCode: string): number {
  return COUNTRY_PHONE[countryCode]?.digits ?? 10
}

export function validatePhone(phone: string, countryCode: string): string {
  if (!phone.trim()) return ''
  const digits = phone.replace(/\D/g, '')
  const expected = getExpectedDigits(countryCode)
  if (digits.length < 7) return 'Phone must contain at least 7 digits'
  if (digits.length > 15) return 'Phone number is too long'
  if (digits.length !== expected) return `Phone must contain ${expected} digits for selected country`
  if (!/^[\d\s\-+()]+$/.test(phone)) return 'Phone contains invalid characters'
  return ''
}
