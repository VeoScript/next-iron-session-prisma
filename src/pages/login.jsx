import Head from 'next/head'
import Link from 'next/link'
import withSession from '~/lib/Session'
import bcrypt from 'bcryptjs'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default function Login({ all_users }) {

  const router = useRouter()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  async function handleLogin(formData) {
    const username = formData.username
    const password = formData.password

    //check the user if exist
    const checkUser = all_users.find(user => user.username === username)

    if (!checkUser) {
      toast.error('This account is not registered! Sign up first...')
      return
    }

    //matching the encrypted password and the set password

    const hashPassword = checkUser.password
    const passwordMatch = await bcrypt.compare(password, hashPassword)

    //check if the password is match
    if (!passwordMatch) {
      toast.error('Your password is incorrect!')
      return
    }

    await fetch('/api/login', {
      method: 'POST',
      headers : { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    })
    
    reset()
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex flex-row items-center justify-center w-full h-screen">
        <Toaster
          position="top-center"
          reverseOrder={true}
        />
        <div className="flex flex-col w-full max-w-sm space-y-3">
          <h1 className="font-bold text-xl">Login Form</h1>
          <form className="flex flex-col w-full space-y-3" onSubmit={handleSubmit(handleLogin)}>
            <div className="flex flex-col w-full space-y-1">
              <input className="px-5 py-3 border border-yellow-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" type="text" name="username" placeholder="Username" {...register("username", { required: true })} disabled={ isSubmitting } />
              {errors.username && <span className="text-xs text-gray-700">Username is required.</span>}
            </div>
            <div className="flex flex-col w-full space-y-1">
              <input className="px-5 py-3 border border-yellow-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" type="password" name="password" placeholder="Password" {...register("password", { required: true })} disabled={ isSubmitting } />
              {errors.password && <span className="text-xs text-gray-700">Password is required.</span>}
            </div>
            <button className="px-5 py-3 border border-yellow-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={ isSubmitting }>Login</button>
            <div className="flex flex-row items-center w-full space-x-2">
              <hr className="border border-gray-300 opacity-30 w-full" />
              <span className="text-gray-600">or</span>
              <hr className="border border-gray-300 opacity-30 w-full" />
            </div>
            <Link href='/signup'>
              <a className="text-center px-5 py-3 border border-yellow-300">Create Account</a>
            </Link>
          </form>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = withSession(async function ({ req }) {
  //check the user session
  const user = req.session.get('user')

  if (user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  //find all users from the database
  const all_users = await prisma.user.findMany()

  return {
    props: {
      all_users
    }
  }
})