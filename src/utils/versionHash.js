const VERSION_TO_HASH = {
  v1: 'a3f8c2d1',
  v1_new_month_week: 'b7e4a9f3',
  v1_share: 'c1d6e8b5',
  v1_collection: 'd9f2c4a7',
  mercedes: 'e5b3d1f8',
};

const HASH_TO_VERSION = Object.fromEntries(
  Object.entries(VERSION_TO_HASH).map(([name, hash]) => [hash, name])
);

export function hashVersion(versionName) {
  return VERSION_TO_HASH[versionName] || versionName;
}

export function unhashVersion(hash) {
  return HASH_TO_VERSION[hash] || hash;
}
