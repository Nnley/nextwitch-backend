import { SessionMetadata } from '@/src/shared/types/session-metadata.types'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface Props {
  token: string
  metadata: SessionMetadata
}

export const DeactivateTemplate = ({ token, metadata }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Account deactivation</Preview>
      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>Account deactivation request</Heading>

            <Text className='text-base text-black'>
              You have initiated the process of deactivating your account on the <b>NexTwitch</b> platform.
            </Text>
          </Section>

          <Section className='bg-gray-100 rounded-lg p-6 text-center mb-6'>
            <Heading className='text-2xl text-black font-semibold'>Confirmation code</Heading>
            <Heading className='text-3xl text-black font-semibold'>{token}</Heading>
            <Text className='text-black'>This code is valid for 5 minutes.</Text>
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
