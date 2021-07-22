const EventEmitter = require('events')
const peer = new EventEmitter()
const pc = new window.RTCPeerConnection({})
const { ipcRenderer } = require('electron')

// peer.on('robot', (type, data) => {
//   console.log('robot', type, data)
//   if (type === 'mouse') {
//     data.screen = {
//       width: window.screen.width,
//       height: window.screen.height,
//     }
//   }
//   setTimeout(() => {
//     ipcRenderer.send('robot', type, data)
//   }, 2000)
// })

async function createOffer() {
  let offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
  })
  await pc.setLocalDescription(offer)
  console.log('create-offer\n', JSON.stringify(pc.localDescription))
  return pc.localDescription
}
createOffer().then((offer) => {
  console.log('forward', 'offer', offer)
  ipcRenderer.send('forward', 'offer', {type: offer.type, sdp: offer.sdp})
})

async function setRemote(answer) {
  await pc.setRemoteDescription(answer)
  console.log('create-answer', pc)
}

window.setRemote = setRemote;

pc.onaddstream = (e) => {
	console.log('addstream', e)
	peer.emit('add-stream', e.stream)
}


module.exports = peer
