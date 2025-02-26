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

import { BehaviorSubject , Subject} from 'rxjs';
import { LogEvent } from './log-service';
import { Injectable } from '@angular/core';

/**
 * Service to broadcast selection of a log event
 */
@Injectable()
export class EventSelectionService {
  private selectedEventObservable = new BehaviorSubject<LogEvent | undefined>(
    undefined
  );
  private time?: number = undefined;
  timeUpdated = new Subject<number>();

  selectEvent(event: LogEvent | undefined) {
    this.selectedEventObservable.next(event);
  }

  getSelectedEventObservable() {
    return this.selectedEventObservable.asObservable();
  }

  setTime(time: number) {
    this.time = time;
    this.timeUpdated.next(time);
  }

  getTime(): number | undefined {
    return this.time;
  }
}