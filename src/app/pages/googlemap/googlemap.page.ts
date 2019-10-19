import { Component, NgZone, ElementRef, ViewChild, Inject, AfterViewInit, OnInit } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { PopoverController, LoadingController } from '@ionic/angular';
import { CommanService } from 'src/app/service/comman.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
// import { PopoverPage } from './address-popover/address-popover';
// import { RestaurentAddress } from 'src/app/class/restaurent';
declare const google: any;
@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.page.html',
  styleUrls: ['./googlemap.page.scss'],
})
export class GooglemapPage implements OnInit {

  @ViewChild('map', { static: true }) mapElement: ElementRef;

  map: any;
  latLng: any;

  mapOptions: any;

  places;
  infoWindow;
  markers: any = [];

  MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
  address: any = {};
  // = {
  //   address: '',
  //   locality: '',
  //   landMark: '',
  //   state: '',
  //   city: '',
  //   distic: '',
  //   country: '',
  //   pincode: null,
  // };

  addressForm;

  componentForm = {
    street_number: 'long_name',
    sublocality_level_1: 'long_name',
    sublocality_level_2: 'long_name',
    sublocality_level_3: 'long_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'long_name',
    country: 'long_name',
    postal_code: 'short_name'
  };
  restaurentDetails: any = [];

  input: any;
  constructor(
    @Inject(Geolocation) public geolocation: Geolocation,
    public popoverCtrl: PopoverController,
    public loadingController: LoadingController,
    @Inject(CommanService) public commanService: CommanService,
    @Inject(AngularFirestore) public firestore: AngularFirestore,
    @Inject(Router) private router: Router,

  ) {
  }

  // tslint:disable-next-line: use-lifecycle-interface
  async ngAfterViewInit() {
    // this.loadMap();
    this.geolocation.getCurrentPosition().then((position) => {

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(position);

      this.mapOptions = {
        center: this.latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: false,
        // scaleControl: false,
        fullscreenControl: false
      };

      this.initAutocomplete();
    }, (err) => {
      console.log(err);

    });


  }



  initAutocomplete() {




    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

    // Create the search box and link it to the UI element.
    this.input = document.getElementById('autocomplete');

    const searchBox = new google.maps.places.SearchBox(document.getElementById('autocomplete'), {
      types: ['(restaurant)'], componentRestrictions: { country: 'In' }
    });
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.input);

    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });
    // searchBox.setComponentRestrictions(}{ 'country': 'in' );
    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      this.restaurentDetails = [];

      const places = searchBox.getPlaces();
      this.restaurentDetails = places[0];
      console.log(places);
      if (places.length === 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();


      // Get each component of the address from the place details,
      // and then fill-in the corresponding field on the form.

      for (let i = 0; i < places[0].address_components.length; i++) {
        const addressType = places[0].address_components[i].types[0];
        if (this.componentForm[addressType]) {
          console.log(places[0].address_components[i][this.componentForm[addressType]]);

          if (addressType === 'postal_code') {
            this.address.pincode = places[0].address_components[i][this.componentForm[addressType]] || '';

          }


          if (addressType === 'country') {
            this.address.country = places[0].address_components[i][this.componentForm[addressType]] || '';

          }



          if (addressType === 'administrative_area_level_1') {
            this.address.state = places[0].address_components[i][this.componentForm[addressType]] || '';

          }



          if (addressType === 'locality') {
            this.address.distic = places[0].address_components[i][this.componentForm[addressType]] || '';

          }

          if (addressType === 'street_number') {
            this.address.address = places[0].address_components[i][this.componentForm[addressType]] || '';

          }
          if (addressType === 'route') {
            this.address.landMark = places[0].address_components[i][this.componentForm[addressType]] || '';

          }

          if (addressType === 'neighborhood') {
            this.address.landMark += '  ' + places[0].address_components[i][this.componentForm[addressType]] || '';

          }
          if (addressType === 'sublocality_level_3') {
            this.address.locality = places[0].address_components[i][this.componentForm[addressType]] || '';

          }



          if (addressType === 'sublocality_level_2') {
            this.address.locality += '  ' + places[0].address_components[i][this.componentForm[addressType]];

          }



          if (addressType === 'sublocality_level_1') {
            this.address.city = places[0].address_components[i][this.componentForm[addressType]];

          }

        }
      }
      this.address.address = places[0].vicinity;

      console.log(this.address);
      console.log(this.restaurentDetails);






      places.forEach((place) => {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }
        const Icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: this.map,
          icon: Icon,
          title: place.name,
          position: place.geometry.location
        }));
        const infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(markers, 'click', () => {
          // this.ngZone.run(() => {
          infoWindow.setContent(place.name);
          infoWindow.open(this.map, markers);
        });
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.changeMapHieght('50vh');

      this.map.fitBounds(bounds);
    });

  }

  ngOnInit() {
  }


  changeMapHieght(val) {

    (document.getElementById('map') as HTMLInputElement).style.height = val;

  }







  gotoWelcomPage(val) {
    console.log(val.value);
    // tslint:disable-next-line: no-string-literal
    this.restaurentDetails['customAddress'] = this.address;
    JSON.parse(JSON.stringify(this.restaurentDetails));
    this.firestore.collection('Restaurent').add(JSON.parse(JSON.stringify(this.restaurentDetails))).then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
      this.router.navigate(['/welcome'], { queryParams: { restaurent: docRef.id } });

    }).catch((error) => {
      // this.alertService.showInfoAlert('Error adding document: ');
      console.log(error);

    });
    // }
  }














}




// function getGoogleMaps(apiKey: string): Promise<any> {
//   const win = window as any;
//   const googleModule = win.google;
//   if (googleModule && googleModule.maps) {
//     return Promise.resolve(googleModule.maps);
//   }

//   return new Promise((resolve, reject) => {
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.31`;
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);
//     script.onload = () => {
//       const googleModule2 = win.google;
//       if (googleModule2 && googleModule2.maps) {
//         resolve(googleModule2.maps);
//       } else {
//         reject('google maps not available');
//       }
//     };
//   });
// }