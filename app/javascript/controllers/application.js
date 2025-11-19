import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

export { application }

import LiquidGlassController from "./liquid_glass_controller"
application.register("liquid-glass", LiquidGlassController)
