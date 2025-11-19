import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="temperature"
export default class extends Controller {
  connect() {
    console.log("temp")
  }

  update(event) {
    console.log(event.currentTarget.value)
    const formData = new FormData(this.element);
    fetch(this.element.action, {
      method: 'PATCH',
      body: formData
    });
  }
}
