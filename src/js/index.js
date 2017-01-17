document.addEventListener('DOMContentLoaded', () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const canvas = document.getElementById('visualizer')
  const canvasCtx = canvas.getContext('2d')
  const analyser = audioCtx.createAnalyser()
  let drawVisual // requestAnimationFrame
  let source

  document.getElementById('file').addEventListener('change', (evt) => {
    const files = evt.target.files

    for (let i = 0; i < files.length; ++i) {
      const file = files[i]
      if (!file.type.match('audio.*')) continue

      const reader = new FileReader()

      reader.onload = ((theFile) => {
        return (e) => {
          const result = e.target.result
          audioCtx.decodeAudioData(result, (buffer) => {
            source = audioCtx.createBufferSource()
            source.buffer = buffer
            source.connect(analyser)
            analyser.connect(audioCtx.destination)

            source.start(0)

            visualize()
          })
        }
      })(file)

      reader.readAsArrayBuffer(file)
    }
  }, false)

  const visualize = () => {
    const WIDTH = canvas.width, HEIGHT = canvas.height
    analyser.fftSize = 1024
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

    const draw = () => {
      drawVisual = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      // clear canvas
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

      canvasCtx.lineWidth = 2
      canvasCtx.strokeStyle = 'rgb(0, 0, 255)'

      canvasCtx.beginPath()

      const sliceWidth = WIDTH * 1.0 / bufferLength
      // canvasCtx.fillStyle = "rgb(0, 0, 255)"

      let hogeMax = 0
      for (let i = 1, x = 0; i < bufferLength; ++i, x += sliceWidth) {
        const v = dataArray[i] / 255
        const y = (1 - v) * HEIGHT
        hogeMax = Math.max(hogeMax, v)

        if (i === 0) {
          canvasCtx.moveTo(x, y)
        } else if (i % 2 === 0) {
          const y = (1 - hogeMax) * HEIGHT
          canvasCtx.lineTo(x, y)
          hogeMax = 0
        }
      }

      canvasCtx.stroke()
    }

    draw()
  }
})
