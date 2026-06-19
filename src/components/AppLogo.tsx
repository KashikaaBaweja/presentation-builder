interface AppLogoProps {
  size?: number;
  className?: string;
}

export function AppLogo({ size = 40, className = "" }: AppLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icon.svg"
      alt="Presentation Builder"
      width={size}
      height={size}
      className={`rounded-xl ${className}`}
    />
  );
}
