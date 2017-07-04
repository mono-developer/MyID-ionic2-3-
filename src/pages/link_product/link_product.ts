import { Component } from '@angular/core';
import { NavController, NavParams, Nav, LoadingController, AlertController } from 'ionic-angular';
import { BarcodeScanner ,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';
import { UserService } from "../../providers/user-service";
import { SuccessLinkPage } from "../success_link/success_link";

@Component({
  selector: 'page-link-product',
  templateUrl: 'link_product.html'
})
export class LinkProductPage {

  public profile:any;
  scanData : {};
  options :BarcodeScannerOptions;
  public email:any;
  public auth_token:any;
  public link_info:any = { id:"", pin:"" };

  public id_band_data:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public nav: Nav, public barcodeScanner: BarcodeScanner,
      public storage: Storage, public loadingCtrl: LoadingController, public userService: UserService, public alertCtrl: AlertController) {
      this.profile = this.navParams;
  }

  ngOnInit(){
    this.storage.get('email').then(val=>{
      this.email = val;
    });

    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
    });
  }

  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
     title: title, subTitle: subTitle, buttons: ['OK'] });
     alert.present();
   }

  scan(){
    this.options = {
        prompt : "Scan your QR Code."
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {

        console.log(barcodeData);
        this.scanData = barcodeData.text;

        let loading = this.loadingCtrl.create();
        loading.present();

        this.userService.checkIdPin(this.email, this.auth_token, this.scanData)
          .subscribe(
            (data) => {
              loading.dismiss();
              if(data.success == false){
                  if (data.error_code == "1003"){
                    this.presentAlert( "Link A MyID Product Save Failed", "There is a problem with this product. Please contact customer support at (888) 500-9720");
                  }
                  else if (data.error_code == "1002"){
                    this.presentAlert( "Link A MyID Product Save Failed", "The product is already linked to " + data.first_name + "'s profile.");
                  }

               }else{
                 console.log("Check ID Pin:" + JSON.stringify(data));
                 this.link_info.id=data.id;
                 this.link_info.pin=data.pin;
                 this.linkToProfile();
               }
            },
            (data) => {
              loading.dismiss();
              this.presentAlert( "Link A MyID Product Save Failed", "There is a problem with this product. Please contact customer support at (888) 500-9720");
            });
    }, (err) => {
        console.log("Error occured : " + err);
    });
  }

  linkToProfile(){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.userService.createIdBands(this.email, this.auth_token, this.profile.data.id, "", this.link_info.id, this.link_info.pin)
      .subscribe(
        (data) => {
          loading.dismiss();
          if(data.success == false){
            if (data.error_code == "1003"){
              this.presentAlert( "Link A MyID Product Save Failed", "There is a problem with this product. Please contact customer support at (888) 500-9720");
            }
            else if (data.error_code == "1002"){
              this.presentAlert( "Link A MyID Product Save Failed", "The product is already linked to " + data.first_name + "'s profile.");
            }
           }else{
             console.log("Link To Profile:" + JSON.stringify(data));
             this.id_band_data=data;
             this.navCtrl.push(SuccessLinkPage, {
               link:this.id_band_data.id_band,
               profile_id:this.profile.data.id
             });
           }

        },
        (data) => {
          console.log("Link To Profile:" + JSON.stringify(data));
          loading.dismiss();
          this.presentAlert( "Link A MyID Product Save Failed", "There is a problem with this product. Please contact customer support at (888) 500-9720");
        });
  }

  goBack(){
    console.log("goBack");
    this.nav.popToRoot()
  }
}
