// src/utils/share.js
import LZString from "lz-string";

/**
 * Payload shape:
 * { profile: { firstName, lastName, email, profileImage? }, links: [...] }
 */

export function encodePayloadToUrl({ profile = {}, links = [] } = {}) {
  try {
    const json = JSON.stringify({ profile, links });
    return LZString.compressToEncodedURIComponent(json);
  } catch (e) {
    console.error("encodePayloadToUrl error", e);
    return "";
  }
}

export function decodePayloadFromUrl(encoded) {
  if (!encoded) return { profile: null, links: [] };
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return { profile: null, links: [] };
    const parsed = JSON.parse(json);
    return {
      profile: parsed.profile || null,
      links: Array.isArray(parsed.links) ? parsed.links : [],
    };
  } catch (e) {
    console.error("decodePayloadFromUrl error", e);
    return { profile: null, links: [] };
  }
}
