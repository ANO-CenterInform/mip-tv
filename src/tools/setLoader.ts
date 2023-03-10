export const setLoading = (status: boolean): void => {
    if(status) {
        const loader = document.createElement('div');
        loader.classList.add('loader', 'fixed', 'inset-0', 'flex', 'justify-center', 'items-center', 'bg-slate-900/[.6]');
        loader.innerHTML = `
            <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#316595">
                <g fill="none" fill-rule="evenodd">
                    <g transform="translate(1 1)" stroke-width="2">
                        <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                        <path d="M36 18c0-9.94-8.06-18-18-18">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 18 18"
                                to="360 18 18"
                                dur="1s"
                                repeatCount="indefinite"/>
                        </path>
                    </g>
                </g>
            </svg>
            `;
        document.body.appendChild(loader);
    } else {
        const loader = document.querySelector('.loader');
        if(loader) {
            loader.remove();
        }
    }
}
