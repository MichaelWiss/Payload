/* eslint-disable @next/next/no-img-element */
import { Button } from '../ui/Button';

const stickerImages = [
  'https://images.unsplash.com/photo-1520975922203-b6b8406f9a72?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524594081293-190a2fe0baae?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541976076755-3192f9a8a3c2?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541976076753-7f2d4b0c7a5e?q=80&w=600&auto=format&fit=crop',
];

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="collage">
          {stickerImages.map((src, index) => (
            <div key={index} className={`sticker s${index + 1}`}>
              <img src={src} alt="Sticker collage" />
            </div>
          ))}
        </div>
        <div>
          <span className="kicker">Indie bottles · zines · snacks</span>
          <h1>
            <span className="h1-highlight">Let the Season Unfold</span> — loud, niche, and tasty.
          </h1>
          <p>
            Hand-picked curios with a side of attitude. Scroll for hot drops and pizza-paper
            opinions. No beige minimalism here.
          </p>
          <div className="cta">
            <Button variant="alt">Shop New Arrivals</Button>
            <Button>Join The Club</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
