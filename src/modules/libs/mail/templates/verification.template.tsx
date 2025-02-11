import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface Props {
  domain: string
  token: string
}

export const VerificationTemplate = ({ domain, token }: Props) => {
  const verificationLink = `${domain}/account/verify?token=${token}`

  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>Verify your email</Heading>

            <Text className='text-base text-black'>
              Thanks for signing up NexTwitch! Click the link below to verify your email address:
            </Text>

            <Link
              href={verificationLink}
              className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'
            >
              Verify
            </Link>
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

          <Section className='text-center mt-8'>
            <Text className='text-sm text-black'>
              If you did not sign up for NexTwitch, you can safely ignore this email.
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
