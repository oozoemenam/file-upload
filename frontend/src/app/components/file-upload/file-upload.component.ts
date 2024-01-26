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
  selectedFile: File | null = null;
  progress: number = 0;
  message: string = '';
  fileDetails!: Observable<any>;

  selectedFiles: File[] = [];
  selectedFileNames: string[] = [];
  progressList: any[] = [];
  previews: string[] = [];
  messages: string[] = [];

  constructor(private uploadService: FileUploadService) {
  }

  ngOnInit() {
    this.fileDetails = this.uploadService.getFiles();
  }

  // selectFile(event: Event) {
  //   this.selectedFiles = (event.target as HTMLInputElement).files!;
  // }

  selectFiles(event: any) {
    this.messages = [];
    this.progressList = [];
    this.selectedFileNames = [];
    this.selectedFiles = Array.from(event.target.files);
    this.previews = [];
    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        console.log(event.target.result);
        this.previews.push(event.target.result);
      }
      reader.readAsDataURL(file);
      this.selectedFileNames.push(file.name);
    })
  }

  upload(index: number, file: File) {
    this.progressList[index] = { value: 0, fileName: file.name };
    if (!file) return;
    this.uploadService.upload(file).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressList[index].value = Math.round(100 * event.loaded / event.total!);
        } else if (event.type === HttpEventType.Response) {
          this.messages.push('File upload successful: ' + file.name);
          this.fileDetails = this.uploadService.getFiles();
        }
      },
      () => {
        this.progressList[index].value = 0;
        this.messages.push('Could not upload file: ' + file.name);
      }
    );
    // this.selectedFiles = null;
  }

  uploadFiles() {
    this.messages = [];
    this.selectedFiles.forEach((file, index) => {
      this.upload(index, file);
    })
  }
}
