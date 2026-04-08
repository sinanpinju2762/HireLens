import logoSrc from '../assets/logooooo.png'

export default function Logo({ size = 28 }) {
  return (
    <img
      src={logoSrc}
      alt="HireLens logo"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  )
}
