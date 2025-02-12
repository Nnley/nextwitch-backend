import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface Props {
  domain: string
  token: string
  metadata: SessionMetadata
}

export const PasswordRecoveryTemplate = ({ domain, token, metadata }: Props) => {
  const resetLink = `${domain}/account/recovery/${token}`

  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>Reset your password</Heading>

            <Text className='text-base text-black'>Click the link below to reset your password:</Text>

            <Link
              href={resetLink}
              className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'
            >
              Reset
            </Link>
          </Section>

          <Section className='bg-gray-100 rounded-lg p-6 mb-6'>
            <Heading className='text-xl font-semibold text-[#18B9AE]'></Heading>
            <ul className='list-disc list-inside mt-2 text-black text-base'>
              <li>
                🌎 Location: {metadata.location.country}, {metadata.location.city}
              </li>
              <li>📱 OS: {metadata.device.os}</li>
              <li>🌐 Browser: {metadata.device.browser}</li>
              <li>💻 IP Address: {metadata.ip}</li>
            </ul>
            <Text className='text-gray-600 mt-2'>
              If you did not request a password reset, please ignore this email.
            </Text>
          </Section>

          <Section className='text-center mt-8'>
            <Text className='text-gray-600'>
              If you have any questions or concerns, please contact our support team at{' '}
              <Link href='mailto:2JjyS@example.com' className='text-[#18B9AE] underline'>
                2JjyS@example.com
              </Link>
              .
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
