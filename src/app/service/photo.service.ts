import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  constructor(private camera: Camera, private storage: Storage) { }

  takePicture() {
    const options: CameraOptions = {
      // quality: 50,
      // destinationType: this.camera.DestinationType.DATA_URL,
      // encodingType: this.camera.EncodingType.PNG,
      // mediaType: this.camera.MediaType.PICTURE
      // destinationType: this.camera.DestinationType.FILE_URI,
      // sourceType: sourceType,
      // mediaType: this.camera.MediaType.PICTURE,
      // encodingType: this.camera.EncodingType.JPEG,
      // saveToPhotoAlbum: (source === PictureSource.CAMERA),
      quality: 100,
      // sourceType: this.camera.PictureSourceType.,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 400,
      targetHeight: 400,
      allowEdit: true
    };

    this.camera.getPicture(options).then((imageData) => {
      // Add new photo to gallery
      this.photos.unshift({
        data: 'data:image/jpeg;base64,' + imageData
      });

      // Save all photos for later viewing
      this.storage.set('photos', this.photos);
    }, (err) => {
      // Handle error
      console.log('Camera issue: ' + err);
    });

  }

  removePicture(data) {
    this.photos.splice(this.photos.indexOf(data), 1);
    this.storage.set('photos', this.photos);
    console.log('remove');

    this.loadSaved();
  }

  loadSaved() {
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
    });
  }

}

class Photo {
  data: any;
}
