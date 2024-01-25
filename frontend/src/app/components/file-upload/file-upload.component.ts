import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {FileUploadService} from "../../services/file-upload.service";
import {HttpEventType} from "@angular/common/http";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit{
  selectedFiles: FileList | null = null;
  currentFile: File | null = null;
  progress: number = 0;
  message: string = '';
  fileDetails!: Observable<any>;

  constructor(private uploadService: FileUploadService) {
  }

  ngOnInit() {
    this.fileDetails = this.uploadService.getFiles();
  }

  selectFile(event: Event) {
    this.selectedFiles = (event.target as HTMLInputElement).files!;
  }

  upload() {
    this.progress = 0;
    this.currentFile = this.selectedFiles!.item(0);
    this.uploadService.upload(this.currentFile!).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total!);
        } else if (event.type === HttpEventType.Response) {
          this.message = event.body.message;
          this.fileDetails = this.uploadService.getFiles();
        }
      },
      () => {
        this.progress = 0;
        this.message = 'Could not upload file';
        this.currentFile = null;
        return of([]);
      }
    );
    this.selectedFiles = null;
  }
}
