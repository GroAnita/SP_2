export default function openListingModal(listing) {
    document.querySelectorAll('[data-modal="listing"]').forEach(modal => modal.remove());

    const overlay = document.createElement('div');
    overlay.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
    overlay.dataset.modal = "listing";

    const modal = document.createElement('div');
    modal.className = "bg-card text-text rounded-lg max-w-lg w-full relative";

    const closeBtn = document.createElement('button');
    closeBtn.className = "absolute top-2 right-2 text-text hover:text-primary";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener('click', () => {
        overlay.remove();
    });

 modal.appendChild(closeBtn);


    modal.querySelector('button:last-child').addEventListener('click', () => {overlay.remove();});

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}