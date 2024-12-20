document.addEventListener('DOMContentLoaded', () => {
  const toggleCheckbox = document.getElementById('toggleExtension');

  // Set the checkbox based on the stored state
  chrome.storage.local.get('extensionEnabled', (data) => {
      toggleCheckbox.checked = data.extensionEnabled !== false; // Default to true if not set
  });

  toggleCheckbox.addEventListener('change', () => {
      const isEnabled = toggleCheckbox.checked;
      chrome.storage.local.set({ extensionEnabled: isEnabled });
      
      // Notify content script of the change
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              function: updateExtensionState,
              args: [isEnabled]
          });
      });
  });
});

function updateExtensionState(isEnabled) {
  window.extensionEnabled = isEnabled;
}