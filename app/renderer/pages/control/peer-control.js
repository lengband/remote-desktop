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

/**
 * @description 传输流程如下：
 * 一：控制端：1、创建RTCPeerConnection 2、发起连接createOffer(得到offer SDP) 3、setLocalDescription(设置offer SDP) 4、将控制端的 offer SDP 发生给 傀儡端
 * 二：傀儡端：1、创建RTCPeerConnection 2、添加桌面流 3、setRemoteDescription(设置控制端的offer SDP) 4、响应连接createAnswer(得到answer SDP) 5、setLocalDescription(设置answer SDP) 6、将傀儡端的answer SDP发生给控制端
 * 三：控制端：1、setRemoteDescription(设置控制端answer SDP)
 * @return {Object} offer SDP 
 */
async function createOffer() {
  let offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
  })
  await pc.setLocalDescription(offer)
  console.log('create-offer\n', JSON.stringify(pc.localDescription))
  // 得到控制端的 offer SDP
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

pc.onicecandidate = (e) => {
	console.log('candidate', JSON.stringify(e.candidate))
  // ipcRenderer.send('forward', 'control-candidate', e.candidate)
	// 告知其他人
}

let candidates = []
async function addIceCandidate(candidate) {
  if(candidate) {
    candidates.push(candidate)
  }
  // 设置 candidate 需要等待 pc.remoteDescription 有值时才有效
  if(pc.remoteDescription && pc.remoteDescription.type) {
    for(let i = 0; i < candidates.length; i ++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
    candidates = []
  } 
}
window.addIceCandidate = addIceCandidate

pc.onaddstream = (e) => {
	console.log('addstream', e)
	peer.emit('add-stream', e.stream)
}


module.exports = peer
