import { useEffect } from "react";

const SELECTOR = ".aparece, .aparece-titulo, .aparece-foto, .escalona";

/**
 * Activa la clase `.visible` en los elementos con animación de entrada
 * (`.aparece`, `.aparece-titulo`, `.aparece-foto`, `.escalona`) cuando entran
 * en pantalla. Sin JS (o sin IntersectionObserver) todo se ve desde el inicio.
 */
export function Aparecer() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.documentElement.classList.add("sin-observer");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    const observar = () =>
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains("visible")) observer.observe(el);
      });
    observar();
    // Al navegar entre rutas aparecen elementos nuevos.
    const mo = new MutationObserver(observar);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
