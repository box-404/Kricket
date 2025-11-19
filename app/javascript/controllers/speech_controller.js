import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="speech"
export default class extends Controller {
  static targets = ["message"]

  connect() {
    this.speak()
  }

  speak() {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(this.messageTarget.textContent)

      // Customize voice settings
      utterance.rate = 1.0  // Speed (0.1 to 10)
      utterance.pitch = 1.0 // Pitch (0 to 2)
      utterance.volume = 1.0 // Volume (0 to 1)

      // Optional: Select a specific voice
      const voices = speechSynthesis.getVoices()
      // utterance.voice = voices.find(voice => voice.name === 'Google US English')

      speechSynthesis.speak(utterance)
    }
  }

  stop() {
    speechSynthesis.cancel()
  }
}
