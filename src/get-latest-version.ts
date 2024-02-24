import fetch from 'node-fetch';

export function getURL(org: string, repo: string, api: string): string {
  let url = '';

  if (api === 'brew') {
    url = `https://formulae.brew.sh/api/formula/${repo}.json`;
  } else if (api === 'github') {
    url = `https://api.github.com/repos/${org}/${repo}/releases/latest`;
  }

  return url;
}

type VersionBrew = {
  versions: {
    stable: string;
  };
};

type VersionGitHub = {
  tag_name: string;
};

export async function getLatestVersion(org: string, repo: string, api: string): Promise<string> {
  const url = getURL(org, repo, api);
  const response = await fetch(url);
  const json: unknown = await response.json();
  let latestVersion = '';
  if (api === 'brew') {
    const brewJson = json as VersionBrew;
    latestVersion = brewJson.versions.stable;
  } else if (api === 'github') {
    const github = json as VersionGitHub;
    latestVersion = github.tag_name;
  }
  return latestVersion;
}
