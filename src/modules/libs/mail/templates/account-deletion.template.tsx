import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface Props {
  domain: string
}

export const AccountDeletionTemplate = ({ domain }: Props) => {
  const registerLink = `${domain}/account/create`

  return (
    <Html>
      <Head />
      <Preview>Account deletion</Preview>
      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center'>
            <Heading className='text-3xl text-black font-bold'>Your account has been deleted</Heading>
            <Text className='text-base text-black mt-2'>
              You have successfully deleted your account on the <b>NexTwitch</b> platform. All your data has been
              permanently removed from our servers.
            </Text>
          </Section>

          <Section className='bg-white text-black text-center rounded-lg shadow-md p-6 mb-4'>
            <Text>You will no longer receive notifications on Telegram or in the mail.</Text>
            <Text>If you want get to our platform, please click the link below:</Text>
            <Link
              href={registerLink}
              className='inline-flex justify-center items-center rounded-full mt-2 text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'
            >
              Register on NexTwitch
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
        </Body>
      </Tailwind>
    </Html>
  )
}
