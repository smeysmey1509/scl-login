export const toggleDarkMode = (enable: boolean) => {
    const root = document.documentElement;
    if (enable) {
        root.classList.add('dark');
        localStorage.setItem("isDark", "true");
    } else {
        root.classList.remove('dark');
        localStorage.setItem("isDark", "false");
    }
}

export const initializeDarkMode = () => {
    const saved = localStorage.getItem('isDark');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const enableDark = saved === null ? prefersDark : saved === 'true';
    if (enableDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};