interface LogoProps {
  size?: number
}

export function Logo({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="15.5" rx="5.2" ry="4.3" fill="var(--mantine-color-blue-6)" />
      <circle cx="6.2" cy="9.6" r="2.1" fill="var(--mantine-color-blue-6)" />
      <circle cx="10.6" cy="6.4" r="2.3" fill="var(--mantine-color-blue-6)" />
      <circle cx="15.4" cy="6.4" r="2.3" fill="var(--mantine-color-blue-6)" />
      <circle cx="19.4" cy="9.6" r="2.1" fill="var(--mantine-color-blue-6)" />
    </svg>
  )
}
