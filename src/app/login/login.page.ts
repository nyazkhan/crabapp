import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
// import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
// import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AlertService } from '../service/alert.service';
import { ThrowStmt } from '@angular/compiler';

export interface User {
  uid: string;

  phone: number;
  email: string;
  emailVerified: string
}
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  phoneNo = '';
  error: any;

  @ViewChild('recaptchacontainer', { static: false }) recaptcha: ElementRef;
  varificationId: any;
  recaptchaVerifier: any;

  // public recaptchaVerifier: firebase.auth.RecaptchaVerifier; recaptchaWidgetId: any;
  confirmationResult: firebase.auth.ConfirmationResult;
  isApp: boolean;
  otp: string;
  phone: string;
  code: string;

  otpSend = false;
  timmerCountOtp: number;
  constructor(
    @Inject(AngularFireAuth) public angularFire: AngularFireAuth,
    // @Inject(FirebaseAuthentication) public firebaseAuthentication: FirebaseAuthentication,
    @Inject(AlertService) private alertService: AlertService,
    @Inject(Router) private router: Router,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    @Inject(AngularFirestore) public afs: AngularFirestore,   // Inject Firestore service
  ) {

    this.otpSend = false;

    this.angularFire.authState.subscribe((user) => {
      if (user) {
        // User is signed in.
        console.log(user);
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/googlemap'], { queryParams: { user: user.uid } });

      } else {
        localStorage.setItem('user', null);

      }

    }, (error) => {
      console.log(error);

    });



  }




  // login() {
  //   const no = '+91' + this.phoneNo;
  //   this.firebaseAuthentication.verifyPhoneNumber(no, 30000)
  //     .then((varificationId) => {
  //       this.varificationId = varificationId;
  //       console.log(varificationId);
  //       this.otpSend = true;
  //       this.timeInterval();
  //     }).catch((error) => {
  //       this.otpSend = false;
  //     });
  // }

  // signInWhitOTP() {
  //   this.firebaseAuthentication.signInWithVerificationId(this.varificationId, this.otp).then((res) => {
  //     // tslint:disable-next-line: no-unused-expression
  //     this.router.navigate[('googlemap')];
  //   }).catch((error) => {

  //   });
  // }


  phoneValidation() {
    const regExp = /^\d{9,11}$/;
    console.log(this.phoneNo);

    if (!regExp.test(this.phoneNo)) {
      this.error = ' Please enter a valid Phone No';
      console.log(this.error);

      return { invalidMobile: true };
    }
    console.log('invalidno');
    this.error = null;
    console.log(this.error);

    return null;
  }

  resendOtp() {
    this.router.navigate(['/googlemap']);
  }



  timeInterval() {
    let timeleft = 0;
    const downloadTimer = setInterval(() => {
      this.timmerCountOtp = 0 + timeleft;
      timeleft += 1;
      if (timeleft >= 60) {
        clearInterval(downloadTimer);
      }
    }, 1000);
  }
  onSignInSubmit() {
    console.log('its call');
    this.alertService.showLoader('OTP sending..');
    const appVerifier = this.recaptchaVerifier;
    const no = '+91' + this.phoneNo;
    this.angularFire.auth.signInWithPhoneNumber(no, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.confirmationResult = confirmationResult;
        // const code = window.prompt('Please enter your code');
        // return confirmationResult.confirm(code);
        this.otpSend = true;
        this.alertService.closeLoader();


      }).catch((error) => {
        // Error; SMS not sent
        // ...
        this.alertService.closeLoader();

        // appVerifier.verify();
        appVerifier.reset();
        this.otpSend = false;
        this.alertService.showErrorAlert(error.code);
        console.log(error);
        // this.router.navigate(['/login']);

      });
  }

  isValidNumber(event) {
    console.log(/\d|Backspace/.test(event.key));

    return /\d|Backspace/.test(event.key);

  }
  otpSummit() {
    this.alertService.showLoader(' Verifying OTP ..');

    this.confirmationResult.confirm(this.otp).then((result) => {
      // User signed in successfully.
      console.log(result.user);
      this.SetUserData(result.user).then(() => {
        this.alertService.closeLoader();

        this.router.navigate(['/googlemap'], { queryParams: { user: result.user.uid } });
      });
      // ...

      // this.router.navigate(['/googlemap']);

    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
      this.alertService.closeLoader();
      this.alertService.showErrorAlert('wrong OTP ');
    });
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {

      uid: user.uid,
      phone: user.phoneNumber,
      emailVerified: user.emailVerified,
      email: user.email,

    };
    return userRef.set(userData, {
      merge: true
    });
  }

  ionViewDidEnter() {
    // this.angularFire.auth.settings.appVerificationDisabledForTesting = true;

    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha',
      {
        size: 'invisible', callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          this.onSignInSubmit();
        }, 'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
          console.log('wrong no error');

        }
      });


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

  async presentAlert(mesg) {
    const alert = await this.alertController.create({
      header: 'ERROR',
      // subHeader: 'Subtitle',
      message: mesg,
      buttons: ['OK']
    });

    await alert.present();
  }



  signOut() {
    this.angularFire.auth.signOut().then(() => {
      // Sign-out successful.
      this.router.navigate(['/login']);
    }).catch((error) => {
      // An error happened.
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.otpSend = false;
  }
}
