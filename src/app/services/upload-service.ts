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
import { BehaviorSubject, Subject } from "rxjs";
import { LogService } from "./log-service";
import { MessageService } from "primeng/api";

const UPLOAD_TIMEOUT = 5000;

/** Service responsible for uploading files */
@Injectable({ providedIn: "root" })
export class UploadService {
  private startTime?: Date = undefined;
  private videoDuration?: number = undefined;

  private rawLogs?: string = undefined;

  videoFileUrlLoaded = new BehaviorSubject<string | undefined>(undefined);
  uploadInitiated = new Subject<void>();

  getUploadInitiated(){
    return this.uploadInitiated.asObservable();
  }

  getVideoFileUrlLoaded() {
    return this.videoFileUrlLoaded.asObservable();
  }

  constructor(
    private logService: LogService,
    private messageService: MessageService,
  ) {}

  /**
   * Process any input file uploaded by the user. This will only consider txt
   * file, which we expect to contain GMA SDK network traces, and the mp4 video
   * recording of the associated user session.
   */
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
    this.rawLogs = undefined;
    this.startTime = undefined;
    this.videoDuration = undefined;
    this.uploadInitiated.next();
    this.messageService.add({
      id: "button-upload-click",
      severity: "info",
      summary: "Loading uploaded files...",
    });
    const dirHandle = await window.showDirectoryPicker();
    this.setStartTime();
    for await (const event of dirHandle.values()) {
      await this.processFile(event);
    }
    this.messageService.clear();

    setTimeout(() => {
      if (this.videoFileUrlLoaded.value === undefined) {
        this.setStartTime();
        this.messageService.add({
          id: "button-upload-click",
          severity: "info",
          summary: "No video found.",
        });
      }
    }, UPLOAD_TIMEOUT); // Adjust timeout as needed if processing video/logs takes longer
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
}
