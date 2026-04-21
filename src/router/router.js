import Listings from "../views/listings.js";
import Header from "../components/header.js";

const routes = {
  "/": Listings,
};

export default function router() {
  const app = document.getElementById("app");
  const headerContainer = document.getElementById("header");

  const base = "/SP_2";

  // Clear
  app.innerHTML = "";
  headerContainer.innerHTML = "";

  //  Render header
  headerContainer.appendChild(Header());

  //  Handle path
  let path = window.location.pathname;

  if (path.startsWith(base)) {
    path = path.slice(base.length) || "/";
  }

  const view = routes[path] || Listings;
  const page = view();

  // HANDLE ASYNC + SYNC
  if (page instanceof Promise) {
    page.then((resolvedView) => {
      app.innerHTML = "";
      app.appendChild(resolvedView);
    });
  } else {
    app.innerHTML = "";
    app.appendChild(page);
  }
}