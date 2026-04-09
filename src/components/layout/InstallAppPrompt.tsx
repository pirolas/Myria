import { Download, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallAppPrompt() {
  const { canInstall, dismiss, promptInstall } = useInstallPrompt();
  const [isInstalling, setIsInstalling] = useState(false);

  if (!canInstall) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);

    try {
      const installed = await promptInstall();

      if (!installed) {
        setIsInstalling(false);
      }
    } catch {
      setIsInstalling(false);
    }
  };

  return (
    <div className="install-sheet page-enter">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="eyebrow text-accent-deep">Installa Mirya</div>
          <div className="mt-2 text-base font-semibold text-ink">
            Aprila dal telefono come una vera app
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">
            La trovi subito in home, si apre più in fretta e il timer resta più comodo da usare.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-muted"
          aria-label="Chiudi suggerimento installazione"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4">
        <Button
          fullWidth
          onClick={() => void handleInstall()}
          disabled={isInstalling}
          icon={<Download size={18} />}
          className="justify-between"
        >
          {isInstalling ? "Apertura installazione..." : "Installa Mirya sul telefono"}
        </Button>
      </div>
    </div>
  );
}
