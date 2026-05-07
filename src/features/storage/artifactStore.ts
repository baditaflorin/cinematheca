import { openDB, type DBSchema } from "idb";

export type StoredArtifact = {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  blob: Blob;
};

interface CinemathecaArtifactsDb extends DBSchema {
  artifacts: {
    key: string;
    value: StoredArtifact;
  };
}

const typedDbPromise = openDB<CinemathecaArtifactsDb>("cinematheca-artifacts", 1, {
  upgrade(db) {
    db.createObjectStore("artifacts", { keyPath: "id" });
  }
});

export async function saveArtifact(artifact: StoredArtifact): Promise<void> {
  const db = await typedDbPromise;
  await db.put("artifacts", artifact);
}

export async function listArtifacts(): Promise<StoredArtifact[]> {
  const db = await typedDbPromise;
  return db.getAll("artifacts");
}

export async function clearArtifacts(): Promise<void> {
  const db = await typedDbPromise;
  await db.clear("artifacts");
}
