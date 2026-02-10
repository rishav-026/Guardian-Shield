export const validateAmount = (amount) => {
  if (!amount) return 'Enter an amount'
  if (amount < 1) return 'Amount must be at least ₹1'
  if (amount > 1000000) return 'Amount exceeds limit (₹10,00,000)'
  return ''
}

export const validateMerchant = (merchant) => {
  if (!merchant) return 'Enter a merchant or recipient name'
  if (merchant.length < 2) return 'Name too short'
  return ''
}
