import { SlashCommandBuilder } from 'discord.js';
import { ok, err } from '../utils/ui.js';
import { getUser, getGroupRoles, setRank, getUserRole } from '../roblox.js';
import { isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUP_MAP = {
  faze:  { id: 396910998, label: 'FaZe Tag Group' },
  glory: { id: 35914267,  label: 'Glory Tag Group' },
  '1400': { id: 206868002, label: '1400 Gradient Group' },
  all:   null,
};

export const data = new SlashCommandBuilder()
  .setName('tag-wipe')
  .setDescription("wipe a roblox user's role from a group")
  .setDMPermission(true)
  .addStringOption(o => o
    .setName('username')
    .setDescription('roblox username')
    .setRequired(true))
  .addStringOption(o => o
    .setName('group')
    .setDescription('which group to wipe from')
    .setRequired(true)
    .addChoices(
      { name: 'FaZe Tag Group',      value: 'faze' },
      { name: 'Glory Tag Group',     value: 'glory' },
      { name: '1400 Gradient Group', value: '1400' },
      { name: 'All Groups',          value: 'all' },
    ));

async function wipeGroup(gid, userId) {
  const roles = await getGroupRoles(gid).catch(() => []);
  const base = roles.find(r => r.isBase) ?? roles.filter(r => r.rank > 0).sort((a, b) => a.rank - b.rank)[0];
  if (!base) return `no base role found`;
  const cur = await getUserRole(gid, userId).catch(() => null);
  if (!cur || cur.rank <= 1) return `already at base`;
  try {
    await setRank(gid, userId, base.id);
    return `reset to **${base.name}**`;
  } catch (e) {
    return `failed — ${e.message}`;
  }
}

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  await i.deferReply();

  const username = i.options.getString('username');
  const group    = i.options.getString('group');
  const user     = await getUser(username).catch(() => null);
  if (!user) return i.editReply(err('Not Found', `No account found for **${username}**.`));

  const targets = group === 'all'
    ? Object.entries(GROUP_MAP).filter(([k]) => k !== 'all')
    : [[group, GROUP_MAP[group]]];

  const lines = [];
  for (const [, { id, label }] of targets) {
    const res = await wipeGroup(id, user.id);
    lines.push(`**${label}**: ${res}`);
  }

  return i.editReply(ok('Tag Wipe', `**${user.name}**\n${lines.join('\n')}`));
}
