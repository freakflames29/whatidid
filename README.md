# whatidid

Transform Git commit history into a clean, professional task report using AI.

## Install

```bash
npm install -g whatidid
```

## Setup

```bash
whatidid init
```

Enter your [OpenRouter API key](https://openrouter.ai/keys) and choose a model.

## Usage

```bash
# Today's report
whatidid today

# Weekly report
whatidid week

# Export to file
whatidid export
```

## Example

```
────────────────────────────────────────────

Project: my-app

Tasks completed

  • Implemented authentication using Supabase.
  • Added navigation and route protection.
  • Fixed issues related to user profile management.
  • Refactored dashboard components.
  • Improved loading states.

────────────────────────────────────────────
```

## Requirements

- Node.js 20+
- A Git repository
- OpenRouter API key

## License

MIT
