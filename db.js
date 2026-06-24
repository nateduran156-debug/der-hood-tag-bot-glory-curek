import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../data');
mkdirSync(dir, { recursive: true });

const file = join(dir, 'db.json');

const defaults = {
  admins: {},
  logins: {},
  blacklist: {},
  snipelist: [],
  cooldowns: {},
  tag_history: [],
  cookie: null,
};

function load() {
  if (!existsSync(file)) return { ...defaults };
  try { return { ...defaults, ...JSON.parse(readFileSync(file, 'utf8')) }; }
  catch { return { ...defaults }; }
}

function save(d) {
  writeFileSync(file, JSON.stringify(d, null, 2));
}

export function getDb() { return load(); }

export function addAdmin(discordId, addedBy) {
  const d = load();
  d.admins[discordId] = { addedBy, addedAt: ts() };
  save(d);
}

export function removeAdmin(discordId) {
  const d = load();
  const existed = !!d.admins[discordId];
  delete d.admins[discordId];
  save(d);
  return existed;
}

export function isAdmin(discordId) {
  return !!load().admins[discordId];
}

export function addLogin(discordId, robloxUsername, robloxId) {
  const d = load();
  d.logins[discordId] = { robloxUsername, robloxId, linkedAt: ts() };
  save(d);
}

export function removeLogin(discordId) {
  const d = load();
  const row = d.logins[discordId];
  delete d.logins[discordId];
  save(d);
  return row ?? null;
}

export function getLogin(discordId) {
  return load().logins[discordId] ?? null;
}

export function getAllAdmins() {
  const d = load();
  return Object.entries(d.admins).map(([id, v]) => ({ discordId: id, ...v }));
}

export function addBlacklist(username, addedBy) {
  const d = load();
  const key = username.toLowerCase();
  const existed = !!d.blacklist[key];
  d.blacklist[key] = { username, addedBy, addedAt: ts() };
  save(d);
  return !existed;
}

export function removeBlacklist(username) {
  const d = load();
  const key = username.toLowerCase();
  const existed = !!d.blacklist[key];
  delete d.blacklist[key];
  save(d);
  return existed;
}

export function isBlacklisted(username) {
  return !!load().blacklist[username.toLowerCase()];
}

export function getAllBlacklist() {
  return Object.values(load().blacklist);
}

export function addSnipe(robloxUsername, robloxId, discordId) {
  const d = load();
  const exists = d.snipelist.some(r => r.robloxUsername.toLowerCase() === robloxUsername.toLowerCase() && r.discordId === discordId);
  if (exists) return false;
  d.snipelist.push({ robloxUsername, robloxId, discordId, active: true });
  save(d);
  return true;
}

export function removeSnipe(robloxUsername, discordId) {
  const d = load();
  const before = d.snipelist.length;
  d.snipelist = d.snipelist.filter(r => !(r.robloxUsername.toLowerCase() === robloxUsername.toLowerCase() && r.discordId === discordId));
  save(d);
  return d.snipelist.length !== before;
}

export function getSnipelist(discordId) {
  return load().snipelist.filter(r => r.discordId === discordId && r.active);
}

export function getAllSnipes() {
  return load().snipelist.filter(r => r.active);
}

export function getCooldown(discordId) {
  return load().cooldowns[discordId] ?? 0;
}

export function setCooldown(discordId) {
  const d = load();
  d.cooldowns[discordId] = ts();
  save(d);
}

export function resetCooldown(discordId) {
  const d = load();
  delete d.cooldowns[discordId];
  save(d);
}

export function logTag(discordId, robloxUsername, tagName, groupId) {
  const d = load();
  d.tag_history.unshift({ discordId, robloxUsername, tagName, groupId, givenAt: ts() });
  if (d.tag_history.length > 500) d.tag_history.length = 500;
  save(d);
}

export function getTagHistory(limit = 15, username = null) {
  const h = load().tag_history;
  const filtered = username ? h.filter(r => r.robloxUsername.toLowerCase() === username.toLowerCase()) : h;
  return filtered.slice(0, limit);
}

export function getCookie() {
  return load().cookie ?? null;
}

export function setCookie(cookie) {
  const d = load();
  d.cookie = cookie;
  save(d);
}

const ts = () => Math.floor(Date.now() / 1000);
