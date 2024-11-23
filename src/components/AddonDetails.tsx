import { useParams } from "react-router-dom";
import "../styles/addondetails.scss";
import DOMPurify from "dompurify";
import { marked } from "marked";
import axios from "axios";
import { useEffect, useState } from "react";
import DevinsBadges from "./DevinsBadges";

const AddonDetails = () => {
  const { slug } = useParams();
  const [addonBody, setAddonBody] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);  // State for current image index

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
      ALLOWED_TAGS: ['iframe', 'h2', 'p', 'a', 'img', 'br', 'div', 'span', 'h1', 'ul', 'li', 'h4'],
      ALLOWED_ATTR: ['src', 'width', 'height', 'allowfullscreen', 'frameborder', 'class', 'alt', 'href'],
      ADD_ATTR: ['allowfullscreen'],
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

  const nextImage = () => {
    if (addon && currentImageIndex < addon.gallery.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  useEffect(() => {
    getAddonDescription();
  }, [slug]);

  return (
    <div>
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
            <a target="_blank" rel="noopener noreferrer" className="addon-button"
              href={`${" https://modrinth.com/mod/" + addon?.slug
                }`}
            >
              <DevinsBadges
                type="compact"
                category="available"
                name="modrinth"
                format="png"
                height={46}
              />
            </a>
          </div>

          <br />

          {/* Gallery Section */}
          <span className="debug-info">Gallery:</span>
          <div className="gallery">
            {addon.gallery.length > 0 ? (
              <div className="gallery-container">
                <button className="back-button" onClick={prevImage} disabled={currentImageIndex === 0}>
                  &#9664; Back
                </button>
                <img src={addon.gallery[currentImageIndex]} alt={`Gallery Image ${currentImageIndex + 1}`} />
                <button className="forward-button" onClick={nextImage} disabled={currentImageIndex === addon.gallery.length - 1}>
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
