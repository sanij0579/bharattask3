
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const hangupButton = document.getElementById('hangupButton');

let localStream;
let remoteStream;
let peerConnection;

startButton.addEventListener('click', startVideoCall);
hangupButton.addEventListener('click', hangUp);

async function startVideoCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        // Create a peer connection
        peerConnection = new RTCPeerConnection();

        // Add the local stream to the peer connection
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // Set up remote video stream
        peerConnection.ontrack = (event) => {
            remoteVideo.srcObject = event.streams[0];
        };

        // Your signaling and peer connection setup code should go here

        hangupButton.disabled = false;
        startButton.disabled = true;
    } catch (error) {
        console.error('Error starting video call:', error);
    }
}

function hangUp() {
    // Close the peer connection and release resources
    if (peerConnection) {
        peerConnection.close();
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    remoteVideo.srcObject = null;
    hangupButton.disabled = true;
    startButton.disabled = false;
}