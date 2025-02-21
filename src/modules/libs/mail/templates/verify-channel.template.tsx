import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import * as React from 'react'

export function VerifyChannelTemplate() {
  return (
    <Html>
      <Head />
      <Preview>Congratulations! Your channel has been verified</Preview>
      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>Congratulations! Your channel has been verified</Heading>
            <Text className='text-black text-base mt-2'>
              We are thrilled to let you know that your channel has been successfully verified.
            </Text>
          </Section>

          <Section className='bg-white rounded-lg shadow-md p-6 text-center mb-6'>
            <Heading className='text-2xl text-black font-semibold'>What it means?</Heading>
            <Text className='text-base text-black mt-2'>
              The verification badge confirms the authenticity of your channel and enhances the trust of viewers.
            </Text>
          </Section>

          <Section className='text-center mt-8'>
            <Text className='text-gray-600'>
              If you have any questions or concerns, please contact our support team at{' '}
              <Link href='mailto:help@nextwitch.ru' className='text-[#18b9ae] underline'>
                help@nextwitch.ru
              </Link>
              .
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
