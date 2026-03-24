import crypto from 'crypto'

const API_TOKEN = process.env.CRYPTOBOT_API_TOKEN!
const BASE_URL = 'https://pay.crypt.bot/api'

export function verifyWebhook(rawBody: string, signature: string): boolean {
  const secret = crypto.createHash('sha256').update(API_TOKEN).digest()
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody)
  return hmac.digest('hex') === signature
}

export async function createInvoice(params: {
  orderId: number
  amountUsd: number
  description: string
}): Promise<{ invoiceId: number; payUrl: string }> {
  const response = await fetch(`${BASE_URL}/createInvoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Crypto-Pay-API-Token': API_TOKEN,
    },
    body: JSON.stringify({
      currency_type: 'fiat',
      fiat: 'USD',
      amount: String(params.amountUsd),
      accepted_assets: 'USDT,TON,BTC,ETH,LTC',
      payload: String(params.orderId),
      description: params.description,
      expires_in: 3600,
    }),
  })

  const data = await response.json() as any

  if (!data.ok) {
    throw new Error(data.error?.name || 'CryptoBot error')
  }

  return {
    invoiceId: data.result.invoice_id,
    payUrl: data.result.pay_url,
  }
}

export async function setWebhook(url: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/setWebhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Crypto-Pay-API-Token': API_TOKEN,
    },
    body: JSON.stringify({ url }),
  })
  const data = await response.json() as any
  if (!data.ok) throw new Error(data.error?.name || 'Failed to set webhook')
}
