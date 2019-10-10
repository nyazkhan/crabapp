import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  phoneNo = '';
  error: any;




  recaptchaVerifier: any;
  recaptchaWidgetId: any;
  confirmationResult: firebase.auth.ConfirmationResult;
  constructor(
    @Inject(AngularFireAuth) private firebaseAuth: AngularFireAuth,
    @Inject(Router) private router: Router,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController) {


    this.firebaseAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        const uid = user.uid;
        const email = user.email;
        const photoURL = user.photoURL;
        const phoneNumber = user.phoneNumber;
        const isAnonymous = user.isAnonymous;
        const displayName = user.displayName;
        const providerData = user.providerData;
        const emailVerified = user.emailVerified;
      }

    });



  }


  async openLoader() {
    const loading = await this.loadingController.create({
      message: 'Please Wait ...',
      duration: 2000
    });
    await loading.present();
  }
  async closeLoading() {
    return await this.loadingController.dismiss();
  }

  login() {

  }
  onSignInSubmit() {
    console.log('its call');
    const appVerifier = this.recaptchaVerifier;
    this.firebaseAuth.auth.signInWithPhoneNumber('+' + this.phoneNo, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.confirmationResult = confirmationResult;
        return confirmationResult.confirm('908777');

        console.log(this.confirmationResult);

      }).catch((error) => {
        // Error; SMS not sent
        // ...
      });
  }
  ionViewDidEnter() {
    // this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    //   'size': 'invisible', 'callback': (response) => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     this.onSignInSubmit();
    //   }
    // });
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

    // [END appVerifier]
    // this.recaptchaVerifier.render().then((widgetId) => {
    //   this.recaptchaWidgetId = widgetId;
    // });
  }
  async presentToast(Message, showbutton, Position, Duration) {
    const toast = await this.toastController.create({
      message: Message,
      showCloseButton: showbutton,
      position: Position,
      duration: Duration
    });
    toast.present();
  }
  ngOnInit() {

  }

}
