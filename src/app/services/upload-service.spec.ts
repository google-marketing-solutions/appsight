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

import { UploadService } from "./upload-service";
import { TestBed } from "@angular/core/testing";
import { enableProdMode } from "@angular/core";
import { LogService } from "./log-service";
import { MessageService } from "primeng/api";

enableProdMode(); // to avoid loading sample.ts that's used by the UI at startup

const sampleContents = "sample file contents";

class MockFileSystemFileHandle implements FileSystemFileHandle {
  readonly kind = "file";
  private mockFile = new File([sampleContents], 'my-file.txt', {
    type: "text/plain"
  });
  readonly isFile = true;
  readonly isDirectory = false;
  readonly name = 'my-file.txt';
  text = sampleContents;
  isSameEntry = jasmine.createSpy("isSameEntry");
  queryPermission = jasmine.createSpy('queryPermission').and.returnValue(Promise.resolve('granted'));
  requestPermission = jasmine.createSpy('requestPermission').and.returnValue(Promise.resolve('granted'));
  getFile = jasmine.createSpy("getFile").and.returnValue(Promise.resolve(this.mockFile));
  createWritable = jasmine.createSpy("createWritable").and.returnValue(undefined);
}

/**
 * @file Configuration file for Karma test runner.xxcc
 */
describe('UploadService', () => {
    let uploadService: UploadService;
    let spyUploadService: jasmine.SpyObj<UploadService>;
    let spyMessageService: jasmine.SpyObj<MessageService>;
    let spyLogService: jasmine.SpyObj<LogService>;

    beforeEach(() => {
      spyUploadService = jasmine.createSpyObj("UploadService", ["processFile"]);
      spyMessageService = jasmine.createSpyObj("MessageService", ["add", "clear"]);
      spyLogService = jasmine.createSpyObj("LogService", ["processLogs"]);
      TestBed.configureTestingModule({
        providers: [
          { provide: UploadService, useValue: spyUploadService },
          { provide: MessageService, useValue: spyMessageService},
          { provide: LogService, useValue: spyLogService},
          UploadService
        ]
      });
      uploadService = TestBed.inject(UploadService);
    });

    it('loads file', async () => {
        await uploadService.processFile(new MockFileSystemFileHandle());
        expect(uploadService.getRawLogs()).toEqual(sampleContents);
    });
});
