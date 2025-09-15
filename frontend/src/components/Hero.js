import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <h1 className={styles.title}>Anything Electronic</h1>
        <p className={styles.tagline}>
          Electronics repair & manufacturing in Nelson, NZ — serving trade customers
          like franchise dealers, garages, and auto electricians.
        </p>

        <div className={styles.ctas}>
          <Link href="/shop" className="button button--primary">Shop</Link>
          <Link href="/contact" className="button button--outline">Contact</Link>
        </div>
      </div>
    </section>
  );
}
