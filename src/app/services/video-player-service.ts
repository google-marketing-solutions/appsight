import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service that receives and broadcast events related to the video player
 */
@Injectable({
  providedIn: 'root'
})
export class VideoPlayerService {
  videoPositionUpdate = new Subject<number>();

  getVideoPositionUpdateObservable() {
    return this.videoPositionUpdate.asObservable();
  }

  onVideoPlayerTimeUpdate(time: number) {
    this.videoPositionUpdate.next(time);
  }
}