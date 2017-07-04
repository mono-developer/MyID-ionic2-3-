import { Component } from '@angular/core';
import { NavController,AlertController, LoadingController, NavParams } from 'ionic-angular';
import { UserService } from "../../providers/user-service";

@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html'
})
export class ForgotPage {

  public forgot: any = {email:''};

  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {}

  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
     title: title, subTitle: subTitle, buttons: ['OK'] });
     alert.present();
   }
  ValidationEmail (email)
  {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  doSubmit(){
    let loading = this.loadingCtrl.create();
    var val_email = this.ValidationEmail(this.forgot.email);
    var title:string = "Email Validation Failed";

    var title0 = "Sent Email Successfully"
    var subtitile0 = "Please check your email for reset password instructions"
    var subtitle1:string = "Email can't be blank";
    var subtitle2:string = "Email doesn't exist in system";

    if(this.forgot.email =='' || !this.forgot.email){
      this.presentAlert(title, subtitle1);
    }else if(val_email == false){
      this.presentAlert(title, subtitle2);
    }
    else{
      loading.present();
      this.userService.forgot(this.forgot.email)
        .subscribe(
          (data) => {
            loading.dismiss();
            console.log("Send request:", data);
            if(data.success == false)
            {
              this.presentAlert(title, subtitle2);
            } else{
              this.presentAlert(title0, subtitile0);
              this.navCtrl.pop();
            }

          },
          (data) => {
            loading.dismiss();
            console.log("Request error");
            this.presentAlert(title, subtitle2);
            this.navCtrl.pop();
          });
    }


  }
  backHome(){
    console.log("back LoginPage");
    this.navCtrl.pop();

  }
}
