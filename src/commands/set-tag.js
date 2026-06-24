import { SlashCommandBuilder } from 'discord.js';
import { ok, err, warn } from '../utils/ui.js';
import { setRank } from '../roblox.js';
import { getLogin, getCooldown, setCooldown, isBlacklisted, isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUP = 35914267;
const CD    = 3600;

const TAGS = {
  red:    { roleId: 693471028, label: 'RED' },
  blue:   { roleId: 358924088, label: 'BLUE' },
  pink:   { roleId: 360664063, label: 'PINK' },
  purple: { roleId: 383052037, label: 'PURPLE' },
};

export const data = new SlashCommandBuilder()
  .setName('set-tag')
  .setDescription('set your tag in the roblox group')
  .setDMPermission(true)
  .addStringOption(o =>
    o.setName('tag').setDescription('tag color').setRequired(true)
     .addChoices({ name: 'RED', value: 'red' }, { name: 'BLUE', value: 'blue' }, { name: 'PINK', value: 'pink' }, { name: 'PURPLE', value: 'purple' })
  );

export async function execute(i) {
  await i.deferReply({ ephemeral: true });

  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.editReply(err('No Permission', 'You must be whitelisted to use this bot.'));
  const login = getLogin(i.user.id);
  if (!login) return i.editReply(err('Not Linked', 'Link your Roblox account first with `/login`.'));
  if (isBlacklisted(login.robloxUsername)) return i.editReply(err('Blacklisted', 'Your account is blacklisted.'));

  const last = getCooldown(login.robloxId);
  const secs = CD - (Math.floor(Date.now() / 1000) - last);
  if (secs > 0) {
    const m = Math.floor(secs / 60), s = secs % 60;
    return i.editReply(warn('Cooldown', `You can set your tag again in **${m}m ${s}s**.\n-# Cooldown resets every hour.`));
  }

  const tag = TAGS[i.options.getString('tag')];
  try {
    await setRank(GROUP, login.robloxId, tag.roleId);
    setCooldown(login.robloxId);
    return i.editReply(ok('Tag Set', `Your tag is now set to **${tag.label}**.`));
  } catch (e) {
    return i.editReply(err('Failed', e.message));
  }
}
