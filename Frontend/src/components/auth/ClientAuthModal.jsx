import { Dialog, DialogContent } from "@/components/ui/dialog";
import ClientAuth from "../admin/ClientAuth";

export default function ClientAuthModal({ open, onClose, onSuccess }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <ClientAuth onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
