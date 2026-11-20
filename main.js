// RadiusBot site behaviour: mobile menu, copy-email, contact form and
// scroll reveal. Everything on the page works without this script; the
// contact form then falls back to a normal POST to FormSubmit.

const CONTACT_EMAIL = 'radiusbot@gmail.com';

// FormSubmit (formsubmit.co) forwards the form to CONTACT_EMAIL. GitHub
// Pages can't run a server, so a forwarding service is the only way for a
// static site to send mail without opening the visitor's mail app. The
// form is activated; FORM_ID is FormSubmit's alias for CONTACT_EMAIL, so
// the address isn't sent to FormSubmit from the page.
const FORM_ID = 'e5fada3f0a762b5dd8ba140e8d99081b';
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_ID}`;
const FORM_TIMEOUT_MS = 15000;
const TOAST_DURATION_MS = 2400;

document.addEventListener('DOMContentLoaded', () => {
    setUpMobileMenu();
    setUpCopyButtons();
    setUpContactForm();
    setUpReveal();
    document.getElementById('year').textContent = String(new Date().getFullYear());
});

// ------------------------------------------------------------ mobile menu

function setUpMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('mobile-nav');
    const icon = toggle.querySelector('use');

    const setOpen = (open) => {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        icon.setAttribute('href', open ? '#i-close' : '#i-menu');
    };

    toggle.addEventListener('click', () => setOpen(menu.hidden));
    menu.addEventListener('click', (event) => {
        if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !menu.hidden) {
            setOpen(false);
            toggle.focus();
        }
    });
}

// ------------------------------------------------------------- copy email

function setUpCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach((button) => {
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                showToast('Email address copied');
            } catch {
                showToast(`Copy failed. Our email is ${button.dataset.copy}`);
            }
        });
    });
}

let toastTimer;

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, TOAST_DURATION_MS);
}

// ----------------------------------------------------------- contact form

function setUpContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const success = document.getElementById('form-success');
    const submit = form.querySelector('[type="submit"]');
    const submitLabel = submit.querySelector('.button-label');
    const fields = {
        name: form.elements.name,
        email: form.elements.email,
        topic: form.elements.topic,
        message: form.elements.message,
        honeypot: form.elements._honey,
    };

    const setStatus = (html, isError) => {
        status.innerHTML = html;
        status.classList.toggle('is-error', isError);
    };

    // Clear a field's error as soon as the visitor edits it.
    [fields.name, fields.email, fields.message].forEach((field) => {
        field.addEventListener('input', () => field.removeAttribute('aria-invalid'));
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const invalid = [fields.name, fields.email, fields.message].filter((field) => {
            const bad = !field.value.trim() || !field.checkValidity();
            if (bad) field.setAttribute('aria-invalid', 'true');
            return bad;
        });
        if (invalid.length > 0) {
            setStatus('Please fill in your name, a valid email and a message.', true);
            invalid[0].focus();
            return;
        }

        const name = fields.name.value.trim();
        const email = fields.email.value.trim();
        const topic = fields.topic.value;
        const message = fields.message.value.trim();

        // Bots fill every field; people never see this one. Pretend it
        // worked so the bot moves on.
        if (fields.honeypot.value) {
            showSuccess(email);
            return;
        }

        submit.disabled = true;
        submitLabel.textContent = 'Sending…';
        setStatus('', false);

        try {
            await sendMessage({ name, email, topic, message });
            showSuccess(email);
        } catch {
            const mailto = buildMailto({ name, email, topic, message });
            setStatus(
                `Your message couldn't be sent. Please try again, or ` +
                `<a href="${mailto}">email us directly</a>.`,
                true,
            );
        } finally {
            submit.disabled = false;
            submitLabel.textContent = 'Send message';
        }
    });

    document.getElementById('form-reset').addEventListener('click', () => {
        form.reset();
        success.hidden = true;
        form.hidden = false;
        fields.name.focus();
    });

    function showSuccess(email) {
        document.getElementById('success-email').textContent = email;
        form.hidden = true;
        success.hidden = false;
        success.focus();
    }
}

async function sendMessage({ name, email, topic, message }) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FORM_TIMEOUT_MS);
    try {
        const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                name,
                email,
                topic,
                message,
                _subject: `New enquiry from radiusbot.com: ${topic}`,
                _template: 'table',
                _captcha: 'false',
            }),
            signal: controller.signal,
        });
        const result = await response.json();
        // FormSubmit answers with the string "true" or "false".
        if (!response.ok || String(result.success) !== 'true') {
            throw new Error(result.message || `HTTP ${response.status}`);
        }
    } finally {
        clearTimeout(timeout);
    }
}

function buildMailto({ name, email, topic, message }) {
    const subject = `Enquiry from ${name}: ${topic}`;
    const body = `${message}\n\nName: ${name}\nEmail: ${email}`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// --------------------------------------------------------- scroll reveal

function setUpReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll(
        '.section-head, .app-card, .service-card, .steps li, .contact-intro, .form-card',
    );
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    targets.forEach((target) => {
        target.classList.add('reveal');
        observer.observe(target);
    });
}
