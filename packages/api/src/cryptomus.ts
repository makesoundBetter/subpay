import crypto from 'crypto'

const API_KEY = process.env.NOWPAYMENTS_API_KEY!
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET!

export const CRYPTO_CURRENCIES: Record<string, { label: string; code: string }> = {
  TON:        { label: 'TON',        code: 'ton' },
  USDT_TRC20: { label: 'USDT TRC20', code: 'usdttrc20' },
  USDT_ERC20: { label: 'USDT ERC20', code: 'usdterc20' },
  ETH:        { label: 'ETH',        code: 'eth' },
  USDC:       { label: 'USDC',       code: 'usdcerc20' },
  SOL:        { label: 'SOL',        code: 'sol' },
}

export function verifyWebhook(rawBody: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha512', IPN_SECRET)
  hmac.update(rawBody)
  return hmac.digest('hex') === signature
}

export async function createPayment(params: {
  orderId: number
  amountUsd: number
  payCurrency: string
  webhookUrl: string
  description: string
}): Promise<{ paymentId: string; address: string; amount: string; currency: string }> {
  const body = {
    price_amount: params.amountUsd,
    price_currency: 'usd',
    pay_currency: params.payCurrency,
    ipn_callback_url: params.webhookUrl,
    order_id: String(params.orderId),
    order_description: params.description,
  }

  const response = await fetch('https://api.nowpayments.io/v1/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json() as any

  if (!response.ok) {
    throw new Error(data.message || 'NOWPayments error')
  }

  return {
    paymentId: String(data.payment_id),
    address: data.pay_address,
    amount: String(data.pay_amount),
    currency: data.pay_currency,
  }
}
