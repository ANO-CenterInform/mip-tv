import {generateEmbedPlayer} from "./generateEmbedPlayer";

export const openModal = (data: Array<any>) => {

    document.body.classList.add('overflow-hidden');
    const modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal', 'flex', 'flex-col', 'items-center', 'fixed', 'inset-0', 'z-50', 'bg-slate-900/[.6]', 'overflow-y-auto');
    modalWrapper.innerHTML = `
            <div class="modal-content relative flex flex-col w-full max-w-screen-md rounded-xl bg-white-100 my-6">
            <div class="modal-close" data-dismiss="modal" aria-label="Close"></div>
                ${generateEmbedPlayer(data[0].acf.video_type, data[0].acf.video_id)}
                <div class="p-8">                
                    <h3 class="mb-8 text-3xl">${data[0].title.rendered}</h3>
                    <p class="whitespace-pre-line">${data[0].acf.video_description}</p>
                </div>
            <div>
            `;

    document.body.appendChild(modalWrapper);

    const closeButton = modalWrapper.querySelector('[data-dismiss="modal"]') as HTMLElement;

    closeButton.addEventListener('click', () => {
        document.body.classList.remove('overflow-hidden');
        modalWrapper.remove();
    });

    modalWrapper.addEventListener('click', ev => {
        const target = ev.target as HTMLElement;
        if(!target.closest('.modal-content')) {
            modalWrapper.remove();
            document.body.classList.remove('overflow-hidden');
        }
    });
}
