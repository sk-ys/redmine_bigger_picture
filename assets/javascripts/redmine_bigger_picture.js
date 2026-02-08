// Redmine Bigger Picture Integration
// Automatically enhances images in Redmine issues with Bigger Picture

(function () {
  "use strict";

  const imgExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "flv", "mkv"];
  const mimeTypeMap = {
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    flv: "video/x-flv",
    mkv: "video/x-matroska",
  };

  function parseAttachmentIdFromUrl(url) {
    const match = url.match(/\/attachments\/(?:download\/)?(\d+)(?:\/|$)/);
    return match ? match[1] : null;
  }

  // Create thumbnail panel
  function createThumbnailPanel() {
    const panel = document.createElement("div");
    panel.className = "bp-thumbs";

    const outer = document.createElement("div");
    outer.className = "bp-thumbs-outer";

    const inner = document.createElement("div");
    inner.className = "bp-thumbs-inner";

    outer.appendChild(inner);
    panel.appendChild(outer);

    return { panel, outer, inner };
  }

  // Wait for DOM to be ready
  function initBiggerPicture() {
    if (typeof BiggerPicture === "undefined") {
      console.warn("BiggerPicture library not loaded");
      return;
    }

    // Detect attachment links in the issue details attachment section
    // and filter for image/video/pdf files
    const attachmentLinks = Array.from(
      document.querySelectorAll(
        '.issue.details .attachments a[href*="/attachments/download/"]',
      ),
    ).filter((link) => {
      const hrefLower = link.href.toLowerCase();
      return hrefLower.match(
        new RegExp(
          "\\.(" +
            imgExtensions.join("|") +
            "|" +
            videoExtensions.join("|") +
            "|pdf" +
            ")(\\?|$)",
          "i",
        ),
      );
    });

    if (attachmentLinks.length === 0) {
      return;
    }

    const items = attachmentLinks.map((link) => {
      const href = link.href;
      const attachmentId = parseAttachmentIdFromUrl(href);
      const isVideo = new RegExp(
        "\\.(" + videoExtensions.join("|") + ")(\\?|$)",
        "i",
      ).test(href.toLowerCase());
      const isPdf = /\.pdf(\\?|$)/i.test(href.toLowerCase());
      const caption = link.textContent; // Filename
      const thumbnailImgEl = document.querySelector(
        `img[src*='/attachments/thumbnail/${attachmentId}']`,
      );

      if (isVideo) {
        const videoType = href
          .toLowerCase()
          .match(
            new RegExp("\\.(" + videoExtensions.join("|") + ")(\\?|$)", "i"),
          )[1]
          .toLowerCase();
        const mimeType = mimeTypeMap[videoType] || "video/mp4";
        const videoIconThumbnail = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3Cpolygon fill='%23fff' points='41.25,31.25 41.25,68.75 68.75,50'/%3E%3C/svg%3E`;

        return {
          sources: [{ src: href, type: mimeType }],
          thumb: thumbnailImgEl?.src || videoIconThumbnail,
          caption: caption,
        };
      }

      if (isPdf) {
        const pdfIconThumbnail = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e2e2e2' width='100' height='100'/%3E%3Ctext x='50' y='55' font-size='30' text-anchor='middle' fill='%23333' font-family='Arial, sans-serif'%3EPDF%3C/text%3E%3C/svg%3E`;
        return {
          iframe: href,
          thumb: thumbnailImgEl?.src || pdfIconThumbnail,
          caption: caption,
        };
      }

      return {
        img: href,
        thumb: thumbnailImgEl?.src || href,
        caption: caption,
        alt: caption,
      };
    });

    // Create thumbnail panel HTML
    const { panel: thumbPanel, inner: thumbInner } = createThumbnailPanel();

    // Create thumbnail buttons
    items.forEach((item, index) => {
      const button = document.createElement("button");
      button.className = "bp-thumb-btn";
      button.setAttribute("title", item.caption || `Image ${index + 1}`);
      button.setAttribute("aria-label", item.caption || `Image ${index + 1}`);
      button.dataset.index = index;

      if (item.thumb) {
        const img = document.createElement("img");
        img.src = item.thumb;
        img.alt = item.caption || `Image ${index + 1}`;
        button.appendChild(img);
      }

      thumbInner.appendChild(button);
    });

    let currentBiggerPicture = null;

    const biggerPicture = BiggerPicture({
      target: document.body,
    });

    const attachmentIds = Array.from(attachmentLinks).map((link) =>
      parseAttachmentIdFromUrl(link.href),
    );

    // Add click handlers to thumbnails
    const thumbnailButtons = thumbPanel.querySelectorAll(".bp-thumb-btn");
    thumbnailButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const button = e.target.closest(".bp-thumb-btn");
        const index = parseInt(button.dataset.index);
        if (typeof biggerPicture.setPosition === "function") {
          biggerPicture.setPosition(index);
        }
      });
    });

    const targetElements = Array.from(
      document.querySelectorAll(
        "a[href]" +
          ':not([data-method="delete"])' +
          ':not([href*="/attachments/download/"])' +
          ", img[src]",
      ),
    ).filter((el) => {
      const href = el.href || el.src;
      return attachmentIds.some((id) => href.includes(`/attachments/${id}`));
    });

    targetElements.forEach((el) => {
      el.addEventListener("click", function (event) {
        event.preventDefault();
        const href = el.href || el.src;
        const position = attachmentIds.indexOf(parseAttachmentIdFromUrl(href));

        biggerPicture.open({
          items: items,
          position: position,
          onOpen: (container) => {
            currentBiggerPicture = container;
            container.appendChild(thumbPanel);

            // Set initial active thumbnail
            const allButtons = thumbPanel.querySelectorAll(".bp-thumb-btn");
            allButtons.forEach((btn, idx) => {
              btn.classList.toggle("active", idx === position);
            });
          },
          onUpdate: (container, activeItem) => {
            const allButtons = thumbPanel.querySelectorAll(".bp-thumb-btn");
            allButtons.forEach((btn, idx) => {
              btn.classList.toggle("active", idx === activeItem.i);
            });

            // Scroll the active thumbnail into view
            if (allButtons[activeItem.i]) {
              const activeBtn = allButtons[activeItem.i];
              const outer = thumbPanel.querySelector(".bp-thumbs-outer");
              const { left, right, width } = activeBtn.getBoundingClientRect();
              const { left: outerLeft, right: outerRight } =
                outer.getBoundingClientRect();

              if (right > outerRight) {
                outer.scrollLeft += right - outerRight + 4;
              } else if (left < outerLeft) {
                outer.scrollLeft -= outerLeft - left + 4;
              }
            }
          },
        });
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBiggerPicture);
  } else {
    initBiggerPicture();
  }
})();
