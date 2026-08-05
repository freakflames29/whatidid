# Command Code Taste Profile
- Prioritizes free/zero-cost options in selection UIs, listing them first before paid alternatives. Confidence: 0.8
- Uses `:free` slug suffix and zero-pricing as combined heuristic for detecting free-tier API offerings (e.g., OpenRouter models). Confidence: 0.7
- Prefers using Node.js built-in `fetch` for auxiliary HTTP calls when the primary SDK lacks coverage for an endpoint, rather than adding a new dependency. Confidence: 0.6
- Prefers empty catch blocks (`catch {}`) when the caught error variable is unused, to satisfy ESLint no-unused-vars rules. Confidence: 0.7
- Prefers git-native relative date references (`--since="midnight"`, `--since="7.days.ago"`) over programmatic date math when filtering commits, to avoid timezone boundary bugs. Confidence: 0.7
- When debugging SDK/API integration issues, prefers consulting official documentation over reverse-engineering type definitions as the first step. Confidence: 0.6
