import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css'],
})
export class ImageCropperComponent implements AfterViewInit {
  title = 'my-image-cropper';
  @ViewChild('myInput') myInputVariable!: ElementRef;
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  image!: Blob;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  progress: number = 0;
  message: string = '';
  fileDetails!: Observable<any>;

  constructor(
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService
  ) {}

  ngAfterViewInit(): void {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log('imageCropped', event);

    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
    this.image = event.blob!;
    // event.blob can be used to upload the cropped image
  }
  uploadBlob() {
    this.uploadService.uploadBlob(this.image);
  }
  imageLoaded() {
    this.showCropper = true;
  }
  cropperReady(sourceImageDimensions: Dimensions) {
    // cropper ready
    console.log('Cropper ready', sourceImageDimensions);
  }
  loadImageFailed() {
    // show message
    console.log('Load failed');
  }

  clear() {
    this.croppedImage = '';
    this.imageChangedEvent = '';
    this.myInputVariable.nativeElement.value = '';
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }
}
