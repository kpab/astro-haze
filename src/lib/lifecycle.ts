// Component scripts and client-side routing
//
// With `<ClientRouter />` in BaseLayout, a navigation swaps the document body
// but does *not* re-evaluate a module script that already ran. That splits any
// component script into two kinds of work:
//
//   - Wiring to elements inside the swapped body — listeners on a button, a
//     dialog, an observer over headings. Those elements are replaced on every
//     navigation, so this must run again each time. Pass it to `onPage()`.
//
//   - Wiring to things that outlive the swap — `document`, `window`, a
//     `matchMedia` query. Those listeners survive, so registering them again
//     would fire the handler twice per event. Leave that at the top level of
//     the script, where it runs once per full page load.
//
// Because the elements are new each time, re-adding element listeners in
// `onPage()` cannot double-register: the old element (and its listeners) is
// already gone.

/**
 * Run `setup` on the first page load and after every client-side navigation.
 *
 * `astro:page-load` fires in both cases — including for a script that was
 * pulled in by the navigation itself — so `setup` must not also be called
 * directly, or it runs twice on the initial load.
 */
export function onPage(setup: () => void): void {
  document.addEventListener('astro:page-load', setup);
}

/**
 * Run `teardown` just before the body is swapped out.
 *
 * Anything that reaches outside the swapped subtree has to be undone here:
 * a scroll lock lives on `<html>`, which survives the swap, so a menu left
 * open during a navigation would freeze scrolling on the next page.
 */
export function onLeave(teardown: () => void): void {
  document.addEventListener('astro:before-swap', teardown);
}
