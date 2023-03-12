import {generateEmbedPlayer} from "./generateEmbedPlayer";
import {fetchJSON} from "./fetcher";

export const openModal = (data: any) => {

    document.body.classList.add('overflow-hidden');
    const modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal', 'flex', 'flex-col', 'items-center', 'fixed', 'inset-0', 'z-50', 'bg-slate-900/[.6]', 'overflow-y-auto');
    const post_date = new Date(data.date);

    modalWrapper.innerHTML = `
            <div class="modal-content relative flex flex-col w-full max-w-screen-md rounded-xl bg-white-100 my-6">
                <div class="modal-close max-md:top-0 max-md:right-0 z-50" data-dismiss="modal" aria-label="Close"></div>
                ${generateEmbedPlayer(data.acf)}
                <div class="p-8">             
                    <date class="block mb-4 text-xl text-blue-200" datetime="${data.date}">${post_date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</date>   
                    <h3 class="mb-2 text-3xl">${data.title.rendered}</h3>
                    <p class="whitespace-pre-line text-xl">${data.acf.video_description}</p>
                    <div class="category pt-4"></div>
                </div>
            <div>
            `;
    document.body.appendChild(modalWrapper);

    fetchJSON(`/wp-json/wp/v2/video_categories/${data.acf.video_categories}`).then(result => {
        const category = document.createElement('div');
        category.innerHTML = `<a href="${result.link}" class="px-4 py-2 border border-blue-200 rounded-xl">#${result.name}</a>`;
        const wrapper = modalWrapper.querySelector('.category') as HTMLElement;
        if(wrapper) {
            wrapper.appendChild(category)
        }
    });

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
