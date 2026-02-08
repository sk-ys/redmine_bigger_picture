# Redmine Bigger Picture Plugin

A lightweight image gallery plugin for Redmine that integrates the [Bigger Picture](https://github.com/TwistedAndy/bigger-picture) JavaScript library to display images attached to issues.

## Features

- Display images with Bigger Picture on the issue page (jpg, png, gif, bmp, webp, svg)
- Display video attachments with HTML5 controls (mp4, webm, ogg, mov, avi, flv, mkv)
- Display PDF attachments in an inline viewer
- **Zoomable images** - Click to zoom, scroll wheel, pinch to zoom
- **Thumbnail panel** with auto-scroll for easy navigation
- **Responsive** - Adapts to screen size
- **Keyboard navigation** - Arrow keys to navigate, Escape to close
- **Lightweight** - Smaller bundle size compared to other gallery solutions

## Installation

1. Clone the plugin into your Redmine plugins directory:

```bash
cd plugins
git clone https://github.com/sk-ys/redmine_bigger_picture.git
```

2. Restart Redmine

## Usage

Click an image, video, or PDF file on an issue page and Bigger Picture opens automatically.
Links to image, video, and PDF files are also supported.

Use the thumbnail panel at the bottom to navigate between attachments.

## Requirements

- Redmine 6.1 (Other versions are untested.)
- Bigger Picture library (bundled in assets/)

## License

This plugin is licensed under GPLv3. See LICENSE file for details.

Bigger Picture is licensed under the MIT License: https://github.com/TwistedAndy/bigger-picture/blob/main/license

## Support

For issues and feature requests, visit the [GitHub repository](https://github.com/sk-ys/redmine_bigger_picture).
