import { site } from "../../content/site";
import { useScrollSpy } from "../../hooks/use-scroll-spy";
import { useTheme } from "../../hooks/use-theme";
import styles from "./Navigation.module.css";

/**
 * The sticky header and primary navigation (DESIGN.md §5.3).
 *
 * Real anchors — `<a href="#about">` — rather than a JavaScript router, so
 * the links work without JavaScript and the page stays crawlable
 * (PLAN.md §2.3).
 */
export function Navigation() {
  const sectionIds = site.nav.map((link) => link.id);
  const activeId = useScrollSpy(sectionIds);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.name} href="#top">
          {site.name}
        </a>

        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.links}>
            {site.nav.map((link) => {
              const isActive = activeId === link.id;

              return (
                <li key={link.id}>
                  <a
                    className={styles.link}
                    href={`#${link.id}`}
                    aria-current={isActive ? "true" : undefined}
                    data-active={isActive ? "true" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          className={styles.themeToggle}
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}
