import { REST, Routes } from 'discord.js';

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('ERROR: DISCORD_BOT_TOKEN is not set');
  process.exit(1);
}
if (!process.env.DISCORD_CLIENT_ID) {
  console.error('ERROR: DISCORD_CLIENT_ID is not set');
  process.exit(1);
}

import { data as dLogin }          from './commands/login.js';
import { data as dLinkStatus }     from './commands/link-status.js';
import { data as dSetTag }         from './commands/set-tag.js';
import { data as dCooldown }       from './commands/cooldown-check.js';
import { data as dRolecheck }      from './commands/rolecheck.js';
import { data as dRoles }          from './commands/roles.js';
import { data as dUnrole }         from './commands/unrole.js';
import { data as dUnbanAll }       from './commands/unban-all.js';
import { data as dTagWipe }        from './commands/tag-wipe.js';
import { data as dWhitelistAdmin } from './commands/whitelist-admin.js';
import { data as dWhitelistRow }   from './commands/whitelist-row.js';
import { data as dBlacklist }      from './commands/blacklist.js';
import { data as dBlacklistList }  from './commands/blacklist-list.js';
import { data as dTagHistory }     from './commands/tag-history.js';
import { data as dView }           from './commands/view.js';
import { data as dResetCd }        from './commands/reset-cd.js';
import { data as dResetLogin }     from './commands/reset-login.js';
import { data as dHelp }           from './commands/help.js';
import { data as dSetCookie }      from './commands/setcookie.js';
import { data as dAccept }         from './commands/accept.js';
import { data as dAcceptAll }      from './commands/accept-all.js';
import { tagCommands }             from './commands/tag-commands.js';
import { gloryCommands }           from './commands/glory-commands.js';

const raw = [
  dLogin, dLinkStatus, dSetTag, dCooldown, dRolecheck, dRoles,
  dUnrole, dUnbanAll, dTagWipe, dWhitelistAdmin, dWhitelistRow,
  dBlacklist, dBlacklistList, dTagHistory, dView, dResetCd, dResetLogin,
  dHelp, dSetCookie, dAccept, dAcceptAll,
  ...tagCommands.map(c => c.data),
  ...gloryCommands.map(c => c.data),
];

const commands = raw.map(c => ({
  ...c.toJSON(),
  integration_types: [0, 1],
  contexts: [0, 1, 2],
}));

console.log(`Registering ${commands.length} commands...`);
commands.forEach(c => console.log(` - /${c.name}`));

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

try {
  const data = await rest.put(
    Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
    { body: commands }
  );
  console.log(`\nDone — ${data.length} commands registered globally.`);
} catch (err) {
  console.error('\nFailed to register commands:');
  console.error(err.message ?? err);
  if (err.rawError) console.error(JSON.stringify(err.rawError, null, 2));
  process.exit(1);
}
