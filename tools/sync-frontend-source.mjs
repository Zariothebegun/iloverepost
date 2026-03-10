import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const owner = "Zariothebegun";
const repo = "v0-iloverepost-frontend-build";
const ref = "main";
const outputRoot = path.resolve("frontend-source", repo);

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "ILOVEREPOST sync script"
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed with ${response.status} for ${url}`);
  }

  return response.json();
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "ILOVEREPOST sync script"
    }
  });

  if (!response.ok) {
    throw new Error(`Download failed with ${response.status} for ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`;
const treePayload = await fetchJson(treeUrl);
const files = treePayload.tree.filter((entry) => entry.type === "blob");

for (const file of files) {
  const destination = path.join(outputRoot, file.path);
  await mkdir(path.dirname(destination), { recursive: true });

  const downloadUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${file.path}`;
  const buffer = await fetchBuffer(downloadUrl);
  await writeFile(destination, buffer);
  console.log(`synced ${file.path}`);
}
