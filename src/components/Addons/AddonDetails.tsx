import "@/styles/addondetails.scss";
import axios from "axios";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DevinsBadges from "../utility/DevinsBadges";

const AddonDetails = () => {
  const { slug } = useParams();
  const [addonBody, setAddonBody] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  type Addon = {
    id: number;
    createdAt: string;
    project_id: string;
    project_type: string;
    slug: string;
    author: string;
    title: string;
    description: string;
    categories: string[];
    display_categories: string[];
    versions: string[];
    downloads: number;
    follows: number;
    icon_url: string;
    date_created: string;
    date_modified: string;
    latest_version: string;
    license: string;
    Client_side: string | null;
    server_side: string;
    gallery: string[];
    featured_gallery: string | null;
    color: string;
    BluePrintChecked: boolean;
    updatedAt: string;
  };

  const sanitizeHtml = (htmlContent: string) => {
    return DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: [
        "a",
        "abbr",
        "acronym",
        "address",
        "article",
        "aside",
        "audio",
        "b",
        "blockquote",
        "body",
        "br",
        "button",
        "canvas",
        "caption",
        "cite",
        "code",
        "col",
        "colgroup",
        "dd",
        "del",
        "details",
        "dfn",
        "div",
        "dl",
        "dt",
        "em",
        "embed",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hgroup",
        "hr",
        "html",
        "i",
        "iframe",
        "img",
        "input",
        "ins",
        "kbd",
        "label",
        "legend",
        "li",
        "link",
        "main",
        "map",
        "mark",
        "menu",
        "menuitem",
        "meta",
        "meter",
        "nav",
        "noscript",
        "object",
        "ol",
        "optgroup",
        "option",
        "output",
        "p",
        "param",
        "picture",
        "pre",
        "progress",
        "q",
        "rb",
        "rp",
        "rt",
        "rtc",
        "ruby",
        "s",
        "samp",
        "script",
        "section",
        "select",
        "slot",
        "small",
        "source",
        "span",
        "strong",
        "style",
        "sub",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "template",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "time",
        "title",
        "tr",
        "track",
        "u",
        "ul",
        "var",
        "video",
        "wbr",
      ],
      ALLOWED_ATTR: [
        "href",
        "src",
        "width",
        "height",
        "alt",
        "title",
        "style",
        "class",
        "id",
        "data-*",
      ]
    });
  };

  const parseHeaders = (htmlContent: string) => {
    return htmlContent.replace(/## (.*?)(\n|$)/g, "<h2>$1</h2>");
  };

  const getAddonDescription = () => {
    axios.get(`https://api.modrinth.com/v2/project/${slug}`)
      .then(response => {
        const addonBody = response.data.body;
        const processedHtml = sanitizeHtml(parseHeaders(addonBody));
        setAddonBody(processedHtml);
      })
      .catch(error => {
        console.error("Error fetching addon description:", error);
      });
  };

  const getAddonDetails = (addons: Addon[], slug: string): Addon | undefined => {
    return addons.find(addon => addon.slug === slug);
  };

  const data = localStorage.getItem("addonList");
  const addons: Addon[] = data ? JSON.parse(data) : [];
  const addon = getAddonDetails(addons, slug);

  const changeImage = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      if (direction === 'next' && addon && currentImageIndex < addon.gallery.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else if (direction === 'prev' && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
      setIsAnimating(false)
    }, 200); // duration of animation
  };

  useEffect(() => {
    getAddonDescription();
  }, [slug]);

  return (
    <div className="container">
      <span className="debug-info">Addon Details for <b>{slug}</b></span>
      {addon && (
        <div>
          <div className="title-bar">
            <img src={addon.icon_url} alt="Addon Icon" className="addon-icon" />
            <h2 className="addon-title">{addon.title}</h2>
            <span className="addon-description">{addon.description}</span>
            <div className="addon-stats">
              <span className="downloads-tag">Downloads: {addon.downloads}</span>
              &nbsp;<span className="likes-tag">Likes: {addon.follows}</span>
            </div>
            <a target="_blank" rel="noopener noreferrer" className=""
              href={`${" https://modrinth.com/mod/" + addon?.slug
                }`}
            >
              <label htmlFor="" className="modrinth-addon-button"><DevinsBadges
                type="compact"
                category="available"
                name="modrinth"
                format="png"
                height={46}
              /></label>
            </a>
          </div>

          <br />

          {/* Gallery Section */}
          <span className="debug-info">Gallery:</span>
          <div className="gallery">
            {addon.gallery.length > 0 ? (
              <div className="gallery-container">
                <button className="back-button" onClick={() => changeImage('prev')} disabled={currentImageIndex === 0}>
                  &#9664; Back
                </button>
                <img
                  src={addon.gallery[currentImageIndex]}
                  alt={`Gallery Image ${currentImageIndex + 1}`}
                  className={`gallery-image ${isAnimating ? 'animating' : ''}`}
                />
                <button className="forward-button" onClick={() => changeImage('next')} disabled={currentImageIndex === addon.gallery.length - 1}>
                  Forward &#9654;
                </button>
              </div>
            ) : (
              <p>No images available :(</p>
              )}
              <span className="debug-info">{`Image ${currentImageIndex + 1} of ${addon.gallery.length}`}</span>
          </div>

          <br />

          <span className="debug-info">Description:</span>
          <div className="addon-body-section">
            <span dangerouslySetInnerHTML={{ __html: addonBody }} />
            <br />
            <span className="body-warning">
              Warning! Some markdown features such as badges may or may not render correctly
            </span>
          </div>
        </div>
      )}
      <br />
    </div>
  );
};

export default AddonDetails;

