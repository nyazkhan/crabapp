import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  // Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  // Uploaded Image List
  images: Observable<MyData[]>;

  private imageCollection: AngularFirestoreCollection<MyData>;

  public photos: Photo[] = [];
  // File details  
  fileName: string;
  fileSize: number;

  // Status check 
  isUploading: boolean;
  isUploaded: boolean;


  constructor(private camera: Camera, private database: AngularFirestore, private storage1: AngularFireStorage, private storage: Storage) {
    this.isUploading = false;
    this.isUploaded = false;
    // Set collection where our documents/ images info will save

    this.imageCollection = this.database.collection<MyData>('restaurantImages');
    this.images = this.imageCollection.valueChanges();
  }

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


  uploadFile(event: FileList) {


    // The File object
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path
    const path = `freakyStorage/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Restaurent Image Upload ' };

    // File reference
    const fileRef = this.storage1.ref(path);

    // The main task
    this.task = this.storage1.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();

        this.UploadedFileURL.subscribe(resp => {
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        });
      }),
      tap(snap => {
        this.fileSize = snap.totalBytes;
      })
    );
  }

  addImagetoDB(image: MyData) {
    // Create an ID for document
    const id = this.database.createId();

    // Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log('error ' + error);
    });
  }
}

class Photo {
  data: any;
}
