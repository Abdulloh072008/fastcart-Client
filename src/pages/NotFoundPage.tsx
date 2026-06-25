import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-[96px] font-black leading-none tracking-tight text-black dark:text-white">
        404 Not Found
      </h1>
      <p className="mt-6 text-base text-gray-500 dark:text-gray-400">
        Your visited page not found. You may go home page.
      </p>
      <Link
        to="/"
        className="mt-10 inline-block rounded bg-red-500 px-10 py-4 text-sm font-medium text-white hover:bg-red-600 transition-colors"
      >
        Back to home page
      </Link>
    </div>
  )
}
