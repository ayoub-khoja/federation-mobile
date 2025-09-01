// src/components/ServiceWorkerRegistration.tsx
"use client";
import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const isProd = process.env.NODE_ENV === "production";

    const devCleanup = async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations?.();
        regs?.forEach(r => r.unregister());
        const keys = await caches?.keys?.();
        await Promise.all(keys?.map(k => caches.delete(k)) ?? []);
        console.log("🧹 SW désenregistré et caches nettoyés (dev).");
      } catch (e) {
        console.warn("Nettoyage SW/caches en dev:", e);
      }
    };

    if (!isProd) {
      devCleanup();
      return;
    }

    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        console.log("✅ SW enregistré:", reg.scope);
      } catch (e) {
        console.error("❌ Échec enregistrement SW:", e);
      }
    })();
  }, []);

  return null;
}
