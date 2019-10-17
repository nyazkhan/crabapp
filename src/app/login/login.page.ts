import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
// import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  phoneNo = '';
  error: any;

  // @ViewChild('recaptchacontainer', { static: false }) recaptcha: ElementRef;
  varificationId: any;


  public recaptchaVerifier: firebase.auth.RecaptchaVerifier; recaptchaWidgetId: any;
  confirmationResult: firebase.auth.ConfirmationResult;
  isApp: boolean;
  otp: number;
  phone: string;
  constructor(
    @Inject(AngularFireAuth) public angularFire: AngularFireAuth,
    // private fireAuth: FirebaseAuthentication,
    @Inject(Router) private router: Router,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController) {


    // this.angularFire.onAuthStateChanged().subscribe((user) => {
    //   if (user) {
    //     // User is signed in.
    //     const uid = user.uid;
    //     const email = user.email;
    //     const photoURL = user.photoURL;
    //     const phoneNumber = user.phoneNumber;
    //     const isAnonymous = user.isAnonymous;
    //     const displayName = user.displayName;
    //     const providerData = user.providerData;
    //     const emailVerified = user.emailVerified;
    //   }

    // });



  }

  // send() {
  //   const tell = '+91' + this.phone;
  //   (<any> window).FirebasePlugin.verifyPhoneNumber(tell, 60, (credential) => {
  //     console.log(credential);
  //     this.verificationId = credential.verificationId;
  //   }, (error) => {
  //     console.error(error);
  //     alert(error);
  //    });
  // }

  // verify() {
  //   const signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.code);
  //   firebase.auth().signInWithCredential(signInCredential).then((info) => {
  //     console.log(info);
  //     // this.navCtrl.navigateRoot('/home');
  //   }, (error) => {
  //     console.log(error);
  //   });
  //   }


  // login() {
  //   this.firebaseAuthentication.verifyPhoneNumber('+919017697290', 30000).then((varificationId) => {
  //     this.varificationId = varificationId;
  //   }).catch((error) => {

  //   });
  // }

  // signInWhitOTP() {
  //   this.firebaseAuthentication.signInWithVerificationId(this.varificationId, this.otp).then((res) => {

  //   }).catch((error) => {

  //   });
  // }


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
  onSignInSubmit() {
    console.log('its call');
    const appVerifier = this.recaptchaVerifier;
    this.angularFire.auth.settings.appVerificationDisabledForTesting = true;
    // this.recaptchaVerifier.verify().then((widgetId) => {
    //   // this.recaptchaWidgetId =
    //   console.log(widgetId);
    // });
    this.angularFire.auth.signInWithPhoneNumber('+' + this.phoneNo, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.confirmationResult = confirmationResult;
        const code = window.prompt('Please enter your code');
        return confirmationResult.confirm(code);


      }).then(() => {

      }).catch((error) => {
        // Error; SMS not sent
        // ...
        console.log('wrong opt');

      });
  }
  ionViewDidEnter() {
    // this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    //   'size': 'invisible', 'callback': (response) => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     this.onSignInSubmit();
    //   }
    // });
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha',
      {
        size: 'invisible', callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log(response);

          this.onSignInSubmit();
        }
      });

    // [END appVerifier]
    // this.recaptchaVerifier.clear();
    // verify().then((widgetId) => {
    //   // this.recaptchaWidgetId =
    //   console.log(widgetId);
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

  login() {

  }
}
