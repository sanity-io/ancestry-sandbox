function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

/**
 * see https://www.sanity.io/docs/api-versioning for how versioning works
 */
export const apiVersion =
  /**sanity studio api version */
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-10";

/**
 * Used to configure edit intent links, for Presentation Mode, as well as to configure where the Studio is mounted in the router.
 */
export const studioUrl = (() => {
  const url = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";
  // Ensure the URL doesn't end with a slash and is properly formatted
  return url.replace(/\/$/, '').trim();
})();
