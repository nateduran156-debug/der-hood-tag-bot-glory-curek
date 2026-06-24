import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { V2, C, box, t, hr, neutral, err } from '../utils/ui.js';
import { getLogin, isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('link-status')
  .setDescription('check your linked roblox account')
  .setDMPermission(true);

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'You must be whitelisted to use this bot.'));
  const login = getLogin(i.user.id);
  if (!login) return i.reply(neutral('Not Linked', 'You have no linked Roblox account. Use `/login` to link one.', true));

  const date = new Date(login.linkedAt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return i.reply({
    flags: V2 | MessageFlags.Ephemeral,
    components: [box(C.green,
      t('## Linked Account'),
      hr(),
      t(`**Username** — ${login.robloxUsername}\n**Roblox ID** — \`${login.robloxId}\`\n**Linked** — ${date}`),
    )],
  });
}
