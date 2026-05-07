import { z } from "zod";

export const REPOSITORY_URL = __REPOSITORY_URL__;
export const PAYPAL_URL = __PAYPAL_URL__;
export const APP_VERSION = __APP_VERSION__;
export const PAGES_URL = "https://baditaflorin.github.io/cinematheca/";

export const buildInfoSchema = z.object({
  version: z.string(),
  commit: z.string(),
  fullCommit: z.string(),
  branch: z.string(),
  builtAt: z.string(),
  repositoryUrl: z.string().url(),
  paypalUrl: z.string().url(),
  pagesUrl: z.string().url()
});

export type BuildInfo = z.infer<typeof buildInfoSchema>;

const githubCommitSchema = z.object({
  sha: z.string(),
  html_url: z.string().url(),
  commit: z.object({
    message: z.string(),
    committer: z.object({
      date: z.string()
    })
  })
});

export type LiveCommitInfo = {
  sha: string;
  shortSha: string;
  url: string;
  message: string;
  committedAt: string;
};

export async function fetchBuildInfo(): Promise<BuildInfo> {
  const response = await fetch(`${import.meta.env.BASE_URL}build-info.json`, {
    cache: "no-cache"
  });

  if (!response.ok) {
    throw new Error(`Build info failed with ${response.status}`);
  }

  return buildInfoSchema.parse(await response.json());
}

export async function fetchLiveCommit(): Promise<LiveCommitInfo> {
  const response = await fetch(
    "https://api.github.com/repos/baditaflorin/cinematheca/commits/main",
    {
      headers: {
        Accept: "application/vnd.github+json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub commit failed with ${response.status}`);
  }

  const parsed = githubCommitSchema.parse(await response.json());

  return {
    sha: parsed.sha,
    shortSha: parsed.sha.slice(0, 12),
    url: parsed.html_url,
    message: parsed.commit.message.split("\n")[0] ?? "latest commit",
    committedAt: parsed.commit.committer.date
  };
}
