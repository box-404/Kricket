// Import and register all your controllers from the importmap via controllers/**/*_controller
import { application } from "controllers/application"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
eagerLoadControllersFrom("controllers", application)

// const record = document.getElementById('record')
// const snapshot = document.getElementById('snapshot')
// const stop = document.getElementById('stop')
// const soundClips = document.querySelector(".sound-clips");
// const slider = document.querySelector(".spice-slider") // need to add slider input as well

// let counter = 0;
// const MIN_DECIBELS = -35;
// let isRecording = false;
// let soundDetected = false;
// let mediaRecorder

// // Get chat ID from URL (e.g., /chats/123)
// const chatId = window.location.pathname.split('/')[2];

// record.addEventListener('click', () => {
//   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     console.log("getUserMedia supported.");
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then((stream) => {
//         mediaRecorder = new MediaRecorder(stream);
//         isRecording = true
//         mediaRecorder.start();
//         console.log(mediaRecorder.state);
//         console.log("recorder started");

//         // Make button red while recording
//         record.style.background = "red";
//         record.style.color = "black";
//         record.setAttribute('disabled', '')

//         let chunks = [];

//         mediaRecorder.ondataavailable = (e) => {
//           chunks.push(e.data);
//         };

//         mediaRecorder.onstop = async (e) => {
//           const mimeType = mediaRecorder.mimeType;
//           console.log("recorder stopped");

//           // Change button to show processing
//           record.style.background = "orange";
//           record.textContent = "Processing...";

//           const blob = new Blob(chunks, { type: mimeType });
//           chunks = [];

//           // Send audio to Rails backend
//           const formData = new FormData();
//           formData.append('audio', blob, 'recording.webm');

//           try {
//             const response = await fetch(`/chats/${chatId}/messages`, {
//               method: 'POST',
//               body: formData,
//               headers: {
//                 'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
//               }
//             });

//             if (response.ok) {
//               console.log("Audio sent successfully");
//               // Reload page to show assistant's response
//               window.location.reload();
//             } else {
//               console.error("Failed to send audio");
//               // Reset button on error
//               record.style.background = "";
//               record.style.color = "";
//               record.textContent = "Record";
//               record.removeAttribute('disabled')
//             }
//           } catch (error) {
//             console.error("Error sending audio:", error);
//             // Reset button on error
//             record.style.background = "";
//             record.style.color = "";
//             record.textContent = "Record";
//             record.removeAttribute('disabled')
//           }
//         };
//       }).catch((err) => {
//         console.error(`The following getUserMedia error occurred: ${err}`);
//       });
//   } else {
//     console.log("getUserMedia not supported on your browser!");
//   }
// })

// snapshot.addEventListener('click', () => {
//   if (mediaRecorder && mediaRecorder.state === "recording") {
//     mediaRecorder.stop()
//     mediaRecorder.start()
//   }
// })

// stop.addEventListener('click', () => {
//   if (mediaRecorder && mediaRecorder.state === "recording") {
//     isRecording = false
//     mediaRecorder.stop();
//     console.log(mediaRecorder.state);
//     console.log("recorder stopped");
//   }
// })
