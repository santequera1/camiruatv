import { useEffect } from "react";

const SELECTOR = ".aparece, .aparece-titulo, .aparece-foto, .escalona";
/** Arrancan con clip-path al 100 %: Chrome los da por "no visibles" para
 *  siempre, así que se vigila su contenedor en lugar de ellos. */
const RECORTADOS = ".aparece-titulo, .aparece-foto";

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
    // Lo que se vigila -> los elementos que se revelan cuando eso entra.
    const destinos = new Map<Element, Set<Element>>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          destinos.get(e.target)?.forEach((el) => el.classList.add("visible"));
          destinos.delete(e.target);
          observer.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    const observar = () =>
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.classList.contains("visible")) return;
        const vigilado = el.matches(RECORTADOS) && el.parentElement ? el.parentElement : el;
        let set = destinos.get(vigilado);
        if (!set) {
          set = new Set();
          destinos.set(vigilado, set);
          observer.observe(vigilado);
        }
        set.add(el);
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
