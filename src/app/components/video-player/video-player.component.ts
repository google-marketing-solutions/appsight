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

import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
// This rule raises "Import path ended with superfluous .js", but .js is part of the package name.
// tslint:disable-next-line:ban-malformed-import-paths
import { createWorker } from "tesseract.js";
import { UploadService } from "../../services/upload-service";
import { ButtonModule } from "primeng/button";
import { EventSelectionService } from "../../services/event-select-service";
import { MessageService } from "primeng/api";
import { VideoPlayerService } from "../../services/video-player-service";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";

/**
 * Event raised whenever the video uploaded by the user is loaded
 */
export interface VideoLoadedEvent {
  duration: number;
}

/**
 * Component to play the video uploaded from the user.
 */
@Component({
    selector: "app-video-player",
    imports: [ButtonModule, CommonModule],
    templateUrl: "./video-player.component.html",
    styleUrl: "./video-player.component.scss"
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild("video") videoRef: ElementRef<HTMLVideoElement> = {} as ElementRef;

  VIDEO_S_START = 0.1;
  currentGcsPath: string | null = null;

  constructor(
    private uploadService: UploadService,
    private eventSelectionService: EventSelectionService,
    private messageService: MessageService,
    private videoPlayerService: VideoPlayerService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.eventSelectionService.timeUpdated.subscribe((value) => {
      if (this.videoRef?.nativeElement) {
        this.videoRef.nativeElement.currentTime = value / 1000;
      }
    });
    this.route.queryParams.subscribe(params => {
      this.currentGcsPath = params['gcs_path'] || null;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.videoRef.nativeElement.addEventListener('timeupdate', this.onVideoPlayerTimeUpdate.bind(this));

    // Add error listener for better debugging
    this.videoRef.nativeElement.onerror = (e) => {
      const error = this.videoRef.nativeElement.error;
      console.error("[VideoError] Code:", error?.code, "Message:", error?.message);
      this.messageService.add({
        severity: 'error',
        summary: 'Video Playback Error',
        detail: `Code ${error?.code}: ${error?.message || 'Unknown error'}`
      });
    };

    this.videoRef.nativeElement.onstalled = () => console.warn("[Video] Playback stalled");
    this.videoRef.nativeElement.onwaiting = () => console.log("[Video] Waiting for data...");

    // Subscribe after view is initialized so videoRef is guaranteed to be available
    this.uploadService.getVideoFileUrlLoaded().subscribe((videoFileUrl) => {
      if (videoFileUrl && this.videoRef?.nativeElement) {
        console.log("Setting video element src:", videoFileUrl.substring(0, 50) + "...");
        this.videoRef.nativeElement.src = videoFileUrl;
        this.videoRef.nativeElement.load(); // Force load
      }
      this.isSeeked = false;
    });
  }

  onVideoPlayerTimeUpdate(){
    this.videoPlayerService.onVideoPlayerTimeUpdate(this.videoRef.nativeElement.currentTime);
  }

  onUploadClick() {
    this.currentGcsPath = null;
    this.uploadService.displayFileUpload();
  }

  onGcsUploadClick() {
    const path = window.prompt("Enter GCS path (e.g. gs://bucket/prefix):", this.currentGcsPath || "");
    if (path) {
      this.uploadService.loadFromGcs(path);
    }
  }

  /**
   * Update metadata when video is ready, set position to
   * convenient position and register a unique seeked event to trigger OCR processing
   */
  onVideoLoadedMetadata() {
    console.log("Video metadata loaded. Duration:", this.videoRef.nativeElement.duration);
    this.uploadService.setVideoDuration(this.videoRef.nativeElement.duration);
    this.videoRef.nativeElement.addEventListener(
      "seeked",
      this.onSeeked.bind(this),
      {
        once: true,
      },
    );
    this.videoRef.nativeElement.currentTime = this.VIDEO_S_START;
  }

  /**
   * Expect the text data extracted from the first frame on an adb debug video recording and returns the recording start timestamp, or false if it could not be found
   * @param {String} ocrResult
   */
  getRecordingStartTimestamp(ocrResult: string) {
    console.log("OCR Result for timestamp:", ocrResult);
    if (ocrResult === "") return false;
    const lines = ocrResult.split("\n");

    // 1. First try the standard "Started TIMESTAMP" format
    for (const line of lines) {
      if (line.startsWith("Started ")) {
        let tentativeTimestamp = line.replace("Started ", "");
        tentativeTimestamp = tentativeTimestamp.split("+")[0].split("-")[0];
        const timestamp = new Date(tentativeTimestamp);
        if (!isNaN(timestamp.getTime())) return timestamp;
      }
    }

    // 2. Fallback: try to find a time-only format like "3:04:19 PM" or "15:04:19"
    // Regex for H:MM:SS AM/PM or HH:MM:SS
    const timeOnlyRegex = /(\d{1,2}:\d{2}:\d{2}(?:\s?[AP]M)?)/i;
    for (const line of lines) {
      const match = line.match(timeOnlyRegex);
      if (match) {
        const detectedTime = match[1];
        const logDate = this.uploadService.getFirstLogDate();

        if (logDate && !isNaN(logDate.getTime())) {
          const dateStr = logDate.getFullYear() + "-" +
                          String(logDate.getMonth() + 1).padStart(2, '0') + "-" +
                          String(logDate.getDate()).padStart(2, '0');

          const combinedStr = `${dateStr} ${detectedTime}`;
          console.log(`Attempting to combine: "${combinedStr}"`);
          const combinedTimestamp = new Date(combinedStr);

          if (!isNaN(combinedTimestamp.getTime())) {
            console.log(`Fallback successful: ${combinedTimestamp.toLocaleString()}`);
            return combinedTimestamp;
          } else {
            console.warn(`Could not parse combined date string: "${combinedStr}"`);
          }
        } else {
          console.warn("Could not find a valid date in the logs to combine with the OCR time.");
        }
      }
    }

    return false;
  }

  isSeeked = false;

  /**
   * Process the video current frame to find starting timestamp of
   *  the video and trigger population of the timeline
   */
  onSeeked() {
    if (this.isSeeked) return;
    this.isSeeked = true;
    console.log("Video seeked, starting OCR...");
    const canvas = document.createElement("canvas");
    canvas.width = this.videoRef.nativeElement.videoWidth;
    canvas.height = this.videoRef.nativeElement.videoHeight;
    canvas!.getContext("2d")!.drawImage(this.videoRef.nativeElement, 0, 0);
    createWorker("eng").then((w) => {
      w.recognize(canvas).then((result) => {
        console.log("OCR complete. Raw text:", result.data.text);
        const recordingStartTimestamp = this.getRecordingStartTimestamp(
          result.data.text,
        );
        if (!recordingStartTimestamp) {
          console.error("OCR failed to find a valid timestamp.");
          this.uploadService.setLoading(false);
          this.messageService.add({
            id: "VideoPlayerComponent.onSeeked",
            severity: "error",
            summary: "Could not recognize starting timestamp on uploaded video.",
            detail: `Detected text: "${result.data.text.trim()}"`,
            sticky: true
          });
          // Fallback: trigger processing even without start time sync to avoid bunched up events
          this.uploadService.setStartTime(undefined);
          w.terminate();
          return;
        }
        const startTime = recordingStartTimestamp;
        startTime.setTime(
          recordingStartTimestamp.getTime() - this.VIDEO_S_START,
        );
        console.log("OCR Success. Start time set to:", startTime.toLocaleString());
        this.uploadService.setStartTime(startTime);
        this.uploadService.setLoading(false);
        w.terminate();
      }).catch(err => {
        console.error("Tesseract recognition error:", err);
        this.uploadService.setLoading(false);
        this.uploadService.setStartTime(undefined);
        w.terminate();
      });
    }).catch(err => {
      console.error("Tesseract worker creation error:", err);
      this.uploadService.setLoading(false);
      this.uploadService.setStartTime(undefined);
    });
  }
}
