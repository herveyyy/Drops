"use server";

import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

function getAllFiles(dirPath: string, relativeTo: string = ""): any[] {
  const files: any[] = [];
  const items = fs.readdirSync(dirPath);
  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    const relativePath = path.join(relativeTo, item);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...getAllFiles(fullPath, relativePath));
    } else {
      files.push({
        name: item,
        relativePath,
        size: stats.size,
        modified: stats.mtime.toISOString(),
        fullPath,
      });
    }
  });
  return files;
}

export async function listUploads() {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      return [];
    }
    return getAllFiles(UPLOAD_DIR);
  } catch (error) {
    console.error("Failed to list uploads:", error);
    throw new Error("Failed to list uploads");
  }
}

export async function deleteUpload(relativePath: string) {
  try {
    const filePath = path.join(UPLOAD_DIR, relativePath);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        fs.unlinkSync(filePath);
      } else {
        throw new Error("Cannot delete directory");
      }
    }
  } catch (error) {
    console.error("Failed to delete upload:", error);
    throw new Error("Failed to delete upload");
  }
}

export async function getStorageInfo() {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      return { totalSize: 0, fileCount: 0 };
    }
    const files = fs.readdirSync(UPLOAD_DIR);
    let totalSize = 0;
    files.forEach((file) => {
      const filePath = path.join(UPLOAD_DIR, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    });
    return { totalSize, fileCount: files.length };
  } catch (error) {
    console.error("Failed to get storage info:", error);
    throw new Error("Failed to get storage info");
  }
}
