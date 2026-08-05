export const DEFAULT_MODEL = "openai/gpt-oss-20b";
export const MAX_COMMITS = 5;
export const MAX_WEEK_COMMITS = 20;
export const MAX_RETRIES = 2;
export const RETRY_BASE_DELAY_MS = 1000;

export const AI_PROMPT_TEMPLATE = `You are a senior software engineering assistant.

Your task is to convert Git commit messages into a professional work report.

Project name:

{{project_name}}

Commit messages:

{{commit_messages}}

Rules:

- Correct spelling mistakes.
- Use professional language.
- Group related tasks together.
- Do not invent information.
- Ignore meaningless commits.
- Return valid JSON.
- Avoid markdown formatting.

Ignore commits such as:

- fix
- update
- temp
- wip
- test

Return the following structure:

{
    "project": "project-name",
    "tasks": [
        "Implemented authentication.",
        "Added route protection.",
        "Fixed profile page bugs."
    ]
}`;

export const WEEKLY_PROMPT_TEMPLATE = `You are a senior software engineering assistant.

Your task is to convert a week's worth of Git commit messages into a professional weekly work report.

Project name:

{{project_name}}

Commit messages:

{{commit_messages}}

Rules:

- Correct spelling mistakes.
- Use professional language.
- Group related tasks together into logical categories.
- Do not invent information.
- Ignore meaningless commits.
- Return valid JSON.
- Avoid markdown formatting.

Ignore commits such as:

- fix
- update
- temp
- wip
- test

Return the following structure:

{
    "project": "project-name",
    "tasks": [
        "Implemented authentication.",
        "Added route protection.",
        "Fixed profile page bugs."
    ]
}`;
