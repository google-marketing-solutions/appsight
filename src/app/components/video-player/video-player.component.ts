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
} from "@angular/core";
// This rule raises "Import path ended with superfluous .js", but .js is part of the package name.
// tslint:disable-next-line:ban-malformed-import-paths
import { createWorker } from "tesseract.js";
import { UploadService } from "../../services/upload-service";
import { ButtonModule } from "primeng/button";
import { EventSelectionService } from "../../services/event-select-service";
import { MessageService } from "primeng/api";
import { VideoPlayerService } from "../../services/video-player-service";

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
    imports: [ButtonModule],
    templateUrl: "./video-player.component.html",
    styleUrl: "./video-player.component.scss"
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild("video") videoRef: ElementRef<HTMLVideoElement> = {} as ElementRef;

  VIDEO_S_START = 0.3;

  constructor(
    private uploadService: UploadService,
    private eventSelectionService: EventSelectionService,
    private messageService: MessageService,
    private videoPlayerService: VideoPlayerService
  ) { }

  ngOnInit(): void {
    this.uploadService.getVideoFileUrlLoaded().subscribe((videoFileUrl) => {
      if (videoFileUrl) this.videoRef.nativeElement.src = videoFileUrl;
      this.isSeeked = false;
    });
    this.eventSelectionService.timeUpdated.subscribe((value) => {
      this.videoRef.nativeElement.currentTime = value / 1000;
    });
  }

  ngAfterViewInit(): void {
    this.videoRef.nativeElement.addEventListener('timeupdate', this.onVideoPlayerTimeUpdate.bind(this));
  }

  onVideoPlayerTimeUpdate(){
    this.videoPlayerService.onVideoPlayerTimeUpdate(this.videoRef.nativeElement.currentTime);
  }

  onUploadClick() {
    this.uploadService.displayFileUpload();
  }

  /**
   * Update metadata when video is ready, set position to
   * convenient position and register a unique seeked event to trigger OCR processing
   */
  onVideoLoadedMetadata() {
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
    if (ocrResult === "") return false;
    const lines = ocrResult.split("\n");
    for (const line of lines) {
      if (line.startsWith("Started ")) {
        let tentativeTimestamp = line.replace("Started ", "");
        console.log("tentativeTimestamp: ", tentativeTimestamp);
        tentativeTimestamp = tentativeTimestamp.split("+")[0].split("-")[0];
        console.log("tentativeTimestamp: ", tentativeTimestamp);
        const timestamp = new Date(tentativeTimestamp);
        console.log("timestamp: ", timestamp);
        return timestamp;
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
    const canvas = document.createElement("canvas");
    canvas.width = this.videoRef.nativeElement.videoWidth;
    canvas.height = this.videoRef.nativeElement.videoHeight;
    canvas!.getContext("2d")!.drawImage(this.videoRef.nativeElement, 0, 0);
    createWorker("eng").then((w) => {
      w.recognize(canvas).then((result) => {
        const recordingStartTimestamp = this.getRecordingStartTimestamp(
          result.data.text,
        );
        if (!recordingStartTimestamp) {
          this.messageService.add({
            id: "VideoPlayerComponent.onSeeked",
            severity: "error",
            summary: "Could not recognize starting timestamp on uploaded video. Make sure you follow user instructions to record it.",
          });
          w.terminate();
          return;
        }
        const startTime = recordingStartTimestamp;
        startTime.setTime(
          recordingStartTimestamp.getTime() - this.VIDEO_S_START,
        );
        this.uploadService.setStartTime(startTime);
        w.terminate();
      });
    });
  }
}
