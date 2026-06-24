import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { V2, C, box, t, hr, err } from '../utils/ui.js';
import { getCooldown, getLogin, isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

const CD = 3600;

export const data = new SlashCommandBuilder()
  .setName('cooldown-check')
  .setDescription('check your set-tag cooldown')
  .setDMPermission(true);

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'You must be whitelisted to use this bot.'));
  const login = getLogin(i.user.id);
  const key = login ? login.robloxId : i.user.id;
  const last = getCooldown(key);
  const secs = CD - (Math.floor(Date.now() / 1000) - last);

  if (!last || secs <= 0) {
    return i.reply({ flags: V2 | MessageFlags.Ephemeral, components: [box(C.green, t('## Cooldown'), hr(), t('No cooldown — you can use `/set-tag` right now.'))] });
  }

  const m = Math.floor(secs / 60), s = secs % 60;
  const readyAt = Math.floor(Date.now() / 1000) + secs;
  return i.reply({
    flags: V2 | MessageFlags.Ephemeral,
    components: [box(C.yellow, t('## Cooldown Active'), hr(), t(`**Time left** — ${m}m ${s}s\n**Ready** — <t:${readyAt}:t> (<t:${readyAt}:R>)\n-# /set-tag cooldown is 1 hour.`))],
  });
}
