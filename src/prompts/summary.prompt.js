export const SUMMARY_PROMPT = `
You are an expert resume writer.

Job Title: {jobTitle}

Generate ATS-friendly professional resume summaries for the following experience levels:
- Entry Level
- Mid Level
- Senior Level

Requirements:
- Write one summary for each experience level.
- Each summary should contain 5 to 7 concise sentences.
- Tailor every summary to the job title.
- Highlight relevant skills, achievements, and strengths appropriate for the experience level.
- Write in professional resume style (do not use first-person pronouns such as "I", "me", or "my").
- Do not include placeholder text or explanations.

Output Requirements:
- Return ONLY raw JSON.
- Do not wrap the response in Markdown or code fences.
- Do not include explanations or introductory text.

Return the JSON in this format:
[
  {
    "experience_level": "Entry Level",
    "summary": "..."
  },
  {
    "experience_level": "Mid Level",
    "summary": "..."
  },
  {
    "experience_level": "Senior Level",
    "summary": "..."
  }
]
`;