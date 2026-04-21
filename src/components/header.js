export default function Header() {
    const header = document.createElement('header');
    header.className = "bg-header p-4 flex justify-between items-center";

    const imgContainer = document.createElement('div');
    imgContainer.className = "flex items-center";
    const title = document.createElement('h1');
    title.className = "text-primary text-3xl font-bold font-poppins";
    title.textContent = "LemonBids";
    const logo = document.createElement('img');
    logo.src = "/images/Lemonmascot.png";
    logo.alt = "LemonBids Logo";
    logo.className = "w-14 h-14 mr-2";
   
    const nav = document.createElement('nav');
    const toggleButton = document.createElement('button');
    toggleButton.className = "btn-sm btn-primary mr-4";
    toggleButton.textContent = "Dark Mode";
    toggleButton.addEventListener('click', () => {
        const isDarkMode = document.documentElement.classList.toggle('dark');
        localStorage.setItem('mode', isDarkMode ? "dark" : "light");
    });

const hamburger = document.createElement('i');
hamburger.className = "fa-solid fa-bars text-2xl text-primary cursor-pointer md:hidden";   

     imgContainer.appendChild(logo);
    header.appendChild(imgContainer);
    nav.appendChild(toggleButton);
    nav.appendChild(hamburger);
    imgContainer.appendChild(title);
    header.appendChild(nav);

    return header;
}