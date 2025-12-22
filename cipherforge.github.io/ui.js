class CipherForgeUI {
    constructor() {
        this.crypto = new CipherForgeCrypto();
        this.currentFile = null;
        this.isEncrypting = true;
        this.generatedPassword = '';
        
        this.initializeElements();
        this.bindEvents();
        this.showWarning();
    }

    initializeElements() {
        // Modal
        this.warningModal = document.getElementById('warningModal');
        this.acceptBtn = document.getElementById('acceptBtn');
        this.declineBtn = document.getElementById('declineBtn');
        
        // Main container
        this.mainContainer = document.getElementById('mainContainer');
        
        // Mode selection
        this.encryptBtn = document.getElementById('encryptBtn');
        this.decryptBtn = document.getElementById('decryptBtn');
        
        // File handling
        this.fileInput = document.getElementById('fileInput');
        this.uploadBox = document.getElementById('uploadBox');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.clearFileBtn = document.getElementById('clearFileBtn');
        
        // Password handling
        this.passwordOptions = document.querySelectorAll('input[name="passwordOption"]');
        this.customPasswordSection = document.getElementById('customPasswordSection');
        this.generatedPasswordSection = document.getElementById('generatedPasswordSection');
        this.passwordInput = document.getElementById('passwordInput');
        this.confirmPasswordInput = document.getElementById('confirmPasswordInput');
        this.togglePasswordBtn = document.getElementById('togglePasswordBtn');
        this.generatedPasswordElement = document.getElementById('generatedPassword');
        this.copyPasswordBtn = document.getElementById('copyPasswordBtn');
        this.regenerateBtn = document.getElementById('regenerateBtn');
        this.passwordStrengthBar = document.querySelector('.strength-bar');
        this.passwordStrengthText = document.querySelector('.strength-text');
        this.passwordLength = document.getElementById('passwordLength');
        
        // Action buttons
        this.processBtn = document.getElementById('processBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        
        // Progress
        this.progressSection = document.getElementById('progressSection');
        this.progressPercent = document.getElementById('progressPercent');
        this.progressFill = document.getElementById('progressFill');
        this.progressStatus = document.getElementById('progressStatus');
        this.processedBytes = document.getElementById('processedBytes');
        this.totalBytes = document.getElementById('totalBytes');
        this.processingSpeed = document.getElementById('processingSpeed');
        
        // Results
        this.resultSection = document.getElementById('resultSection');
        this.successResult = document.getElementById('successResult');
        this.errorResult = document.getElementById('errorResult');
        this.resultMessage = document.getElementById('resultMessage');
        this.errorMessage = document.getElementById('errorMessage');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.newFileBtn = document.getElementById('newFileBtn');
        this.tryAgainBtn = document.getElementById('tryAgainBtn');
    }

    bindEvents() {
        // Warning modal
        this.acceptBtn.addEventListener('click', () => this.acceptWarning());
        this.declineBtn.addEventListener('click', () => this.declineWarning());
        
        // Mode selection
        this.encryptBtn.addEventListener('click', () => this.setMode(true));
        this.decryptBtn.addEventListener('click', () => this.setMode(false));
        
        // File handling
        this.uploadBox.addEventListener('click', () => this.fileInput.click());
        this.uploadBox.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadBox.addEventListener('drop', (e) => this.handleFileDrop(e));
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.clearFileBtn.addEventListener('click', () => this.clearFile());
        
        // Password handling
        this.passwordOptions.forEach(option => {
            option.addEventListener('change', () => this.handlePasswordOptionChange());
        });
        
        this.passwordInput.addEventListener('input', () => this.updatePasswordStrength());
        this.confirmPasswordInput.addEventListener('input', () => this.validatePasswords());
        this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());
        this.copyPasswordBtn.addEventListener('click', () => this.copyPassword());
        this.regenerateBtn.addEventListener('click', () => this.generateNewPassword());
        
        // Process button
        this.processBtn.addEventListener('click', () => this.processFile());
        this.cancelBtn.addEventListener('click', () => this
