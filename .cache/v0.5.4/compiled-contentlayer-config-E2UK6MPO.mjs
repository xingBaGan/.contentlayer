// contentlayer.config.js
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import readingTime from "reading-time";
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings
} from "pliny/mdx-plugins/index.js";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeCitation from "rehype-citation";
import rehypePrismPlus from "rehype-prism-plus";
import rehypePresetMinify from "rehype-preset-minify";
import mermaid from "remark-mermaidjs";
import emoji from "remark-emoji";

// scripts/siteMetadata.js
var siteMetadata = {
  title: "\u7801\u519C\u6458\u8BB0",
  author: "jacob jiang",
  headerTitle: "\u7801\u519C\u6458\u8BB0",
  description: "\u793E\u755C\u7801\u519C\u65E5\u5E38\u7684\u7B14\u8BB0",
  language: "en-us",
  theme: "system",
  // system, dark or light
  siteUrl: "https://tailwind-nextjs-starter-blog.vercel.app",
  siteRepo: "https://github.com/timlrx/tailwind-nextjs-starter-blog",
  siteLogo: "/static/images/logo.png",
  socialBanner: "/static/images/twitter-card.png",
  mastodon: "https://mastodon.social/@mastodonuser",
  email: "address@yoursite.com",
  github: "https://github.com",
  twitter: "https://twitter.com/Twitter",
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
  linkedin: "https://www.linkedin.com",
  locale: "en-US",
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      umamiWebsiteId: process.env.NEXT_UMAMI_ID
      // e.g. 123e4567-e89b-12d3-a456-426614174000
    }
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus
    // Please add your .env file and modify it according to your selection
    provider: "buttondown"
  },
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: "giscus",
    // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: "pathname",
      // supported options: pathname, url, title
      reactions: "1",
      // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: "0",
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: "light_high_contrast",
      // theme when dark mode
      darkTheme: "transparent_dark",
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: "",
      // This corresponds to the `data-lang="en"` in giscus's configurations
      lang: "en",
      loading: "lazy"
    }
  },
  search: {
    provider: "kbar",
    // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: "search.json"
      // path to load documents to search
    }
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  }
};

// scripts/paths.js
import { join } from "path";
import os from "os";

// package.json
var package_default = {
  name: "article-management-tool",
  private: true,
  version: "0.0.1",
  description: "\u4E00\u4E2A\u5C06\u672C\u5730markdown\u6587\u4EF6\u53D1\u5E03\u5230\u5404\u4E2A\u5E73\u53F0\u7684\u5DE5\u5177",
  author: "jacob jiang",
  main: "out/electron/main/index.js",
  scripts: {
    clean: "rimraf out/ dist/",
    dev: "npm run build && electron-vite dev --watch",
    build: "npm run build:main && npm run build:preload && npm run build:renderer",
    "build:main": "tsc -p electron/tsconfig.json && tsc-alias -p electron/tsconfig.json",
    "build:preload": "tsc -p electron/tsconfig.json && tsc-alias -p electron/tsconfig.json",
    "build:renderer": "vite build",
    "build:win": "pnpm run build && pnpm electron-vite build && pnpm exec electron-builder --win",
    "build:mac": "pnpm run build && pnpm electron-vite build && pnpm exec electron-builder --mac",
    "build:linux": "pnpm run build && pnpm electron-vite build && pnpm exec electron-builder --linux",
    lint: "eslint .",
    preview: "electron-vite preview",
    start: "electron-vite preview",
    "build:contentlayer": "contentlayer2 build",
    "install:playwright": "npx playwright install --with-deps chromium"
  },
  dependencies: {
    "@mdx-js/esbuild": "^3.1.0",
    astring: "^1.9.0",
    clsx: "^2.1.0",
    contentlayer2: "latest",
    dequal: "^2.0.3",
    devlop: "^1.1.0",
    "estree-util-build-jsx": "^3.0.1",
    "estree-util-is-identifier-name": "^3.0.0",
    "estree-util-to-js": "^2.0.0",
    "estree-walker": "^3.0.3",
    "hast-util-to-estree": "^3.1.2",
    i18next: "^24.2.2",
    "lucide-react": "^0.344.0",
    "next-contentlayer": "^0.3.4",
    playwright: "^1.50.1",
    pliny: "0.1.4",
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    "react-dropzone": "^14.2.3",
    "react-i18next": "^15.4.1",
    "reading-time": "^1.5.0",
    "rehype-autolink-headings": "^7.1.0",
    "rehype-citation": "^2.0.0",
    "rehype-katex": "^7.0.0",
    "rehype-preset-minify": "^7.0.0",
    "rehype-prism-plus": "^2.0.0",
    "rehype-slug": "^6.0.0",
    "remark-emoji": "^4.0.1",
    "remark-gfm": "^4.0.0",
    "remark-math": "^6.0.0",
    "remark-mermaidjs": "^6.0.0",
    "source-map": "^0.7.4"
  },
  devDependencies: {
    "@electron-forge/maker-dmg": "^7.2.0",
    "@electron-forge/plugin-fuses": "^7.2.0",
    "@electron-forge/plugin-vite": "^7.2.0",
    "@electron-toolkit/tsconfig": "^1.0.1",
    "@eslint/js": "^9.9.1",
    "@mdx-js/mdx": "^3.1.0",
    "@mdx-js/react": "^3.1.0",
    "@types/estree": "^1.0.6",
    "@types/estree-jsx": "^1.0.0",
    "@types/mdx": "^2.0.5",
    "@types/node": "^22.10.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    autoprefixer: "^10.4.18",
    electron: "^28.0.0",
    "electron-builder": "^24.13.3",
    "electron-vite": "^2.0.0",
    eslint: "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    globals: "^15.9.0",
    postcss: "^8.4.35",
    rimraf: "^5.0.10",
    tailwindcss: "^3.4.1",
    "tsc-alias": "^1.8.10",
    typescript: "^5.5.3",
    "typescript-eslint": "^8.3.0",
    vite: "^5.0.0"
  },
  pnpm: {
    peerDependencyRules: {
      ignoreMissing: [
        "react",
        "react-dom"
      ]
    },
    onlyBuiltDependencies: [
      "electron",
      "electron-winstaller",
      "esbuild"
    ]
  },
  resolutions: {
    "@types/estree": "^1.0.0",
    "@types/estree-jsx": "^1.0.0",
    "@mdx-js/mdx": "^2.0.0"
  }
};

// scripts/paths.js
function getUserDataPath() {
  const homedir = os.homedir();
  switch (process.platform) {
    case "win32":
      return join(homedir, "AppData", "Roaming", package_default.name);
    case "darwin":
      return join(homedir, "Library", "Application Support", package_default.name);
    case "linux":
      return join(homedir, ".config", package_default.name);
    default:
      return join(homedir, "." + package_default.name);
  }
}
var paths = {
  userData: getUserDataPath(),
  content: join(getUserDataPath(), "content")
};

// contentlayer.config.js
var contentDirPath = paths.content;
var computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, "")
  },
  path: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath
  },
  filePath: {
    type: "string",
    resolve: (doc) => doc._raw.sourceFilePath
  },
  toc: { type: "string", resolve: (doc) => extractTocHeadings(doc.body.raw) }
};
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: "string" },
    date: { type: "date" },
    tags: { type: "list", of: { type: "string" }, default: [] },
    lastmod: { type: "date" },
    draft: { type: "boolean" },
    summary: { type: "string" },
    images: { type: "json" },
    authors: { type: "list", of: { type: "string" } },
    layout: { type: "string" },
    bibliography: { type: "string" },
    canonicalUrl: { type: "string" }
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: "json",
      resolve: (doc) => ({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`
      })
    }
  }
}));
var Article = defineDocumentType(() => ({
  name: "Article",
  filePathPattern: "**/*.[mdx,md]",
  contentType: "mdx",
  fields: {
    title: { type: "string" },
    date: { type: "date" },
    tags: { type: "list", of: { type: "string" }, default: [] },
    lastmod: { type: "date" },
    draft: { type: "boolean" },
    summary: { type: "string" },
    images: { type: "json" },
    authors: { type: "list", of: { type: "string" } },
    layout: { type: "string" },
    bibliography: { type: "string" },
    canonicalUrl: { type: "string" }
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: "json",
      resolve: (doc) => ({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`
      })
    }
  }
}));
var Authors = defineDocumentType(() => ({
  name: "Authors",
  filePathPattern: "authors/**/*.mdx",
  contentType: "mdx",
  fields: {
    name: { type: "string", required: true },
    avatar: { type: "string" },
    occupation: { type: "string" },
    company: { type: "string" },
    email: { type: "string" },
    twitter: { type: "string" },
    linkedin: { type: "string" },
    github: { type: "string" },
    layout: { type: "string" }
  },
  computedFields
}));
var contentlayer_config_default = makeSource({
  contentDirPath,
  documentTypes: [Post, Article, Authors],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
      emoji,
      mermaid
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeKatex,
      [rehypeCitation, { path: contentDirPath }],
      [rehypePrismPlus, { defaultLanguage: "js", ignoreMissing: true }],
      rehypePresetMinify
    ]
  },
  onSuccess: async (result) => {
    console.log("Content layer build successful!");
  }
});
export {
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-E2UK6MPO.mjs.map
