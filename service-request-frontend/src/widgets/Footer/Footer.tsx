import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      &#169; {new Date().getFullYear()} Комфорт. Все права защищены
    </footer>
  );
}
