import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="code">404</div>
      <h1>NO CARRIER</h1>
      <p>Signal lost. The route you requested does not exist on this channel, and the oscilloscope is reading flat.</p>
      <Link href="/">← reacquire signal / back home</Link>
    </div>
  )
}
