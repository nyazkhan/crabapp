import { Component, OnInit, Inject } from '@angular/core';
import { PhotoService } from 'src/app/service/photo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  currentImage: any;

  constructor(
    public photoService: PhotoService,
    @Inject(Router) private router: Router) { }

  ngOnInit() {
    this.photoService.loadSaved();
  }

}
