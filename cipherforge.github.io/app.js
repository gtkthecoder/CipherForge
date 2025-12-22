// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check for Web Crypto API support
        if (!window.crypto || !crypto.subtle) {
            document.body.innerHTML = `
                <div class="container" style="text-align: center; padding: 100px 20px;">
                    <h1 style="color: var(--danger-color);">⚠️ Browser Not Supported</h1>
                    <p>Your browser does not support the Web Cryptography API.</p>
                    <p>Please use a modern browser like Chrome, Firefox, or Edge.</p>
                    <p style="margin-top: 30px;">
                        <a href="https://caniuse.com/cryptography" target="_blank" 
                           style="color: var(--secondary-color);">
                           Learn more about browser support
                        </a>
                    </p>
                </div>
            `;
            return;
        }
        
        // Initialize the application
        window.cipherForge = new CipherForgeUI();
        
        // Add some helpful console messages
        console.log('🔒 CipherForge loaded successfully!');
        console.log('📁 GitHub: https://github.com/gtk-gg');
        console.log('⚠️  For educational purposes only');
        
    } catch (error) {
        console.error('Failed to initialize CipherForge:', error);
        
        document.body.innerHTML = `
            <div class="container" style="text-align: center; padding: 100px 20px;">
                <h1 style="color: var(--danger-color);">❌ Initialization Error</h1>
                <p>Failed to load CipherForge. Please refresh the page.</p>
                <p style="margin-top: 30px;">
                    Error: ${error.message}
                </p>
            </div>
        `;
    }
});
