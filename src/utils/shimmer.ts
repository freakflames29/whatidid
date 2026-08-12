import readline from "node:readline";
const MESSAGES = [
  "Tashreef rakhiye, kaam jaari hai...",
  "Thoda sabr, nateeja behtar hoga...",
  "Ek haseen code taraasha jaa raha hai...",
  "Aaram se, jaldbaazi mein kya rakkha hai...",
  "Janab, thoda waqt toh lagega...",
  "Shuruat achhi hai, thoda intezar...",
  "Symmetry dhoond raha hoon...",
  "Patience is a virtue, and so is optimized code...",
  "Arre sahib, bas thoda sa aur...",
  "Weaving logic out of chaos...",
  "A quiet moment for the processor...",
  "Crafting your output with care...",
  "Let the algorithm do its magic...",
  "Assembling the puzzle pieces...",
  "Refining the rough edges...",
  "And... we are almost there..."
];

export interface ShimmerOptions {
  text?: string;
  interval?: number;
  speed?: number;
}

let activeInterval: ReturnType<typeof setInterval> | null = null;

function colorForPosition(
  position: number,
  frame: number,
  speed: number,
): [number, number, number] {
  const wave = Math.sin(-frame * speed + position * 0.25) * 0.5 + 0.5;

  const r = Math.floor(wave * 144);
  const g = Math.floor(100 + wave * 138);
  const b = Math.floor(wave * 144);

  return [r, g, b];
}

class ShimmerSpinner {
  private frame = 0;
  private speed: number;

  constructor(speed = 0.1) {
    this.speed = speed;
  }

  render(text: string): string {
    let output = "";
    for (let i = 0; i < text.length; i++) {
      const [r, g, b] = colorForPosition(i, this.frame, this.speed);
      output += `\x1b[38;2;${r};${g};${b}m${text[i]}\x1b[0m`;
    }
    this.frame++;
    return output;
  }
}

export function startShimmer(options?: ShimmerOptions): void {
  stopShimmer();

  const messages = options?.text ? [options.text] : MESSAGES;
  const intervalMs = options?.interval ?? 25;
  const speed = options?.speed ?? 0.12;
  const spinner = new ShimmerSpinner(speed);
  let text = messages[Math.floor(Math.random() * messages.length)];
  let ticks = 0;

  process.stdout.write("\x1b[?25l");

  activeInterval = setInterval(() => {
    ticks++;

    if (ticks % 80 === 0 && messages.length > 1) {
      let nextText = messages[Math.floor(Math.random() * messages.length)];
      while (nextText === text) {
        nextText = messages[Math.floor(Math.random() * messages.length)];
      }
      text = nextText;
    }

    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 0);
    process.stdout.write(spinner.render(text));
  }, intervalMs);
}

export function stopShimmer(): void {
  if (activeInterval) {
    clearInterval(activeInterval);
    activeInterval = null;
    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 0);
    process.stdout.write("\x1b[?25h");
  }
}
