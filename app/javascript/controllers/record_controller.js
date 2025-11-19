import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="record"
export default class extends Controller {
  static targets = ["record"]

  connect() {
    console.log(this.recordTarget);

    this.isRecording = false
    this.chatId = this.element.dataset.id
    this.mediaDevicesAvailable = navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  }

  startRecord() {
    if (!this.mediaDevicesAvailable) return
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.isRecording = true
        this.mediaRecorder.start();
        // console.log(mediaRecorder.state);
        // console.log("recorder started");

        // Make button red while recording

        // This will change
        this.recordTarget.style.background = "red";
        this.recordTarget.style.color = "black";
        this.recordTarget.setAttribute('disabled', '')
        // ------

        let chunks = [];

        this.mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        this.mediaRecorder.onstop = async (e) => {
          const mimeType = this.mediaRecorder.mimeType;
          console.log("recorder stopped");

          // Change button to show processing
          this.recordTarget.style.background = "orange";
          this.recordTarget.textContent = "Processing...";

          const blob = new Blob(chunks, { type: mimeType });
          chunks = [];

          // Send audio to Rails backend
          const formData = new FormData();
          formData.append('audio', blob, 'recording.webm');

          try {
            const response = await fetch(`/chats/${this.chatId}/messages`, {
              method: 'POST',
              body: formData,
              headers: {
                'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
                'Accept': 'text/vnd.turbo-stream.html'
              }
            });

            if (response.ok) {
              console.log("Audio sent successfully");
              // Reload page to show assistant's response
              const text = await response.text();
              Turbo.renderStreamMessage(text);
            } else {
              console.error("Failed to send audio");
            }
          } catch (error) {
            console.error("Error sending audio:", error);
          }
          if (!this.isRecording) {
            // Reset button on error
            this.recordTarget.style.background = "";
            this.recordTarget.style.color = "";
            this.recordTarget.textContent = "Record";
            this.recordTarget.removeAttribute('disabled')
          }
        };
      }).catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  }

  stopRecord() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.isRecording = false
      // this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      // console.log(this.mediaRecorder.state);
      // console.log("recorder stopped");
    }
  }

  collectSnapshot() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop()
      this.mediaRecorder.start()
    }
  }
}
