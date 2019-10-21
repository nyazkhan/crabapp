import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  constructor(private camera: Camera, private storage: Storage) { }

  takePicture(options) {


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

  takePictureFromGalry() {
    const options: CameraOptions = {
      quality: 60,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 400,
      targetHeight: 400,
      allowEdit: true
    };
    this.takePicture(options);
  }
  takePictureFromCamera() {
    const options: CameraOptions = {
      quality: 60,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 400,
      targetHeight: 400,
      allowEdit: true
    };
    this.takePicture(options);
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
