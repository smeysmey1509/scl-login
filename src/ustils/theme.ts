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