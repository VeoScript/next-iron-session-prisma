import Head from 'next/head'
import withSession from '~/lib/Session'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default function SignUp({ all_users }) {

  const router = useRouter()
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  async function handleSignUp(formData) {
    //check if the user is already exist
    const userExist = all_users.some(user => user.username === formData.username)

    if (userExist) {
      toast.error('This account is already exist!')
      return
    }

    //create or register new user
    await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    reset()
    router.push('/login')
  }

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className="flex flex-row items-center justify-center w-full h-screen">
        <Toaster
          position="top-center"
          reverseOrder={true}
        />
        <div className="flex flex-col w-full max-w-sm space-y-3">
          <h1 className="font-bold text-xl">Sign Up</h1>
          <form className="flex flex-col w-full space-y-3" onSubmit={handleSubmit(handleSignUp)}>
            <div className="flex flex-col w-full space-y-1">
              <input className="px-5 py-3 border border-yellow-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" type="text" name="avatar" placeholder="Avatar URL" {...register("avatar", { required: true })} disabled={ isSubmitting } />
              {errors.avatar && <span className="text-xs text-gray-700">Avatar URL is required</span>}
            </div>
            <div className="flex flex-col w-full space-y-1">
              <input className="px-5 py-3 border border-yellow-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" type="text" name="name" placeholder="Full Name" {...register("name", { required: true })} disabled={ isSubmitting } />
              {errors.name && <span className="text-xs text-gray-700">Full Name is required</span>}
            </div>
            <div className="flex flex-col w-full space-y-1">
              <input className="px-5 py-3 border border-yellow-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" type="text" name="username" placeholder="Username" {...register("username", { required: true })} disabled={ isSubmitting } />
              {errors.username && <span className="text-xs text-gray-700">Username is required</span>}
            </div>
            <div className="flex flex-col w-full space-y-1">
              <input className="px-5 py-3 border border-yellow-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" type="password" name="password" placeholder="Password" {...register("password", { required: true })} disabled={ isSubmitting } />
              {errors.password && <span className="text-xs text-gray-700">Password is required</span>}
            </div>
            <button className="px-5 py-3 border border-yellow-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={ isSubmitting }>Sign Up</button>
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