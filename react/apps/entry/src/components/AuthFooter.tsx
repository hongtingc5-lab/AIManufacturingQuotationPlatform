import { Link } from 'react-router-dom'
import type { AuthPageConfig } from '../data/authPages'

export function AuthFooter({ links }: { links: AuthPageConfig['footerLinks'] }) {
  return (
    <footer className="auth-footer">
      {links.map((link, index) => (
        <span key={link.label}>
          {index > 0 && <span> · </span>}
          {link.external ? (
            <a href={link.href}>{link.label}</a>
          ) : (
            <Link to={link.href}>{link.label}</Link>
          )}
        </span>
      ))}
    </footer>
  )
}
