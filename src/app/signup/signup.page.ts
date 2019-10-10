import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor() { }
  ngOnInit() {

  }
  // ngOnInit() {
  //   onSignInSubmit() {
  //     if (this.isPhoneNumberValid()) {
  //       window.signingIn = true;
  //       this.updateSignInButtonUI();
  //       const phoneNumber = this.getPhoneNumberFromUserInput();
  //       const appVerifier = window.recaptchaVerifier;
  //       this.firebase.auth.signInWithPhoneNumber(phoneNumber, appVerifier)
  //         .then((confirmationResult) => {
  //           // SMS sent. Prompt user to type the code from the message, then sign the
  //           // user in with confirmationResult.confirm(code).
  //           window.confirmationResult = confirmationResult;
  //           window.signingIn = false;
  //           this.updateSignInButtonUI();
  //           this.updateVerificationCodeFormUI();
  //           this.updateVerifyCodeButtonUI();
  //           this.updateSignInFormUI();
  //         }).catch((error) => {
  //           // Error; SMS not sent
  //           console.error('Error during signInWithPhoneNumber', error);
  //           window.alert('Error during signInWithPhoneNumber:\n\n'
  //             + error.code + '\n\n' + error.message);
  //           window.signingIn = false;
  //           this.updateSignInFormUI();
  //           this.updateSignInButtonUI();
  //         });
  //     }
  //   }
  //   /**
  //    * Function called when clicking the "Verify Code" button.
  //    */
  //   onVerifyCodeSubmit(e) {
  //     e.preventDefault();
  //     if (!!this.getCodeFromUserInput()) {
  //       window.verifyingCode = true;
  //       this.updateVerifyCodeButtonUI();
  //       var code = this.getCodeFromUserInput();
  //       confirmationResult.confirm(code).then((result) => {
  //         // User signed in successfully.
  //         const user = result.user;
  //         window.verifyingCode = false;
  //         window.confirmationResult = null;
  //         this.updateVerificationCodeFormUI();
  //       }).catch((error) => {
  //         // User couldn't sign in (bad verification code?)
  //         console.error('Error while checking the verification code', error);
  //         window.alert('Error while checking the verification code:\n\n'
  //           + error.code + '\n\n' + error.message);
  //         window.verifyingCode = false;
  //         this.updateSignInButtonUI();
  //         this.updateVerifyCodeButtonUI();
  //       });
  //     }
  //   }
  //   /**
  //    * Cancels the verification code input.
  //    */
  //   cancelVerification(e) {
  //     e.preventDefault();
  //     window.confirmationResult = null;
  //     this.updateVerificationCodeFormUI();
  //     this.updateSignInFormUI();
  //   }
  //   /**
  //    * Signs out the user when the sign-out button is clicked.
  //    */
  //   onSignOutClick() {
  //     this.firebase.auth.signOut();
  //   }
  //   /**
  //    * Reads the verification code from the user input.
  //    */
  //   getCodeFromUserInput() {
  //     return document.getElementById('verification-code').value;
  //   }
  //   /**
  //    * Reads the phone number from the user input.
  //    */
  //   getPhoneNumberFromUserInput() {
  //     return document.getElementById('phone-number').value;
  //   }
  //   /**
  //    * Returns true if the phone number is valid.
  //    */
  //   isPhoneNumberValid() {
  //     const pattern = /^\+[0-9\s\-\(\)]+$/;
  //     const phoneNumber = this.getPhoneNumberFromUserInput();
  //     return phoneNumber.search(pattern) !== -1;
  //   }
  //   /**
  //    * Re-initializes the ReCaptacha widget.
  //    */
  //   resetReCaptcha() {
  //     if (typeof grecaptcha !== 'undefined'
  //       && typeof window.recaptchaWidgetId !== 'undefined') {
  //       grecaptcha.reset(window.recaptchaWidgetId);
  //     }
  //   }
  //   /**
  //    * Updates the Sign-in button state depending on ReCAptcha and form values state.
  //    */
  //   updateSignInButtonUI() {
  //     document.getElementById('sign-in-button').disabled =
  //       !this.isPhoneNumberValid()
  //       || !!window.signingIn;
  //   }
  //   /**
  //    * Updates the Verify-code button state depending on form values state.
  //    */
  //   updateVerifyCodeButtonUI() {
  //     document.getElementById('verify-code-button').disabled =
  //       !!window.verifyingCode
  //       || !this.getCodeFromUserInput();
  //   }
  //   /**
  //    * Updates the state of the Sign-in form.
  //    */
  //   updateSignInFormUI() {
  //     if (this.firebase.auth.currentUser || window.confirmationResult) {
  //       document.getElementById('sign-in-form').style.display = 'none';
  //     } else {
  //       this.resetReCaptcha();
  //       document.getElementById('sign-in-form').style.display = 'block';
  //     }
  //   }
  //   /**
  //    * Updates the state of the Verify code form.
  //    */
  //   updateVerificationCodeFormUI() {
  //     if (!this.firebase.auth.currentUser && window.confirmationResult) {
  //       document.getElementById('verification-code-form').style.display = 'block';
  //     } else {
  //       document.getElementById('verification-code-form').style.display = 'none';
  //     }
  //   }
  //   /**
  //    * Updates the state of the Sign out button.
  //    */
  //   updateSignOutButtonUI() {
  //     if (this.firebase.auth.currentUser) {
  //       document.getElementById('sign-out-button').style.display = 'block';
  //     } else {
  //       document.getElementById('sign-out-button').style.display = 'none';
  //     }
  //   }
  //   /**
  //    * Updates the Signed in user status panel.
  //    */
  //   updateSignedInUserStatusUI() {
  //     const user = this.firebase.auth.currentUser;
  //     if (user) {
  //       document.getElementById('sign-in-status').textContent = 'Signed in';
  //       document.getElementById('account-details').textContent = JSON.stringify(user, null, '  ');
  //     } else {
  //       document.getElementById('sign-in-status').textContent = 'Signed out';
  //       document.getElementById('account-details').textContent = 'null';
  //     }
  //   }
  // }

}
