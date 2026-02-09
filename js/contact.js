// === EMAILJS CONTACT FORM HANDLER ===
// Initialize EmailJS with your Public Key
// You need to replace these values with your own from https://www.emailjs.com/

const EMAILJS_CONFIG = {
    publicKey: 'E8H5tFoLO5TEgufG-',      // Replace with your EmailJS Public Key
    serviceId: 'service_xv6tnfg',      // Replace with your EmailJS Service ID
    templateId: 'template_204nyfj'     // Replace with your EmailJS Template ID
};

// Initialize EmailJS
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if publicKey is set (not placeholder)
    if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }

    initContactForm();
});

function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form?.querySelector('.submit-btn');
    const statusDiv = document.getElementById('form-status');

    if (!form || !submitBtn || !statusDiv) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if EmailJS is configured
        if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            showStatus('error', getFormText('formErrorConfig'));
            console.error('EmailJS not configured. Please update contact.js with your credentials.');
            return;
        }

        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText ? btnText.textContent : 'Send Transmission';

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = getFormText('formSending') || 'Transmitting...';

        statusDiv.className = 'form-status';
        statusDiv.textContent = '';

        try {
            // Prepare template parameters
            const templateParams = {
                from_name: form.from_name.value,
                from_email: form.from_email.value,
                message: form.message.value,
                to_name: 'Ezequiel' // Your name
            };

            // Send email via EmailJS
            await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
            );

            // Success
            showStatus('success', getFormText('formSuccess'));
            form.reset();

        } catch (error) {
            console.error('EmailJS Error:', error);
            showStatus('error', getFormText('formError'));
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = originalText;
        }
    });
}

async function showStatus(type, message) {
    const statusDiv = document.getElementById('form-status');
    if (!statusDiv) return;

    const lang = typeof window.currentLang !== 'undefined' ? window.currentLang : (localStorage.getItem('lang') || 'en');

    // Reset and show
    statusDiv.className = `form-status ${type} active`;
    statusDiv.textContent = ''; // Clear previous

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Add a small terminal prompt
    const successPrompt = lang === 'es' ? '[ÉXITO] > ' : '[SUCCESS] > ';
    const errorPrompt = lang === 'es' ? '[ERROR] > ' : '[ERROR] > ';
    const prompt = type === 'success' ? successPrompt : errorPrompt;
    statusDiv.textContent = prompt;

    // Type the message
    for (let char of message) {
        statusDiv.textContent += char;
        await wait(Math.random() * 20 + 10); // Snappy typing
    }

    // Auto-hide after 6 seconds (slightly longer to allow reading)
    setTimeout(() => {
        statusDiv.classList.remove('active');
        // Optional: clear text after fade out
        setTimeout(() => {
            if (!statusDiv.classList.contains('active')) {
                statusDiv.textContent = '';
            }
        }, 500);
    }, 6000);
}

function getFormText(key) {
    const lang = typeof window.currentLang !== 'undefined' ? window.currentLang : (localStorage.getItem('lang') || 'en');

    // Check if global translations exist
    if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }

    // Fallback internal texts (just in case)
    const texts = {
        en: {
            formSuccess: 'Message sent successfully! I\'ll respond soon.',
            formError: 'Failed to send message. Please try again or use email directly.',
            formErrorConfig: 'Contact form not configured. Please use email link above.',
            formSending: 'Transmitting...'
        },
        es: {
            formSuccess: '¡Mensaje enviado exitosamente! Responderé pronto.',
            formError: 'Error al enviar el mensaje. Por favor intenta de nuevo o usa el email directamente.',
            formErrorConfig: 'Formulario no configurado. Por favor usa el enlace de email arriba.',
            formSending: 'Transmitiendo...'
        }
    };
    return texts[lang]?.[key] || texts.en[key];
}
