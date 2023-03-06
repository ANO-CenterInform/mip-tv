import './style.css'
//import { setupCounter } from './counter'

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
const url = window.location.href;
if (url.includes('?video=')) {
    if(url.split('?video=')[1]) {
        console.log(url.split('?video=')[1])
    }
}
