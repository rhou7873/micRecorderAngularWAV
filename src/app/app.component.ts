import { Component } from '@angular/core';

declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  startClicked = 0;
  //Lets declare Record OBJ
  record;
  //Will use this flag for toggeling recording
  recording = false;
  // DEBUG: number of recordings
  numRecordings = 0;
  //URL of Blob
  url;

  error;

  constructor(private domSanitizer: DomSanitizer) {}

  sanitize(url:string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  /**
   * Start recording
   */
  start(){
    this.startClicked++;
    if (this.startClicked > 1) {
      this.url = "";
    }
    this.initiateRecording();
  }
  initiateRecording() {
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true
    };

    navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  /**
  * Will be called automatically.
  */
  successCallback(stream) {
    var options = {
      mimeType: "audio/wav",
      numberOfAudioChannels: 1,
      // have to do the correct sample rate
      sampleRate: 50000,
    };
    //Start Actual Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    // DEBUG:
    console.log("trying to record #" + this.numRecordings)
    // records
    this.record.record();
    // DEBUG:
    console.log("recording stopped")
  }
  /**
  * Stop recording.
  */
  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }
  /**
  * processRecording Do what ever you want with blob
  * @param  {any} blob Blog
  */
  processRecording(blob) {
    this.url = URL.createObjectURL(blob);
    console.log("blob", blob);
    console.log("url", this.url);
  }
  /**
  * Process Error.
  */
  errorCallback(error) {
    this.error = 'Can not play audio in your browser';
  }
  ngOnInit() {}
}
