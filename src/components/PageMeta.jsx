import { useEffect } from "react";

const BASE_URL = "https://sathucoin.happycareth.com";

export default function PageMeta({ title, description, path = "" }) {
  const canonicalUrl = `${BASE_URL}/${path}`;

  useEffect(() => {
    document.title = title;

    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setOg = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setOg("og:title", title);
    setOg("og:description", description);
    setOg("og:url", canonicalUrl);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);
  }, [title, description, canonicalUrl]);

  return null;
}
