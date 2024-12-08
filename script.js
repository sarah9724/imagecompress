document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.querySelector('.upload-btn');
    const previewSection = document.querySelector('.preview-section');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalFile = null;

    // 修改上传按钮点击事件
    uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        fileInput.click();
    });

    // 上传区域点击事件
    dropZone.addEventListener('click', (e) => {
        if (e.target === dropZone || e.target.closest('.upload-content')) {
            fileInput.click();
        }
    });

    // 文件选择事件
    fileInput.addEventListener('change', handleFileSelect);

    // 拖拽事件
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#DEDEDE';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#DEDEDE';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 质量滑块事件
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
        if (originalFile) {
            compressImage(originalFile, this.value / 100);
        }
    });

    function handleFileSelect(e) {
        const file = e.target.files[0];
        handleFile(file);
    }

    function handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('请选择图片文件！');
            return;
        }

        originalFile = file;
        displayFileSize(file.size, originalSize);
        
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage.src = e.target.result;
            compressImage(file, qualitySlider.value / 100);
            previewSection.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    function compressImage(file, quality) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(function(blob) {
                    compressedImage.src = URL.createObjectURL(blob);
                    displayFileSize(blob.size, compressedSize);
                    
                    // 设置下载按钮
                    downloadBtn.onclick = () => {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'compressed_' + originalFile.name;
                        link.click();
                    };
                }, 'image/jpeg', quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function displayFileSize(bytes, element) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        let i = 0;
        let size = bytes;
        while (size >= 1024 && i < sizes.length - 1) {
            size /= 1024;
            i++;
        }
        element.textContent = size.toFixed(2) + ' ' + sizes[i];
    }
}); 