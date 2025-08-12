import { useEffect } from "react";

const useSidebarResize = (sidebarRef, isResizing, setSidebarWidth, setIsResizing) => {
  useEffect(() => {
    if (!isResizing) return;

    const resizeSidebar = (e) => {
      if (sidebarRef.current) {
        const sidebarLeft = sidebarRef.current.getBoundingClientRect().left;
        const newWidth = e.clientX - sidebarLeft;
        if (newWidth > 150 && newWidth < 400) {
          setSidebarWidth(newWidth);
        }
      }
    };

    const stopResizing = () => setIsResizing(false);

    window.addEventListener("mousemove", resizeSidebar);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", resizeSidebar);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, sidebarRef, setSidebarWidth, setIsResizing]);
};

export default useSidebarResize;
