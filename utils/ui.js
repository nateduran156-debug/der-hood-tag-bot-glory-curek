import { MessageFlags } from 'discord.js';

const V2 = MessageFlags.IsComponentsV2;

const C = {
  green:  0x2ecc71,
  red:    0xe74c3c,
  blue:   0x5865f2,
  yellow: 0xf0b132,
  grey:   0x2b2d31,
  purple: 0x9b59b6,
};

const box   = (color, ...kids) => ({ type: 17, accent_color: color, components: kids });
const t     = content          => ({ type: 10, content });
const hr    = (sp = 1)         => ({ type: 14, spacing: sp, divider: true });

function reply(color, title, body, ephemeral = false) {
  const flags = ephemeral ? V2 | MessageFlags.Ephemeral : V2;
  return { flags, components: [box(color, t(`## ${title}`), hr(), t(body))] };
}

export const ok      = (title, body, eph)  => reply(C.green,  title, body, eph);
export const err     = (title, body)        => reply(C.red,    title, body, true);
export const info    = (title, body, eph)  => reply(C.blue,   title, body, eph);
export const warn    = (title, body)        => reply(C.yellow, title, body, true);
export const neutral = (title, body, eph)  => reply(C.grey,   title, body, eph);

export { V2, C, box, t, hr };
