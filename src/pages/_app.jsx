import '~/styles/tailwind.css'
import NProgress from '~/lib/NextProgressBar'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NProgress />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
