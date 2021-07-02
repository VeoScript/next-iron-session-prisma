import Head from 'next/head'
import withSession from '~/lib/Session'
import { useRouter } from 'next/router'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default function Home({ account }) {

  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/logout', {
      method: 'POST',
      headers : { 
        'Content-Type': 'application/json',
      }
    })
    router.push('/login')
  }

  return (
    <>
      <Head>
        <title>Home | { account.name }</title>
      </Head>
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center w-full max-w-sm space-y-3">
          <h1>Using Next JS Iron Session</h1>
          <h1>Welcome <span className="font-bold">{ account.name }</span></h1>
          <button className="w-full px-5 py-3 border border-yellow-300 focus:outline-none" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  //check the user session
  const user = req.session.get('user')

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  //get the user from the database
  const account = await prisma.user.findFirst({
    where: {
      username: req.session.get('user').username
    }
  })

  return {
    props: {
      account
    }
  }
})