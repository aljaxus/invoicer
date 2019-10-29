const func = {
  /**
   * Resize an image to the given sizes
   * @param {String} dataUrl The base64 incoded image data urlString
   * @param {Number} maxwidth The max width in pixels - default is 1024
   * @param {Number} maxheight The max height in pixels - default is 1024
   */
  resizeBase64 (dataUrl, maxwidth = 1024, maxheight = 1024) {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    return new Promise((resolve, reject) => {
      try {
        let img = new Image()
        img.src = dataUrl
        img.onload = function () {
          const iw = img.width
          const ih = img.height
          const scale = Math.min((maxwidth / iw), (maxheight / ih))
          const iwScaled = iw * scale
          const ihScaled = ih * scale
          canvas.width = iwScaled
          canvas.height = ihScaled
          ctx.drawImage(img, 0, 0, iwScaled, ihScaled)

          const base64url = canvas.toDataURL()
          resolve(base64url)
        }
      } catch (error) { reject(error) }
    })
  }
}

module.exports = func
