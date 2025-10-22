import { Button } from '../ui/Button';

interface HeaderProps {
  categoryLabels: string[];
}

export function Header({ categoryLabels }: HeaderProps) {
  const marqueeItems = [...categoryLabels, ...categoryLabels];

  return (
    <header>
      <nav className="wrap nav">
        <div className="brand keith-logo" aria-label="Outrageous Store logo">
          {Array.from('OUTRAGEOUS').map((char, index) => (
            <span key={`${char}-${index}`}>{char}</span>
          ))}
        </div>
        <div className="links">
          <Button variant="pill">Shop</Button>
          <Button variant="pill">Stories</Button>
          <Button variant="pill">Club</Button>
          <Button variant="pill">Cart (2)</Button>
        </div>
      </nav>
      <div className="ticker" aria-hidden>
        <div className="wrap">
          <div className="row">
            {marqueeItems.map((text, index) => (
              <span key={`ticker-${index}`}>{text}</span>
            ))}
          </div>
        </div>
        <div className="checker" aria-hidden />
      </div>
    </header>
  );
}
