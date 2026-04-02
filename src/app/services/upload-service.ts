/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, firstValueFrom } from "rxjs";
import { LogService } from "./log-service";
import { MessageService } from "primeng/api";
import { HttpClient, HttpHeaders } from "@angular/common/http";

// tslint:disable-next-line:no-any
declare const google: any;
const CLIENT_ID = '870666202511-688dohsh8aq5rrucnbb2tis5o1jc4rs8.apps.googleusercontent.com';
const GCS_SCOPE = 'https://www.googleapis.com/auth/devstorage.read_only https://www.googleapis.com/auth/userinfo.profile';
const STORAGE_KEY_TOKEN = 'appsight_access_token';
const STORAGE_KEY_PROFILE = 'appsight_user_profile';

const UPLOAD_TIMEOUT = 5000;
const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB

/** Profile of the logged-in user. */
export interface UserProfile {
  name: string;
  picture: string;
}

/** Interface for GCS object metadata. */
interface GcsMetadata {
  size: number;
  name: string;
  contentType: string;
}

/** Interface for Google Identity Services token response. */
interface TokenResponse {
  access_token: string;
  error?: string;
}

/** Service responsible for uploading files */
@Injectable({ providedIn: "root" })
export class UploadService {
  private startTime?: Date = undefined;
  private videoDuration?: number = undefined;

  private rawLogs?: string = undefined;
  private accessToken: string | null = null;
  // tslint:disable-next-line:no-any
  private tokenClient: any;
  private currentVideoBlobUrl: string | null = null;
  private tokenClientReady: Promise<void>;
  private resolveTokenClient!: () => void;

  videoFileUrlLoaded = new BehaviorSubject<string | undefined>(undefined);
  uploadInitiated = new Subject<void>();
  loading = new BehaviorSubject<boolean>(false);
  userProfile = new BehaviorSubject<UserProfile | null>(null);
  downloadProgress$ = new BehaviorSubject<number>(0);
  downloadFileName$ = new BehaviorSubject<string>('');

  getLoading() {
    return this.loading.asObservable();
  }

  setLoading(isLoading: boolean) {
    console.log(`Setting loading state: ${isLoading}`);
    this.loading.next(isLoading);
  }

  getUploadInitiated(){
    return this.uploadInitiated.asObservable();
  }

  getVideoFileUrlLoaded() {
    return this.videoFileUrlLoaded.asObservable();
  }

  getUserProfile() {
    return this.userProfile.asObservable();
  }

  getDownloadProgress() {
    return this.downloadProgress$.asObservable();
  }

  getDownloadFileName() {
    return this.downloadFileName$.asObservable();
  }

  constructor(
    private logService: LogService,
    private messageService: MessageService,
    private http: HttpClient,
  ) {
    this.tokenClientReady = new Promise((resolve) => {
      this.resolveTokenClient = resolve;
    });

    // Restore session from localStorage
    const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (savedToken) {
      this.accessToken = savedToken;
      console.log("Restored access token from storage.");
      this.fetchUserProfile();
    }
    if (savedProfile) {
      try {
        this.userProfile.next(JSON.parse(savedProfile) as UserProfile);
      } catch (e) {
        console.error("Failed to parse saved profile", e);
      }
    }

    this.initTokenClient();
    this.videoFileUrlLoaded.subscribe(url => {
      if (this.currentVideoBlobUrl && this.currentVideoBlobUrl !== url) {
        URL.revokeObjectURL(this.currentVideoBlobUrl);
      }
      this.currentVideoBlobUrl = url || null;
    });
  }

  private initTokenClient() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: GCS_SCOPE,
        callback: async (response: TokenResponse) => {
          if (response.error !== undefined) {
            throw (response);
          }
          this.accessToken = response.access_token;
          localStorage.setItem(STORAGE_KEY_TOKEN, this.accessToken!);
          console.log("Access token acquired and saved.");
          await this.fetchUserProfile();
        },
      });
      this.resolveTokenClient();
    } else {
      setTimeout(() => this.initTokenClient(), 500);
    }
  }

  private async fetchUserProfile() {
    if (!this.accessToken) return;
    try {
      const info = await firstValueFrom(this.http.get<UserProfile>('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      }));

      const current = this.userProfile.value;
      if (!current || current.picture !== info.picture || current.name !== info.name) {
        const profile = { name: info.name, picture: info.picture };
        this.userProfile.next(profile);
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
      }
    } catch (e: unknown) {
      console.error("Failed to fetch user profile", e);
      const error = e as { status?: number };
      if (error.status === 401) {
        this.accessToken = null;
        this.userProfile.next(null);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_PROFILE);
      }
    }
  }

  async logout() {
    if (this.accessToken) {
      try {
        google.accounts.oauth2.revoke(this.accessToken, () => {
          console.log("Token revoked");
        });
      } catch (e) {
        console.error("Error revoking token", e);
      }
    }
    this.accessToken = null;
    this.userProfile.next(null);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
  }

  private async getValidToken(forcePrompt = false): Promise<string> {
    await this.tokenClientReady;
    if (this.accessToken && !forcePrompt) {
      return this.accessToken;
    }

    return new Promise((resolve, reject) => {
      this.tokenClient.callback = async (response: TokenResponse) => {
        if (response.error !== undefined) {
          this.messageService.add({
            severity: "error",
            summary: "Authentication Error",
            detail: "Failed to get GCS access token."
          });
          reject(response);
          return;
        }
        this.accessToken = response.access_token;
        localStorage.setItem(STORAGE_KEY_TOKEN, this.accessToken!);
        await this.fetchUserProfile();
        resolve(this.accessToken!);
      };
      this.tokenClient.requestAccessToken({ prompt: forcePrompt ? 'select_account' : '' });
    });
  }

  async login() {
    await this.getValidToken(true);
  }

  async downloadInChunks(gcsPath: string, filename: string): Promise<Blob> {
    const token = await this.getValidToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    const metaUrl = `/api/gcs/metadata?path=${encodeURIComponent(gcsPath)}&file=${filename}`;
    const metadata = await firstValueFrom(this.http.get<GcsMetadata>(metaUrl, { headers }));
    const totalSize = metadata.size;
    console.log(`Starting chunked download for ${filename}, size: ${totalSize} bytes`);

    this.downloadFileName$.next(filename);
    this.downloadProgress$.next(0);

    const chunks: Blob[] = [];
    let start = 0;

    while (start < totalSize) {
      const end = Math.min(start + CHUNK_SIZE, totalSize);
      const progress = Math.round((start / totalSize) * 100);
      this.downloadProgress$.next(progress);

      const downloadUrl = `/api/gcs/download?path=${encodeURIComponent(gcsPath)}&file=${filename}&start=${start}&end=${end}`;
      const chunk = await firstValueFrom(this.http.get(downloadUrl, {
        headers,
        responseType: 'blob'
      }));
      chunks.push(chunk);
      start = end;
    }

    this.downloadProgress$.next(100);
    return new Blob(chunks, { type: metadata.contentType || 'application/octet-stream' });
  }

  async loadFromGcs(gcsPath: string) {
    console.log("Setting loading state: true (GCS)");
    this.loading.next(true);
    this.rawLogs = undefined;
    this.startTime = undefined;
    this.videoDuration = undefined;
    this.uploadInitiated.next();

    this.messageService.clear();
    this.messageService.add({
      key: 'gcs-download-toast',
      severity: "info",
      summary: "Loading from GCS",
      sticky: true
    });

    try {
      // 1. Load Logcat
      let logBlob: Blob;
      try {
        logBlob = await this.downloadInChunks(gcsPath, "logcat.txt");
      } catch (e: unknown) {
        const error = e as { status?: number };
        if (error.status === 404) {
          logBlob = await this.downloadInChunks(gcsPath, "logcat");
        } else {
          throw e;
        }
      }
      this.rawLogs = await logBlob.text();

      // 2. Load Video
      const videoBlob = await this.downloadInChunks(gcsPath, "video.mp4");
      const videoWithMime = videoBlob.type.startsWith('video/') ? videoBlob : new Blob([videoBlob], { type: 'video/mp4' });

      const localVideoUrl = URL.createObjectURL(videoWithMime);
      this.videoFileUrlLoaded.next(localVideoUrl);

      this.setStartTime();
      this.messageService.clear('gcs-download-toast');
      console.log("Chunked GCS loading complete.");

      setTimeout(() => {
        if (this.loading.value) {
          this.loading.next(false);
        }
      }, 20000);
    } catch (e: unknown) {
      this.loading.next(false);
      this.messageService.clear('gcs-download-toast');
      console.error("Error loading from GCS:", e);
      const error = e as { status?: number; message?: string };
      let errorMsg = "Error loading from GCS";
      if (error.status === 403) {
        errorMsg = "Access denied. Ensure you have permission to the GCS bucket.";
      } else if (error.status === 404) {
        errorMsg = "Files not found in GCS bucket.";
      }
      this.messageService.add({
        severity: "error",
        summary: errorMsg,
        detail: error.message || "",
        sticky: true
      });
    }
  }

  async processFile(event: FileSystemFileHandle | FileSystemDirectoryHandle) {
    if (event.kind !== "file") return;
    const file = await event.getFile();
    if (event.name.endsWith("txt")) {
      const rawLogs = await file.text();
      this.rawLogs = rawLogs;
    } else if (event.name.endsWith("mp4")) {
      const videoFileUrl = URL.createObjectURL(file);
      this.videoFileUrlLoaded.next(videoFileUrl);
    }
  }

  async displayFileUpload() {
    this.loading.next(true);
    this.rawLogs = undefined;
    this.startTime = undefined;
    this.videoDuration = undefined;
    this.uploadInitiated.next();
    this.messageService.add({
      severity: "info",
      summary: "Loading uploaded files...",
    });
    const dirHandle = await (window as unknown as { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker();
    this.setStartTime();
    for await (const event of dirHandle.values()) {
      await this.processFile(event);
    }
    this.messageService.clear();

    setTimeout(() => {
      if (this.videoFileUrlLoaded.value === undefined) {
        this.loading.next(false);
        this.setStartTime();
        this.messageService.add({
          severity: "info",
          summary: "No video found.",
        });
      }
    }, UPLOAD_TIMEOUT);
  }
  setVideoDuration(duration: number) {
    this.videoDuration = duration;
  }

  getVideoDuration(): number | undefined {
    return this.videoDuration;
  }

  setStartTime(startTime?: Date) {
    this.startTime = startTime;
    if (this.rawLogs) {
      this.logService.processLogs(this.rawLogs, startTime);
    }
  }

  getStartTime(): Date | undefined {
    return this.startTime;
  }

  getRawLogs(): string | undefined {
    return this.rawLogs;
  }

  getFirstLogDate(): Date | undefined {
    if (!this.rawLogs) return undefined;
    const lines = this.rawLogs.split("\n");
    for (const line of lines) {
      const androidMatch = line.match(/^(\d{2}-\d{2})\s/);
      if (androidMatch) {
        const currentYear = new Date().getFullYear();
        const date = new Date(`${currentYear}-${androidMatch[1]}`);
        if (!isNaN(date.getTime())) return date;
      }
      const iosMatch = line.match(/^(\d{4}-\d{2}-\d{2})\s/);
      if (iosMatch) {
        const date = new Date(iosMatch[1]);
        if (!isNaN(date.getTime())) return date;
      }
    }
    return undefined;
  }
}
