import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MainPage } from '../main/main';
@Component({
  selector: 'page-review',
  templateUrl: 'review.html'
})

export class ReviewPage {

  current_url: string;
  email:string;
  auth_token:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    public storage: Storage,
    public iab: InAppBrowser) {

      // this.current_url = sanitizer.bypassSecurityTrustResourceUrl("http://beta.myidband.com/discourse/sso_for_mobile?email=mob_developer56@hotmail.com&token=s7kn41jjuREXYTdHFc7B");
      // this.current_url = sanitizer.bypassSecurityTrustResourceUrl("http://www.google.com");

  }

  ngOnInit(){

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.current_url = 'https://www.getmyid.com/discourse/sso_for_mobile?email='+ this.email + '&token=' + this.auth_token;
        let options = 'toolbarposition=top,location=no';
        const browser = this.iab.create(this.current_url, '_blank', options);

        browser.on('exit').subscribe(event => {
            this.navCtrl.setRoot(MainPage);
        }, err => {

        });
      });
    });


    // browser.executeScript(...);
    // browser.insertCSS(...);
    // browser.close();
  }
}
