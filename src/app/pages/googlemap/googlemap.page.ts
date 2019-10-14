
import { Component, NgZone, ElementRef, ViewChild, Inject, AfterViewInit, OnInit } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
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
  autocomplete;
  MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';




  input: any;
  constructor(
    @Inject(Geolocation) public geolocation: Geolocation) { }

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

      };
      this.initAutocomplete();
    }, (err) => {
      alert('err ' + err);
    });


  }



  initAutocomplete() {




    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);

    // Create the search box and link it to the UI element.
    this.input = document.getElementById('autocomplete');

    const searchBox = new google.maps.places.SearchBox(document.getElementById('autocomplete'), {
      types: ['(restaurant)'], componentRestrictions: { country: 'In' }
    });
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.input);

    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });
    // searchBox.setComponentRestrictions(}{ 'country': 'in' );
    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      console.log(places);

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
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
      this.map.fitBounds(bounds);
    });
  }























  loadMap() {

    this.geolocation.getCurrentPosition().then((position) => {

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(position);

      this.mapOptions = {
        center: this.latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,

      };
      this.initMap();
      // googleMaps.event.addListenerOnce(map, 'idle', () => {
      //     mapEle.classList.add('show-map');
      //   });
      // this.initAutocomplete();
    }, (err) => {
      alert('err ' + err);
    });

  }


  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);



    this.autocomplete = new google.maps.places.Autocomplete(
        // tslint:disable-next-line: no-redundant-jsdoc
        /** @type {!HTMLInputElement} */(
        document.getElementById('autocomplete'), { type: ['(cities)'] }));
    // console.log(this.autocomplete.getPlace());

    this.autocomplete.setComponentRestrictions({ 'country': 'in' });
    this.autocomplete.addListener('place_changed', () => {
      // this.infowindow.close();
      // this.marker.setVisible(false);
      this.clearMarkers();
      this.createMarker(this.autocomplete.getPlace());
    });
    // this.autocomplete.setFields(['address_component']);

    this.places = new google.maps.places.PlacesService(this.map);
    // this.search();

    // Add a DOM event listener to react when the user selects a country.
    // document.getElementById('country').addEventListener(
    //   'change', this.setAutocompleteCountry);
  }
  ngOnInit() {
  }

  // onPlaceChanged() {
  //   const place = this.autocomplete.getPlace();
  //   console.log(place);

  //   if (place.geometry) {
  //     this.map.panTo(place.geometry.location);
  //     this.map.setZoom(15);
  //     this.search();
  //   } else {
  //     // document.getElementById('autocomplete').placeholder = 'Enter a city';
  //   }
  // }

  // search() {
  //   console.log(this.latLng);
  //   const search = {
  //     location: this.latLng,

  //     radius: 5500,
  //     // bounds: this.map.getBounds(),
  //     types: ['restaurant', 'bar', 'cafe', 'casino', 'bakery']
  //   };

  //   this.places.nearbySearch(search, (results, status) => {

  //     this.callback(results, status);
  //     // if (status === google.maps.places.PlacesServiceStatus.OK) {
  //     //   this.clearResults();
  //     //   this.clearMarkers();
  //     //   // Create a marker for each hotel found, and
  //     //   // assign a letter of the alphabetic to each marker icon.
  //     //   for (let i = 0; i < results.length; i++) {
  //     //     const markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  //     //     const markerIcon = this.MARKER_PATH + markerLetter + '.png';
  //     //     // Use marker animation to drop the icons incrementally on the map.
  //     //     this.markers[i] = new google.maps.Marker({
  //     //       position: results[i].geometry.location,
  //     //       animation: google.maps.Animation.DROP,
  //     //       icon: markerIcon
  //     //     });
  //     //     // If the user clicks a hotel marker, show the details of that hotel
  //     //     // in an info window.
  //     //     this.markers[i].placeResult = results[i];
  //     //     google.maps.event.addListener(this.markers[i], 'click', this.showInfoWindow());
  //     //     setTimeout(this.dropMarker(i), i * 100);
  //     //     this.addResult(results[i], i);
  //     //   }
  //     // }
  //   });
  // }


  // callback(results, status) {
  //   if (status === google.maps.places.PlacesServiceStatus.OK) {
  //     for (let i = 0; i < results.length; i++) {
  //       this.createMarker(results[i]);
  //     }
  //   }
  // }

  createMarker(place) {
    const placeLoc = place;
    console.log('placeLoc', placeLoc);
    this.markers = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });

    this.infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(this.markers, 'click', () => {
      // this.ngZone.run(() => {
      this.infoWindow.setContent(place.name);
      this.infoWindow.open(this.map, this.markers);
    });
    // });
  }




  clearMarkers() {
    console.log('elete marker');

    for (let i = 0; i < this.markers.length; i++) {
      if (this.markers[i]) {
        this.markers[i].setMap(null);
      }
    }
    this.markers = [];
  }


  // dropMarker(i) {
  //   return () => { this.markers[i].setMap(this.map); };
  // }

  // addResult(result, i) {
  //   const results = document.getElementById('results');
  //   const markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  //   const markerIcon = this.MARKER_PATH + markerLetter + '.png';

  //   const tr = document.createElement('tr');
  //   tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
  //   tr.onclick = () => {
  //     // google.maps.event.trigger(this.markers[i], 'click');
  //   };

  //   const iconTd = document.createElement('td');
  //   const nameTd = document.createElement('td');
  //   const icon = document.createElement('img');
  //   icon.src = markerIcon;
  //   icon.setAttribute('class', 'placeIcon');
  //   icon.setAttribute('className', 'placeIcon');
  //   const name = document.createTextNode(result.name);
  //   iconTd.appendChild(icon);
  //   nameTd.appendChild(name);
  //   tr.appendChild(iconTd);
  //   tr.appendChild(nameTd);
  //   results.appendChild(tr);
  // }

  // clearResults() {
  //   const results = document.getElementById('results');
  //   while (results.childNodes[0]) {
  //     results.removeChild(results.childNodes[0]);
  //   }
  // }

  // // Get the place details for a hotel. Show the information in an info window,
  // // anchored on the marker for the hotel that the user selected.
  // showInfoWindow() {
  //   const marker: any = this;
  //   this.places.getDetails({ placeId: marker.placeResult.place_id },
  //     function (place, status) {
  //       if (status !== google.maps.places.PlacesServiceStatus.OK) {
  //         return;
  //       }
  //       this.infoWindow.open(this.map, marker);
  //       this.buildIWContent(place);
  //     });
  // }

}
