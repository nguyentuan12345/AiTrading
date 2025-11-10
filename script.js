const countdownEl = document.getElementById('countdown');
const tingAudio = document.getElementById('ting');
const signalList = document.getElementById('signal-list');
let seconds = 60;

function updateCountdown() {
  seconds--;
  if (seconds <= 0) seconds = 60;
  countdownEl.textContent = `Next check in ${seconds}s`;
}
setInterval(updateCountdown, 1000);

// Play sound on new signal
setTimeout(() => {
  const iframeDoc = document.getElementById('telegram-iframe').contentDocument || document.getElementById('telegram-iframe').contentWindow.document;
  const observer = new MutationObserver(() => {
    tingAudio.currentTime = 0;
    tingAudio.play();
    
    setTimeout(() => {
      const messages = iframeDoc.querySelectorAll('.message');
      if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1].textContent;
        if (lastMsg.includes('STRONG BUY') || lastMsg.includes('STRONG SELL')) {
          const li = document.createElement('li');
          li.textContent = new Date().toLocaleString() + ' - ' + lastMsg.substring(0, 80) + '...';
          signalList.prepend(li);
          if (signalList.children.length > 20) signalList.removeChild(signalList.lastChild);
        }
      }
    }, 1000);
  });
  observer.observe(iframeDoc.body, { childList: true, subtree: true });
}, 4000);