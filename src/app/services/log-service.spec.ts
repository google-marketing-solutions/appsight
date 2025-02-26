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

/**
 * @file Configuration file for Karma test runner.
 */

import { Logs, LogEvent, LogService } from "./log-service";
import { TestBed} from "@angular/core/testing";
import { MessageService } from "primeng/api";
import { enableProdMode } from "@angular/core";

const PROCESSING_TIMEOUT = 3000;
enableProdMode(); // to avoid loading sample.ts that's used by the UI at startup

let goldenAndroidProcessed: LogEvent[];
fetch("/base/src/app/services/log-service.golden-android-processed.json")
    .then((file) => file.json()
    .then((json) => {
        goldenAndroidProcessed = json.map((item: LogEvent) => {
            const newParams = { ...item.gmaParams };
            if (item.gmaParams.request_url) {
                newParams.request_url = new URL(item.gmaParams.request_url);
            }
            return {
                ...item,
                absoluteTime: new Date(item.absoluteTime),
                gmaParams: newParams
          };
        });
    })).catch((e) => {
       console.log(e);
    });

/**
 * Test the reading of Network Tracing Logs
 */
describe('Log Service', () => {
    let golden: string;
    const startTime = undefined;
    let spyMessageService: jasmine.SpyObj<MessageService>;
    let spyLogService: jasmine.SpyObj<LogService>;
    let processedLogs : Logs | undefined;

    beforeAll((done) => {
        spyMessageService = jasmine.createSpyObj("MessageService", ["add", "clear"]);
        spyLogService = jasmine.createSpyObj("LogService", ["processLogs"]);

        TestBed.configureTestingModule({
            providers: [
                { provide: MessageService, useValue: spyMessageService},
                { provide: LogService, useValue: spyLogService},
                LogService
            ]
        });
        TestBed.inject(LogService);
        fetch("/base/src/app/services/log-service.golden-android.txt")
        .then(file => file.text())
        .then(text => {
            golden = text;
            const messageService = TestBed.inject(MessageService);
            const logService = new LogService(messageService);
            logService.processLogs(golden, startTime);
            logService.getLogsObsersable().subscribe((logs) => {
                processedLogs = logs;
            });

            // Wait until all logsObsersable subscriptions
            setTimeout(() => {
                done();
            }, PROCESSING_TIMEOUT);
        });
    });

    /**
     * Confirm Android Newtwork Tracing can be understood
     */
    it("reads ad request from Android network tracing", () => {
        expect(processedLogs?.events.length).toBe(8);
    });

    it("reads all network tracing", () => {
        expect(processedLogs?.events).toEqual(goldenAndroidProcessed);
    });

    it("confirms logs are observable", () => {
        expect(processedLogs).toBeDefined(); // tests logService.getLogsObsersable() above
    });
});

