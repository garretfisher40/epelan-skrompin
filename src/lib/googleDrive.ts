// src/lib/googleDrive.ts
export const TARGET_DRIVE_FOLDER_ID = '1ghjXh38jLhTXsJKufUNlTUYaFdy5tg7h';
export const TARGET_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1ghjXh38jLhTXsJKufUNlTUYaFdy5tg7h?usp=drive_link';

export interface DriveUploadResult {
  id: string;
  name: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: string;
}

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  thumbnailLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

/**
 * Uploads a file (File object or Base64 data URI) directly to the target Google Drive folder.
 */
export async function uploadFileToDrive(
  fileInput: File | { name: string; type?: string; data: string },
  accessToken: string,
  folderId = TARGET_DRIVE_FOLDER_ID
): Promise<DriveUploadResult> {
  const metadata = {
    name: fileInput.name,
    parents: [folderId],
    description: 'Fail dimuat naik dari e-Pelan SK Rompin 2026'
  };

  let blob: Blob;
  let mimeType = 'application/octet-stream';

  if (fileInput instanceof File) {
    blob = fileInput;
    mimeType = fileInput.type || mimeType;
  } else if ('data' in fileInput && typeof fileInput.data === 'string') {
    if (fileInput.data.startsWith('data:')) {
      const parts = fileInput.data.split(',');
      const match = parts[0].match(/:(.*?);/);
      if (match) mimeType = match[1];
      const binaryStr = atob(parts[1]);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      blob = new Blob([bytes], { type: mimeType });
    } else {
      blob = new Blob([fileInput.data], { type: fileInput.type || mimeType });
    }
  } else {
    throw new Error('Format fail tidak sah.');
  }

  const boundary = '-------DriveUploadBoundary3141592653589';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
  const mediaHeader = `${delimiter}Content-Type: ${mimeType}\r\n\r\n`;

  const multipartBlob = new Blob([
    metadataPart,
    mediaHeader,
    blob,
    closeDelimiter
  ], { type: `multipart/related; boundary=${boundary}` });

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,size',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: multipartBlob,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Drive Upload error:', response.status, errorText);
    throw new Error(`Gagal memuat naik ke Google Drive (${response.status}): ${errorText}`);
  }

  const result: DriveUploadResult = await response.json();
  return result;
}

/**
 * List files inside the specific Google Drive folder.
 */
export async function listDriveFolderFiles(
  accessToken: string,
  folderId = TARGET_DRIVE_FOLDER_ID
): Promise<DriveFileInfo[]> {
  const query = `'${folderId}' in parents and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,size,webViewLink,thumbnailLink,createdTime,modifiedTime)&orderBy=createdTime desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Drive list error:', response.status, errorText);
    throw new Error(`Gagal mendapatkan fail Google Drive (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Delete a file from Google Drive with mandatory user confirmation
 */
export async function deleteDriveFileWithConfirm(
  fileId: string,
  fileName: string,
  accessToken: string
): Promise<boolean> {
  const confirmed = window.confirm(
    `Adakah anda pasti ingin memadam fail "${fileName}" dari Google Drive folder SK Rompin? Tindakan ini tidak boleh dibatalkan.`
  );
  if (!confirmed) return false;

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    throw new Error(`Gagal memadam fail dari Google Drive: ${errorText}`);
  }

  return true;
}
