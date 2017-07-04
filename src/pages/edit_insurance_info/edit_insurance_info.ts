import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {IonicStorageModule} from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { EditInsuranceInfoAddPage } from '../edit_insurance_info_add/edit_insurance_info_add';
import { Flags } from "../../providers/flag";

@Component({
  selector: 'page-edit-insurance-info',
  templateUrl: 'edit_insurance_info.html'
})
export class EditInsuranceInfoPage {

  insuranceinfoDatas: any;
  updated:string;
  email:string;
  auth_token:string;
  public profile_id;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags
  ) {
    this.profile_id = navParams.get("profile_id");
    this.email = "";
    this.auth_token = "";
  }

  ngOnInit(){
    this.flagService.setChangedFlag(false);
    this.gettingdata();
  }

  ionViewDidEnter(){
    if(this.flagService.getChangedFlag()){
      this.gettingdata();
    }
  }

  gettingdata(){

    let loading = this.loadingCtrl.create();
    var endValue = "/insurance_informations"
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Insurance Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.insuranceinfoDatas = data.insurance_informations;
                console.log(data);
                this.updated = data.last_updated_at;
              }
          });
      });
    });
  }

  gotoEditInsuranceInfoAddPage(event, insuranceinfoData){
    console.log("gotoEditInsuranceInfoAddPage");
    if(insuranceinfoData === undefined){
      this.navCtrl.push(EditInsuranceInfoAddPage,{
        insuranceinfoData: null,
        profile_id: this.profile_id
      });
    }else {
      this.navCtrl.push(EditInsuranceInfoAddPage,{
        insuranceinfoData:insuranceinfoData,
        profile_id: this.profile_id
      });
    }

  }
}
