import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { IonSlides, AlertController } from '@ionic/angular';
import { PhotoService } from 'src/app/service/photo.service';
import { AlertService } from 'src/app/service/alert.service';
import { AngularFireAuth } from '@angular/fire/auth';
declare const $: any;
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  curentDay = 0;


  slidesOpts = {
    pagination: false,
    // onlyExternal: false,
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}flip`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.originalParams = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { $, slides, rtlTranslate: rtl } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let progress = $slideEl[0].progress;
          if (swiper.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          }
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          const rotate = -180 * progress;
          let rotateY = rotate;
          let rotateX = 0;
          let tx = -offset$$1;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
            rotateX = -rotateY;
            rotateY = 0;
          } else if (rtl) {
            rotateY = -rotateY;
          }

          $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

          if (swiper.params.flipEffect.slideShadows) {
            // Set shadows
            let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) { shadowBefore[0].style.opacity = Math.max(-progress, 0); }
            if (shadowAfter.length) { shadowAfter[0].style.opacity = Math.max(progress, 0); }
          }
          $slideEl
            .transform(`translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, activeIndex, $wrapperEl } = swiper;
        slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          // eslint-disable-next-line
          slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
            if (eventTriggered) { return; }
            if (!swiper || swiper.destroyed) { return; }

            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      }
    }
  };
  RestaurentId: any;
  restaurentDetail: any = {};
  foodType = {
    veg: false,
    nonVeg: false,
    both: true,
    jain: true,
  };
  paymentOption = {
    cash: true,
    credit: false,
    paytm: false,
    upi: true,
  };

  openOn = [

    {
      day: 'Monday',
      isOpen: true,
      open: '',
      close: ''
    },
    {
      day: 'Tuesday',
      isOpen: true,
      open: '',
      close: ''
    },
    {
      day: 'Wednesday',
      isOpen: true,
      open: '',
      close: ''
    },
    {
      day: 'Thursday',
      isOpen: true,
      open: '',
      close: ''
    },
    {
      day: 'Friday',
      isOpen: true,
      open: '',
      close: ''
    },
    {
      day: 'Saturday',
      isOpen: true,
      open: '',
      close: ''
    },
    {
      day: 'Sunday',
      isOpen: true,
      open: '',
      close: ''
    },
  ];

  restType = {
    cafe: false,
    restaurent: true,
    both: false,
  };
  parking = true;
  restCapacity = 10;
  restCost = 50;
  aboutRestaurent: string;
  active: any;

  // openOn: any;
  selectedDayTime: any = {};
  userDetails: any = {};
  email = '';

  constructor(
    public alertController: AlertController,
    public photoService: PhotoService,
    @Inject(AngularFireAuth) public angularFire: AngularFireAuth,
    @Inject(Router) private router: Router,
    @Inject(AngularFirestore) private firestore: AngularFirestore,
    @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute,
    @Inject(AlertService) private alertService: AlertService,

  ) {
    this.subscribeRouteChanges();
    this.alertService.showLoader('Loading...');
  }

  ngOnInit() {
    this.photoService.loadSaved();

    // this.slides.lockSwipes(true);
  }

  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  previous() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }


  subscribeRouteChanges() {

    this.activatedRoute.queryParams
      .subscribe((e: Params) => {
        // tslint:disable-next-line: radix

        console.log(e);

        this.RestaurentId = e.user;
        this.getRestaurentById(this.RestaurentId);


      }, (err: any) => {
        this.router.navigate(['/googlemap']);
      });

  }
  getRestaurentById(id) {
    this.firestore.collection('users').doc(id).get().subscribe(doc => {
      this.alertService.closeLoader();
      console.log(doc.data());
      this.userDetails = doc.data();
      this.restaurentDetail = this.userDetails.Restaurent;

      if (this.restaurentDetail.restType) {

        this.restType = this.restaurentDetail.restType;
      }

      if (this.restaurentDetail.foodType) {

        this.foodType = this.restaurentDetail.foodType;
      }

      if (this.restaurentDetail.paymentOption) {

        this.paymentOption = this.restaurentDetail.paymentOption;
      }

      if ((this.restaurentDetail.parking === false) || (this.restaurentDetail.parking === true)) {

        this.parking = this.restaurentDetail.parking;
      }

      if (this.restaurentDetail.aboutRestaurent) {

        this.aboutRestaurent = this.restaurentDetail.aboutRestaurent;
      }
      if (this.userDetails.email) {

        this.email = this.userDetails.email;
      }
      if (this.restaurentDetail.customOpencloseTimeing) {

        this.openOn = this.restaurentDetail.customOpencloseTimeing;
      }

      if (this.restaurentDetail.restImg) {

        this.photoService.photos = this.restaurentDetail.restImg;
      }

      if (this.restaurentDetail.restCost) {

        this.restCost = this.restaurentDetail.restCost;
      }
      if (this.restaurentDetail.restCapacity) {

        this.restCapacity = this.restaurentDetail.restCapacity;
      }

    }, (error) => {
      this.alertService.showErrorAlert('please select Restaurent Again');
      this.router.navigate(['/googlemap']);
      this.alertService.closeLoader();


    });
  }



  saveFoodType() {
    // tslint:disable-next-line: no-string-literal
    this.restaurentDetail['foodType'] = this.foodType;
    this.next();
  }

  saveRestType() {
    // tslint:disable-next-line: no-string-literal
    this.restaurentDetail['restType'] = this.restType;
    this.next();
  }

  savePaymentType() {
    // tslint:disable-next-line: no-string-literal
    this.restaurentDetail['paymentOption'] = this.paymentOption;
    this.next();
  }

  saveParking() {
    // tslint:disable-next-line: no-string-literal
    this.restaurentDetail['parking'] = this.parking;
    this.next();
  }

  saveAboutRestaurent() {
    // tslint:disable-next-line: no-string-literal
    this.restaurentDetail['aboutRestaurent'] = this.aboutRestaurent;
    this.next();

  }

  SaveRestCapacity() {
    // tslint:disable-next-line: no-string-literal
    this.restaurentDetail['restCapacity'] = this.restCapacity;
    this.next();
  }

  saveCost() {

    // tslint:disable-next-line: no-string-literal
    this.restaurentDetail['restCost'] = this.restCost;
    this.next();
  }


  addClass(val) {
    // tslint:disable-next-line: object-literal-key-quotes

    if (val === 'veg') {
      this.foodType.veg = true;
      this.foodType.nonVeg = false;
      this.foodType.both = false;
      console.log(this.foodType);
      $('#vegColor').css({ 'backgroundColor': '#03fa033d' });

      return;
    }
    if (val === 'nonVeg') {
      this.foodType.veg = false;
      this.foodType.nonVeg = true;
      this.foodType.both = false;
      this.foodType.jain = false;
      console.log(this.foodType);
      $('#vegColor').css({ 'backgroundColor': '#f4433630' });

      return;

    }
    if (val === 'both') {
      this.foodType.veg = false;
      this.foodType.nonVeg = false;
      this.foodType.both = true;
      console.log(this.foodType);
      $('#vegColor').css({ 'backgroundColor': '#f7faba61' });

      return;

    }

  }

  addClassInRestType(val) {
    for (const key in this.restType) {

      if (key === val) {
        this.restType[key] = true;


      } else {

        this.restType[key] = false;
      }


    }
  }

  // for day selection
  selectDays() {
    const days = this.openOn.filter(element => element.isOpen);

    this.selectedDayTime = days[0];
    this.next();
  }


  sendDay(day) {
    delete this.selectedDayTime;

    this.selectedDayTime = day;
  }


  setSametimeForAll(val) {
    if (!val) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.openOn.length; i++) {
        if (this.openOn[i].isOpen) {

          this.openOn[i].open = this.selectedDayTime.open;
          this.openOn[i].close = this.selectedDayTime.close;
        }

      }
    }

  }

  saveOpeningDaysANdTime() {

    // tslint:disable-next-line: no-string-literal
    this.restaurentDetail['customOpencloseTimeing'] = this.openOn;
  }


  checkForRequiredFieldOnDay() {
    let er = 0;
    this.openOn.forEach(element => {
      if ((element.isOpen)) {
        if (((element.open === '') || (element.close === ''))) {
          er++;
        }
      }
    });

    if (er > 0) {
      this.alertService.showErrorAlert('Please Set Time For all Day');

    } else {
      this.next();
      this.saveOpeningDaysANdTime();
    }
  }
  openTime(val) {
    if (val) {
      this.openOn[this.curentDay].open = val;

    }

  }
  closeTime(val) {
    if (val) {
      this.openOn[this.curentDay].close = val;

    }

  }

  showDetails() {
    this.alertService.showLoader('Please Wait Uploading Data ..');

    this.SetUserData().then(() => {
      this.next();
      console.log('goto thanks page');
      this.alertService.closeLoader();
    }, (error) => {
      this.alertService.closeLoader();

    });

  }
  saveImg() {
    this.restaurentDetail['restImg'] = this.photoService.photos;
    this.next();
  }

  SetUserData() {

    // const userDetails = JSON.parse(localStorage.getItem('user'));
    this.userDetails.Restaurent = this.restaurentDetail;
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${this.userDetails.uid}`);

    return userRef.set(JSON.parse(JSON.stringify(this.userDetails)), {
      merge: true
    });
  }

  sendEmailVerifycatioLink() {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: 'https://crab-1.firebaseio.com/finishSignUp?cartId=1234',
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: 'com.flowfreak.crab'
      },
      android: {
        packageName: 'com.flowfreak.crab',
        installApp: true,
        minimumVersion: '12'
      },
      dynamicLinkDomain: 'example.page.link'
    };

    console.log(this.angularFire.auth.currentUser);
    this.SetUserData().then(() => {
      this.angularFire.auth.currentUser.updateEmail(this.email)
        .then(() => {
          this.angularFire.auth.currentUser.sendEmailVerification().then(() => {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            // const win = window.open('https://gmail.com/mail', '_blank');
            // win.focus();
            this.alertService.showInfoAlert('Email Verifycation Link send');
            this.next();
            // window.localStorage.setItem('emailForSignIn', email);
          }, (error) => {
            this.alertService.showInfoAlert(error.message);

          });

        })
        .catch((error) => {
          this.alertService.showInfoAlert(error.message);
          this.logOut();
          // Some error occurred, you can inspect the code: error.code
        });
    }, (error) => {
      this.alertService.showErrorAlert(error);
    });
  }


  isValidEmail() {
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(this.email) == false) {
      // alert('Invalid Email Address');
      return false;
    }

    return true;

  }


  logOut() {
    this.angularFire.auth.signOut().then(() => {
      // Sign-out successful.
      this.router.navigate(['/login']);
    }).catch((error) => {
      // An error happened.
      this.alertService.showErrorAlert(error);
    });
  }

}
