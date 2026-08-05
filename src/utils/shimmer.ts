import readline from "node:readline";
const MESSAGES = [
  "Thoda wait...",
  "Bas 2 minute...",
  "Bhai dekh raha hai...",
  "Nazar lag gayi...",
  "Kaam ho raha hai...",
  "Launda busy hai...",
  "Jugadu mode...",
  "Babumoshai...",
  "Arre baba...",
  "Kya hi bolun...",
  "Kalesh...",
  "Khatarnak...",
  "Aiyoo...",
  "Sakht launda...",
  "Majama...",
  "Chalta hai...",
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

  const r = Math.floor(220 + wave * 35);
  const g = Math.floor(100 + wave * 155);
  const b = Math.floor(0 + wave * 60);

  const shimmer = Math.sin(-frame * speed * 1.8 + position * 0.35) * 0.4 + 0.4;

  return [Math.min(255, r + Math.floor(shimmer * 20)), Math.min(255, g + Math.floor(shimmer * 20)), Math.min(255, b + Math.floor(shimmer * 10))];
}

class ShimmerSpinner {
  private frame = 0;
  private text: string;
  private speed: number;

  constructor(text: string, speed = 0.1) {
    this.text = text;
    this.speed = speed;
  }

  render(): string {
    let output = "";
    for (let i = 0; i < this.text.length; i++) {
      const [r, g, b] = colorForPosition(i, this.frame, this.speed);
      output += `\x1b[38;2;${r};${g};${b}m${this.text[i]}\x1b[0m`;
    }
    this.frame++;
    return output;
  }
}

export function startShimmer(options?: ShimmerOptions): void {
  stopShimmer();

  const text = options?.text ?? MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  const intervalMs = options?.interval ?? 25;
  const speed = options?.speed ?? 0.12;

  const spinner = new ShimmerSpinner(text, speed);

  process.stdout.write("\x1b[?25l");

  activeInterval = setInterval(() => {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(spinner.render());
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
