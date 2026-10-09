import { ShieldCheck } from 'lucide-react'

export default function Logo() {
  return (
    <span className="logo">
      <span className="logo-mark">
        <ShieldCheck size={20} aria-hidden="true" />
      </span>
      <span className="logo-text">
        Medi<span>Vault</span>
      </span>
    </span>
  )
}