import { Controller } from "@hotwired/stimulus"
// import DecibelMeter from 'decibel-meter'
import VAD from "@ricky0123/vad-web"
// const STARTTIME = performance.now()

// Connects to data-controller="record"
export default class extends Controller {
  static targets = ["record", "message"]

  async connect() {
    console.log(this.recordTarget);

    this.isQuiet = false
    this.isRecording = false
    this.isSpeaking = false
    this.chatId = this.element.dataset.id
    this.mediaDevicesAvailable = navigator.mediaDevices && navigator.mediaDevices.getUserMedia

    this.vad = await VAD.MicVAD.new({
      onSpeechRealStart: () => {
        console.log('talking')
        this.isQuiet = false
      },
      onSpeechEnd: (audio) => {
        // do something with `audio` (Float32Array of audio samples at sample rate 16000)...
        setTimeout(() => {
          console.log('silent for 5 sec')
          if (this.isRecording && !this.isSpeaking && !this.isQuiet) {
            this.collectSnapshot()
            this.isQuiet = true
          }
        }, 3000);
      },
      onnxWASMBasePath:
        "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/",
      baseAssetPath:
        "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/",
    })

    this.vad.start()
  }

  startRecord() {
    console.log("recording starting")
    if (!this.mediaDevicesAvailable) return
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.isRecording = true
        this.mediaRecorder.start();
        //
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
          if (this.isRecording) {
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
                this.playKricket()
                this.playKricket()
                Turbo.renderStreamMessage(text);
                setTimeout(() => {
                  this.speak()
                }, 100);
              } else {
                console.error("Failed to send audio");
              }
            } catch (error) {
              console.error("Error sending audio:", error);
            };

          } else {
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
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      // console.log(this.mediaRecorder.state);
      // console.log("recorder stopped");
    }
  }

  collectSnapshot() {
    console.log("collect snapshot started")
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop()
      this.mediaRecorder.start()
      console.log("collect snapshot finished")
    }
  }

  playKricket() {
    this.audio = new Audio('/audio/Kricket - One Shot.mp3');
    this.audio.volume = 0.5; // volume is (0.0 to 1.0)
    this.audio.play().catch(err => console.error('Error playing audio:', err));
  }

  speak() {
    if('speechSynthesis' in window) {
      this.isSpeaking = true

      // Wait for voices to load on mobile
      const speakText = () => {
        const utterance = new SpeechSynthesisUtterance(this.messageTarget.textContent)
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 1.0

        utterance.onend = () => {
          this.isSpeaking = false
          console.log("Speaking finished")
        }

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event)
          this.isSpeaking = false
        }

        speechSynthesis.speak(utterance)
      }

      // Load voices if not ready
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', speakText, { once: true })
      } else {
        speakText()
      }
    }
  }

  stop() {
    speechSynthesis.cancel()
    this.isSpeaking = false
  }
}
