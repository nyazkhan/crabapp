import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
// import { AngularFireAuth } from '@angular/fire/auth';
// import * as firebase from 'firebase';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  phoneNo = '9017697290';
  error: any;

  // @ViewChild('recaptchacontainer', { static: false }) recaptcha: ElementRef;
  varificationId: any;


  // public recaptchaVerifier: firebase.auth.RecaptchaVerifier; recaptchaWidgetId: any;
  // confirmationResult: firebase.auth.ConfirmationResult;
  isApp: boolean;
  otp: number;
  phone: string;
  code: string;

  otpSend = false;
  constructor(
    // @Inject(AngularFireAuth) public angularFire: AngularFireAuth,
    @Inject(FirebaseAuthentication) public firebaseAuthentication: FirebaseAuthentication,
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




  login() {
    this.otpSend = true;
    this.firebaseAuthentication.verifyPhoneNumber('+91' + this.phoneNo, 60000)
      .then((varificationId) => {
        this.varificationId = varificationId;
      }).catch((error) => {
        this.otpSend = false;
      });
  }

  signInWhitOTP() {
    this.firebaseAuthentication.signInWithVerificationId(this.varificationId, this.otp).then((res) => {
      // tslint:disable-next-line: no-unused-expression
      this.router.navigate[('googlemap')];
    }).catch((error) => {

    });
  }


  phoneValidation(no) {
    const regExp = /^[0-9]{10}$/;

    if (!regExp.test(no)) {
      this.error = ' Please enter a valid Phone No';
      return { invalidMobile: true };
    }
    console.log('invalidno');
    this.error = null;

    return null;
  }

  resendOtp() {
    this.router.navigate(['/googlemap']);
  }

  // onSignInSubmit() {
  //   console.log('its call');
  //   const appVerifier = this.recaptchaVerifier;
  //   this.angularFire.auth.settings.appVerificationDisabledForTesting = true;

  //   this.angularFire.auth.signInWithPhoneNumber('+' + this.phoneNo, appVerifier)
  //     .then((confirmationResult) => {
  //       // SMS sent. Prompt user to type the code from the message, then sign the
  //       // user in with confirmationResult.confirm(code).
  //       this.confirmationResult = confirmationResult;
  //       const code = window.prompt('Please enter your code');
  //       return confirmationResult.confirm(code);


  //     }).then(() => {

  //     }).catch((error) => {
  //       // Error; SMS not sent
  //       // ...
  //       console.log('wrong opt');

  //     });
  // }
  // ionViewDidEnter() {

  //   this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha',
  //     {
  //       size: 'invisible', callback: (response) => {
  //         // reCAPTCHA solved, allow signInWithPhoneNumber.
  //         console.log(response);

  //         this.onSignInSubmit();
  //       }
  //     });

  //   // [END appVerifier]
  //   // this.recaptchaVerifier.clear();
  //   // verify().then((widgetId) => {
  //   //   // this.recaptchaWidgetId =
  //   //   console.log(widgetId);
  //   // });
  // }
  // async presentToast(Message, showbutton, Position, Duration) {
  //   const toast = await this.toastController.create({
  //     message: Message,
  //     showCloseButton: showbutton,
  //     position: Position,
  //     duration: Duration
  //   });
  //   toast.present();
  // }
  ngOnInit() {

  }

  // login() {

  // }
}
