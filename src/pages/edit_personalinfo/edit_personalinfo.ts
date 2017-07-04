import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {IonicStorageModule} from '@ionic/Storage';
import { UserService } from "../../providers/user-service";


@Component({
  selector: 'page-edit-personalinfo',
  templateUrl: 'edit_personalinfo.html'
})
export class EditPersonalInformationPage {

  public person:any = {}
  // { first_name:"", last_name:"", middle_name:"", phone_number:"", birth_date:"",
                // gender:"", hair:"", eye_color:"", height:"", weight:"", blood_type:"", donor: false};
  email:string;
  auth_token:string;
  profile_id:string
  public genders:any;
  public hairs:any;
  public eyes:any;
  public bloods:any;
  public donors:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage) {
    this.person = navParams.get("person");
    this.profile_id = navParams.get("profile_id")
    this.email = "";
    this.auth_token = "";
    this.genders = [
      { title:"Female", value:"female"},
      { title:"Male", value:"male"} ];
    this.hairs = [ { color:"Black", value:"Black"},{ color:"Brown", value:"Brown"},{ color:"Alonde", value:"Alonde"},
                  { color:"Auburn", value:"Auburn"}, { color:"Red", value:"Red"}, { color:"Gray", value:"Grey"},
                  { color:"White", value:"White"}, { color:"Chestnut", value:"Chestnut"}, { color:"No Hair", value:"Bald"}];
    this.eyes = [ { color:"Brown", value:"Brown"}, { color:"Gray", value:"Gray"}, { color:"Green", value:"Green"}, { color:"Hazel", value:"Hezel"},
                { color:"Red", value:"Red"}, { color:"Violet", value:"Violet"}, { color:"Blue", value:"Blue"}, { color:"Other", value:"Other"}];
    this.bloods = [ { type:"O+", value:"O+"}, { type:"O-", value:"O-"}, { type:"A+", value:"A+"}, { type:"A-", value:"A-"},
                  { type:"B+", value:"B+"}, { type:"B-", value:"B-"}, { type:"AB+", value:"AB+"}, { type:"AB-", value:"AB-"}];
    this.donors = [ { title:"Yes", value: true}, { title:"NO", value:false}];
  }

personalDataUpdate(){

  let loading = this.loadingCtrl.create();
  // var endValue = "/profiles/" + this.person.id;
  console.log(this.person.birth_date);
  var body = {"id": this.person.id, "profile":{
              "first_name": this.person.first_name,
              "middle_name":this.person.middle_name,
              "last_name":this.person.last_name,
              "phone_number":this.person.phone_number,
              "birth_date":this.person.birth_date,
              "gender":this.person.gender,
              "hair":this.person.hair,
              "eye_color":this.person.eye_color,
              "height":this.person.height,
              "weight":this.person.weight,
              "blood_type":this.person.blood_type,
              "donor":this.person.donor
            }
          }

  console.log(body);
  loading.present();
  this.storage.get('email').then(val=>{
    this.email = val;
    this.storage.get('auth_token').then(val=>{
      this.auth_token = val;
      this.userService.dataUpdate(this.email, this.auth_token, this.person.id, "", body)
        .subscribe(
          (data) => {
            loading.dismiss();
            console.log("PersonalInfo Data: ", data);
            if(data.success == false){
              let alert = this.alertCtrl.create({
                title: "Error", subTitle: "Updated Error", buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
            } else{
              let alert = this.alertCtrl.create({
                title: "Updated", subTitle: "Updated Success", buttons: ['OK']
              });
              alert.present();
              this.navCtrl.pop();
              console.log(data);
            }
        });
    });
  });

}

}
