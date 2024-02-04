import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  uploadBlob(blob: Blob) {
    const formData: FormData = new FormData();
    formData.append('file', blob, 'filename.png');
    console.log('uploadBlob', blob);
    return this.http.post(`${this.baseUrl}/uploadFile`, formData).subscribe(
      (res) => console.log('res', res),
      (err) => console.log('err', err)
    );
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const request = new HttpRequest(
      'POST',
      `${this.baseUrl}/uploadFile`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );
    console.log('upload', file, request, formData);
    return this.http.request(request);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
