import { getCookie as getDbCookie } from './db.js';

const GROUPS   = 'https://groups.roblox.com/v1';
const USERS    = 'https://users.roblox.com/v1';

const cookie = () => {
  const db = getDbCookie();
  if (db) return `.ROBLOSECURITY=${db}`;
  return process.env.ROBLOX_COOKIE ? `.ROBLOSECURITY=${process.env.ROBLOX_COOKIE}` : null;
};

export async function getUser(username) {
  const r = await fetch(`${USERS}/usernames/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
  });
  const d = await r.json();
  return d.data?.[0] ?? null;
}

export async function getGroupRoles(groupId) {
  const r = await fetch(`${GROUPS}/groups/${groupId}/roles`);
  const d = await r.json();
  return d.roles ?? [];
}

export async function getUserRole(groupId, userId) {
  const r = await fetch(`${GROUPS}/users/${userId}/groups/roles`);
  const d = await r.json();
  return d.data?.find(g => g.group?.id === groupId)?.role ?? null;
}

export async function setRank(groupId, userId, roleId) {
  const c = cookie();
  if (!c) throw new Error('No Roblox cookie set. Use `/setcookie` to set one.');
  const token = await xcsrf(c);
  const r = await fetch(`${GROUPS}/groups/${groupId}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: c, 'X-CSRF-TOKEN': token },
    body: JSON.stringify({ roleId }),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.errors?.[0]?.message ?? `Roblox error ${r.status}`);
  }
}

export async function getBanned(groupId) {
  const c = cookie();
  if (!c) throw new Error('No Roblox cookie set. Use `/setcookie` to set one.');
  const r = await fetch(`${GROUPS}/groups/${groupId}/bans?limit=100`, { headers: { Cookie: c } });
  const d = await r.json();
  return d.data ?? [];
}

export async function unban(groupId, userId) {
  const c = cookie();
  if (!c) throw new Error('No Roblox cookie set. Use `/setcookie` to set one.');
  const token = await xcsrf(c);
  const r = await fetch(`${GROUPS}/groups/${groupId}/bans/${userId}`, {
    method: 'DELETE',
    headers: { Cookie: c, 'X-CSRF-TOKEN': token },
  });
  return r.ok;
}

async function xcsrf(c) {
  const r = await fetch('https://auth.roblox.com/v2/logout', {
    method: 'POST',
    headers: { Cookie: c },
  });
  return r.headers.get('x-csrf-token') ?? '';
}
