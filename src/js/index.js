import { GLightbox } from './glightbox.js';

export default function glightbox(options = {}) {
    const instance = new GLightbox(options);
    try {
        instance.init();
    } catch (error) {
        console.error(error);
    }

    return instance;
}

// Compatibility for V3 in browsers
if (typeof window !== 'undefined') {
    window.GLightbox = glightbox;
}
