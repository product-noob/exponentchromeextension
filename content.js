function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = type === 'error' ? '#f44336' : '#4CAF50';
  toast.style.color = 'white';
  toast.style.padding = '10px';
  toast.style.borderRadius = '5px';
  toast.style.zIndex = '1000';
  toast.style.transition = 'opacity 0.5s';

  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
  setTimeout(() => { document.body.removeChild(toast); }, 3500);
}

function fetchContent() {
  setTimeout(() => {
      const targetDiv = document.querySelector('div.LessonPage.w-full.max-h-screen.min-h-screen.overflow-auto');

      if (targetDiv) {
          let content = targetDiv.innerText;

          const iframes = targetDiv.querySelectorAll('iframe');
          let videoLinks = [];
          iframes.forEach((iframe) => {
              const src = iframe.src;
              if (src.includes('youtube.com') || src.includes('youtu.be')) {
                  videoLinks.push(src);
              }
          });

          if (videoLinks.length > 0) {
              content += `\n\nEmbedded Videos:\n${videoLinks.join('\n')}`;
          } else {
              content += '\n\nNo embedded videos found.';
          }

          const blob = new Blob([content], { type: 'text/plain' });
          
          const url = window.location.href.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".txt";
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = url;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(link.href);

          showToast('Content has been downloaded.', 'success');
      } else {
          showToast('Target div with the specified class not found.', 'error');
      }
  }, 2000); // 2000 milliseconds delay
}

chrome.storage.local.get('extensionEnabled', (data) => {
  if (data.extensionEnabled !== false) {
      fetchContent();
  }
});

window.updateExtensionState = function(isEnabled) {
  if (isEnabled) {
      fetchContent();
  }
};