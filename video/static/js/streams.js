const APP_ID = ''
const CHANNEL = ''
const TOKEN = ''

let UID;

console.log('Agora is connected')

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => { 
    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)
    document.getElementById('room-name').innerText = CHANNEL

    try{
        UID = await client.join(APP_ID, CHANNEL, TOKEN, UID)
    }catch(error){
        console.error(error)
        window.open('/', '_self')
    }
    
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()


    let player = `<div  class="video-container" id="user-container-${UID}">
                     <div class="username-wrapper"><span class="user-name">My Name</span></div>
                     <div class="video-player" id="user-${UID}"></div>
                  </div>`
    
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0], localTracks[1]])
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if (mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove()
        }

        let member = await getMember(user)

        player = `<div  class="video-container" id="user-container-${user.uid}">
            <div class="video-player" id="user-${user.uid}"></div>
            <div class="username-wrapper"><span class="user-name">My Name</span></div>
        </div>`

        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio'){
        user.audioTrack.play()
    }
}


let handleUserLeft = async = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById('user-container-${user.uid}').remove()
}

joinAndDisplayLocalStream()