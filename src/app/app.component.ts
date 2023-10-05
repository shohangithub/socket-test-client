import { Component } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'socket-test-client';

  private hubConnectionBuilder!: HubConnection;
  url: string = 'https://dev.alignwell.com/api/notification/NotifierServerHub';
  localUrl: string = 'http://localhost:5000/NotifierServerHub';

  message: any = 'waiting for notifications ...';
  notifierPayload = [
    {
      Context: 'Mail',
      ActionName: 'correlationId',
      Value: 'b7504338-6bb3-48eb-9a39-2d8e198ca7c5',
    },
  ];

  constructor() {}
  ngOnInit(): void {
    //// for check local notification server
    // this.hubConnectionBuilder = new HubConnectionBuilder()
    //   .withUrl('https://localhost:7168/messageHub')
    //   .configureLogging(LogLevel.Information)
    //   .build();
    // this.hubConnectionBuilder
    //   .start()
    //   .then(() => console.log('Connection started.......!'))
    //   .catch((err) => console.log('Error while connect with server'));
    // this.hubConnectionBuilder.on('SendMessageToUser', (result: any) => {
    //   this.message = result;
    // });

    //set valid user token who is available to get notification email and subscriber
    let token =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6IkpXVCJ9.eyJUaW1lWm9uZSI6ImFzaWEvZGhha2EiLCJUaW1lWm9uZU9mZnNldCI6Ii0zNjAiLCJpdHNBUmlza3lQYXNzd29yZCI6IkZhbHNlIiwiaXNWZXJpZmllZCI6IlRydWUiLCJmaXJzdE5hbWUiOiJMRk4gVXNlciIsImxhc3ROYW1lIjoiU2hvaGFuIiwiY291bnRyeUNvZGUiOiJuby1jb2RlIiwic2FsdXRhdGlvbiI6IiAiLCJ0ZW5hbnRJZCI6ImYzZmEyOWIyLTg3MWItNDVhYi1iZTA3LTllZDg0NDIwNTBkNiIsImRhdGFiYXNlTmFtZSI6ImYzZmEyOWIyLTg3MWItNDVhYi1iZTA3LTllZDg0NDIwNTBkNiIsInN1YiI6ImM5MGRhOGFhLWZkYzgtNDJlNi05ZDM2LWM1YzMwZjMwOWEwYSIsInNpdGVJZCI6IjdlYzM1ZTVhLTA1MTUtNGVkMS1hZGFjLTg5NDI5OTcwMjYzMSIsIm9yaWdpbiI6ImRldi5hbGlnbndlbGwuY29tLG1pY3Jvc2VydmljZXMucmVkbGltZXNvbHV0aW9ucy5tbCxsb2NhbGhvc3QsbGZuLnJlZGxpbWVzb2x1dGlvbnMubWwsYXBwcy5saXZpbmdmaXRkZXYuY29tLGJzLWxvY2FsLmNvbToyMzAwLGJzLWxvY2FsLmNvbSIsInNlc3Npb25JZCI6IlJTTUYtNDRmMGE5ZGItZjUwNS00MzU1LWJjYWMtM2I0MmZiY2QzNDdkIiwidXNlcklkIjoiYzkwZGE4YWEtZmRjOC00MmU2LTlkMzYtYzVjMzBmMzA5YTBhIiwiZGlzcGxheU5hbWUiOiJMRk4gVXNlciIsInNpdGVOYW1lIjoiUmVkbGltZVNvbHV0aW9ucyIsInVzZXJOYW1lIjoicmlzLnNob2hhbkBnbWFpbC5jb20iLCJlbWFpbCI6InJpcy5zaG9oYW5AZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIrODgwMTk4MzU0NDQzMyIsImRldmljZU1hY0lkIjoiICIsImxhbmd1YWdlIjoiZW4tVVMiLCJ1c2VyTG9nZ2VkaW4iOiJUcnVlIiwibmFtZSI6ImM5MGRhOGFhLWZkYzgtNDJlNi05ZDM2LWM1YzMwZjMwOWEwYSIsInVzZXJBdXRvRXhwaXJlIjoiRmFsc2UiLCJ1c2VyRXhwaXJlT24iOiIwMS8wMS8wMDAxIDAwOjAwOjAwIiwic3lzdGVtT25Cb2FyZERhdGUiOiIxMi8wMi8yMDIyIDExOjIyOjI2IiwidGFncyI6WyJPd25lciIsIk93bmVyXzQxMjUyNDAwLTAzMmUtNDIwNC05NmQxLWMwZDQ5MGRiM2Q3NyJdLCJwcm9maWxlUGljVXJsIjoiYWJvdXQ6YmxhbmsiLCJyb2xlIjpbImFub255bW91cyIsIm93bmVyX21hc3RlcmFkbWluIiwib3duZXJfYWRtaW4iLCJhcHB1c2VyIl0sIm5iZiI6MTY5NjQ3NzY2NCwiZXhwIjoxNjk2ODM3NjY0LCJpc3MiOiJDTj1SZWRsaW1lIFNvbHV0aW9ucyBBcHBsaWNhdGlvbiBQbGF0Zm9ybSIsImF1ZCI6IioifQ.VyzqtO7-bi25KzHFq3bx4eq3ruyRJ52pBLbZwT-WMc7aLFlwLcfmOCMj26ABBoYOPjVw0H2fVyjxSZ4nOvjMYBrv8n9xrM3xKf6m6egGzOXfhNtd79ZfHvEv7ajh_cWGxaX47V4PjzYj7bAYe_qx46hiL71RNpgLvKnox-B_lnKRYDrIao-TRjr5Gd_q7mWNucT8KImdg-KwqzN4pSeiMPpQocWeotJUxcH4j696MmFa572ut5Fq6Vr-_SJEF-taWRXoFbAvsU835gtug9TUtz9z0ErjoF4vED4RT4_2bOZYCVknQwetcKfUCPSAOIY74vCnTsoEAUVmWYo3vEgeWA';

    this.hubConnectionBuilder = new HubConnectionBuilder()
      .withUrl(this.url, {
        accessTokenFactory() {
          return token;
        },
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect([0, 100, 5000])
      .build();

    this.hubConnectionBuilder
      .start()
      .then(() => console.log('Connection started.......!'))
      .catch((err) => console.log('Error while connect to server'));

    this.hubConnectionBuilder.on('notify', (result: any) => {
      console.log('getting notification message...');
      this.message = result;
    });

    this.hubConnectionBuilder.onclose(() => {
      console.log('closing connection...');
    });
  }

  addSubscription() {
    this.hubConnectionBuilder.invoke(
      'subscribe',
      JSON.stringify(this.notifierPayload)
    );
  }

  removeSubscription() {
    this.hubConnectionBuilder.invoke(
      'unsubscribe',
      JSON.stringify(this.notifierPayload)
    );
  }
}
