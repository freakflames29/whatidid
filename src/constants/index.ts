export const DEFAULT_MODEL = "openai/gpt-oss-20b";
export const MAX_WEEK_COMMITS = 20;
export const MAX_RETRIES = 2;
export const RETRY_BASE_DELAY_MS = 1000;

export const AI_PROMPT_TEMPLATE = `Look at the commit messages below and turn them into a short list of tasks completed for the project.

Write like a normal person summarizing their own work. Keep the wording plain and natural. Do not sound like a performance review or a polished corporate report.

Project name:

{{project_name}}

Commit messages:

{{commit_messages}}

Rules:

- Use simple, everyday English.
- Start each task with a verb.
- Combine small related commits into one task.
- Do not make up anything that is not in the commits.
- Return valid JSON with no markdown.

Return only JSON in this shape:

{
    "project": "project-name",
    "tasks": [
        "Added login and signup.",
        "Fixed the profile page bug.",
        "Updated the docs."
    ]
}`;

export const WEEKLY_PROMPT_TEMPLATE = `Look at the commit messages below and turn them into a short weekly list of tasks completed for the project.

Write like a normal person summarizing their own week. Keep the wording plain and natural. Do not sound like a polished corporate report.

Project name:

{{project_name}}

Commit messages:

{{commit_messages}}

Rules:

- Use simple, everyday English.
- Start each task with a verb.
- Group related commits into one task.
- Do not make up anything that is not in the commits.
- Return valid JSON with no markdown.

Return only JSON in this shape:

{
    "project": "project-name",
    "tasks": [
        "Added login and signup.",
        "Fixed the profile page bug.",
        "Updated the docs."
    ]
}`;
