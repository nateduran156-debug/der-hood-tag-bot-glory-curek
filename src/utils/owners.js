export const OWNER_IDS = new Set([
  '1511593106305450107',
  '1447017801360474143',
  '808740055434395669',
  '1456824205545967713',
]);

export const isOwner = id => OWNER_IDS.has(id);
