const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const publicDir = path.join(__dirname, 'public');
const htmlPartialsDir = path.join(srcDir, 'html');

// Pastikan folder public dan subfolder-nya ada
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}
if (!fs.existsSync(path.join(publicDir, 'css'))) {
    fs.mkdirSync(path.join(publicDir, 'css'));
}
if (!fs.existsSync(path.join(publicDir, 'js'))) {
    fs.mkdirSync(path.join(publicDir, 'js'));
}

// Baca semua partial HTML yang umum
const partials = {
    head: fs.readFileSync(path.join(htmlPartialsDir, '_head.html'), 'utf8'),
    header: fs.readFileSync(path.join(htmlPartialsDir, '_header.html'), 'utf8'),
    mobileNav: fs.readFileSync(path.join(htmlPartialsDir, '_mobile_nav.html'), 'utf8'),
    footer: fs.readFileSync(path.join(htmlPartialsDir, '_footer.html'), 'utf8'),
};

// Definisikan halaman-halaman yang akan dibuat
const pages = [
    { name: 'index', title: 'Office of Dicky Huang - Home' },
    { name: 'projects', title: 'Office of Dicky Huang - Projects' },
    { name: 'about', title: 'Office of Dicky Huang - About Us' },
    { name: 'contact', title: 'Office of Dicky Huang - Contact Us' },
];

// Loop melalui setiap halaman dan buat file HTML lengkapnya
pages.forEach(page => {
    const contentPath = path.join(htmlPartialsDir, `${page.name}-content.html`);
    let pageContent = '';
    try {
        // Baca konten unik untuk halaman ini
        pageContent = fs.readFileSync(contentPath, 'utf8');
    } catch (error) {
        // Tangani jika file konten tidak ditemukan
        console.error(`Error: File konten untuk ${page.name} tidak ditemukan di ${contentPath}. Pastikan Anda telah membuat ${page.name}-content.html.`);
        console.error(error.message);
        return; // Lewati halaman ini jika konten tidak ditemukan
    }

    // Gabungkan semua bagian untuk membuat HTML lengkap
    let fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    ${partials.head.replace('{{PAGE_TITLE}}', page.title)}
</head>
<body class="bg-neutral-100 font-sans flex flex-col min-h-screen">
    <div class="website-wrapper w-full relative flex flex-col items-center">
        ${partials.header}
        ${partials.mobileNav}
        ${pageContent}
        ${partials.footer}
    </div>
    <script src="js/script.js"></script>
</body>
</html>`;

    // Tulis HTML lengkap ke file di folder public
    const outputPath = path.join(publicDir, `${page.name}.html`);
    fs.writeFileSync(outputPath, fullHtml, 'utf8');
    console.log(`Generated ${outputPath}`);
});

const scriptSrcPath = path.join(srcDir, 'js', 'script.js');
const scriptDestPath = path.join(publicDir, 'js', 'script.js');

try {
    fs.copyFileSync(scriptSrcPath, scriptDestPath);
    console.log('Copied src/js/script.js to public/js/script.js');
} catch (error) {
    console.error(`Error copying script.js: ${error.message}`);
}

console.log('HTML build process completed.');