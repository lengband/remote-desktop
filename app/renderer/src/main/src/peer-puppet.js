import EventEmitter from 'events'
import { ipcRenderer, desktopCapturer } from 'electron'

let peer = new EventEmitter()
window.peer = peer // 为了直接模拟过程，信令结束后，会删掉

const pc = new window.RTCPeerConnection()

async function getScreenStream() {
  const sources = await desktopCapturer.getSources({ types: ['screen'] })
  return new Promise((resolve, reject) => {
    navigator.webkitGetUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sources[0].id,
            maxWidth: window.screen.width,
            maxHeight: window.screen.height,
          },
        },
      },
      (stream) => {
        console.log('add-stream', stream)
        resolve(stream)
      },
      reject
    )
  })
}

async function createAnswer(offer) {
  let stream = await getScreenStream()
  pc.addStream(stream)
  await pc.setRemoteDescription(offer)
  await pc.setLocalDescription(await pc.createAnswer())
  return pc.localDescription
}

window.createAnswer = createAnswer

let candidates = []
async function addIceCandidate(candidate) {
  if (candidate) {
    candidates.push(candidate)
  }
  // 设置 candidate 需要等待 pc.remoteDescription 有值时才有效
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
    candidates = []
  }
}

ipcRenderer.on('candidate', (e, candidate) => {
  addIceCandidate(candidate)
})

pc.onicecandidate = (e) => {
  if (e.candidate) {
    const candidate = JSON.parse(JSON.stringify(e.candidate))
    ipcRenderer.send('forward', 'puppet-candidate', candidate)
  }
}

ipcRenderer.on('offer', async (e, offer) => {
  let answer = await createAnswer(offer)
  ipcRenderer.send('forward', 'answer', {
    type: answer.type,
    sdp: answer.sdp,
  })

  pc.ondatachannel = (e) => {
    console.log('ondatachannel: ', e)
    e.channel.onmessage = (e) => {
      console.log('onmessage', e, JSON.parse(e.data))
      let { type, data } = JSON.parse(e.data)
      console.log('robot', {type, data})
      if (type === 'mouse') {
        data.screen = {
          width: window.screen.width,
          height: window.screen.height,
        }
      }
      ipcRenderer.send('robot', type, data)
    }
  }
})

export default peer
