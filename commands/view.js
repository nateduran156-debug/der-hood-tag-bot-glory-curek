import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { V2, C, box, t, hr, err, info } from '../utils/ui.js';
import { isAdmin, getLogin } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('view')
  .setDescription("view a user's linked roblox account")
  .setDMPermission(true)
  .addUserOption(o => o.setName('user').setDescription('discord user').setRequired(true));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  const target = i.options.getUser('user');
  const login = getLogin(target.id);
  if (!login) return i.reply(info('No Account', `**${target.username}** has not linked a Roblox account.`));

  const date = new Date(login.linkedAt * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return i.reply({
    flags: V2 | MessageFlags.Ephemeral,
    components: [box(C.blue, t(`## ${target.username}'s Account`), hr(), t(`**Username** — ${login.robloxUsername}\n**ID** — \`${login.robloxId}\`\n**Linked** — ${date}`))],
  });
}
