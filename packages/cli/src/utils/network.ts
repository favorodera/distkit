import { ofetch } from 'ofetch'

/**
 * Text fetch client for source files.
 * Suitable for fetching plain text content such as scripts or stylesheets.
 */
export const textFetch = ofetch.create({
  headers: {
    accept: 'text/plain, application/javascript, */*',
  },
  responseType: 'text',
})

/**
 * JSON fetch client for registry and metadata.
 * Optimized for structured data like registry indexes and manifests.
 */
export const jsonFetch = ofetch.create({
  headers: {
    accept: 'application/json',
  },
  responseType: 'json',
})
