import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["canvas"]

  connect() {
    this.canvas = this.canvasTarget
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })

    this.bubbles = this.generateBubbles(24)
    this.t = 0

    this.resize = this.resize.bind(this)
    window.addEventListener("resize", this.resize)
    this.resize()

    this.draw()
  }

  disconnect() {
    window.removeEventListener("resize", this.resize)
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
  }

  generateBubbles(count) {
    let bubbles = []
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.035 + Math.random() * 0.05,
        speed: 0.0004 + Math.random() * 0.0010,
        wobble: Math.random() * 2 * Math.PI,
      })
    }
    return bubbles
  }

  draw() {
    const w = this.canvas.width
    const h = this.canvas.height
    const img = this.ctx.createImageData(w, h)
    const data = img.data

    this.t += 0.014

    // bubble movement
    for (let b of this.bubbles) {
      b.y -= b.speed
      b.x += Math.sin(this.t * 1.5 + b.wobble) * 0.00035

      if (b.y < -0.12) {
        b.y = 1.12
        b.x = Math.random()
      }
    }

    // pixel loop
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {

        let nx = x / w
        let ny = y / h

        let refract = 0
        let highlight = 0
        let chroma = 0

        for (let b of this.bubbles) {
          let dx = nx - b.x
          let dy = ny - b.y
          let dist = Math.sqrt(dx*dx + dy*dy)

          let edge = Math.max(0, 1 - (dist / b.r))
          let smooth = edge * edge * (3 - 2*edge)

          refract += smooth * 0.65
          highlight += smooth * 0.45
          chroma += smooth * 0.7
        }

        // BASE GLASS COLOR (warm + cool blend)
        let baseR = 185 + refract * 40
        let baseG = 185 + refract * 33
        let baseB = 200 + refract * 55

        // CAUSTIC BOOST (shimmery streaks)
        let sh = Math.sin((x + y) * 0.02 + this.t * 0.8) * 20
        baseR += sh * 0.20
        baseG += sh * 0.15
        baseB += sh * 0.25

        // CHROMATIC DISPERSION (rainbow edges)
        let r = baseR + chroma * 30
        let g = baseG + chroma * 15
        let b = baseB + chroma * 35

        // BLOOM for bright spots
        let avg = (r + g + b) / 3
        if (avg > 210) {
          let bloom = (avg - 210) * 0.8
          r += bloom * 0.8
          g += bloom * 0.5
          b += bloom * 1.0
        }

        const id = (y * w + x) * 4
        data[id]     = r
        data[id + 1] = g
        data[id + 2] = b
        data[id + 3] = 70
      }
    }

    this.ctx.putImageData(img, 0, 0)
    requestAnimationFrame(() => this.draw())
  }
}
