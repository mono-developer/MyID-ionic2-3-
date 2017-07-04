import { Component, ViewChild } from '@angular/core';
import { Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPage } from '../pages/forgot/forgot';
import { AgreePage } from '../pages/agree/agree';
//import { Rollbar } from '@ionic-native/rollbar';
import { ReviewPage } from '../pages/review/review';
import { SettingsPage } from '../pages/settings/settings';
import { SharingPage } from '../pages/sharing/sharing';
import { PillReminderPage } from '../pages/pill_reminder/pill_reminder';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;
  email: string;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    //public rollbar: Rollbar,
    public storage: Storage

  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Manage Profiles', component: MainPage },
      { title: 'Pill Reminders', component: PillReminderPage},
      { title: 'Sharing', component: SharingPage},
      { title: 'Review Community', component: ReviewPage},
      { title: 'Account Setting', component: SettingsPage}
    ];

    this.storage.get('email').then(val=>{
      this.email = val;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.rollbar.init();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
