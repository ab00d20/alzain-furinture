import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'

const tajawal = Tajawal({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['arabic'],
  variable: '--font-tajawal',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'مصنع الزين للمفروشات | Al-Zain Furniture',
  description: 'صمم غرفتك بلمسة ذكاء واحدة - ارفع صورة غرفتك وشوف أحدث موديلات مصنع الزين في بيتك فوراً',
  keywords: 'مفروشات, أثاث, الزين, كنب, صوفا, غرف نوم, عمان, الأردن',
  authors: [{ name: 'Al-Zain Furniture' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className={tajawal.className}>
        {children}
      </body>
    </html>
  )
}
