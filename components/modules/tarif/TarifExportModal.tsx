import { ExportModal } from "@/components/ui";
import type { TarifExportOptions } from "@/types/tarif.types";

interface TarifExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalFiltered: number;
  totalAll: number;
  onExport: (options: TarifExportOptions) => void;
}

export default function TarifExportModal({
  isOpen,
  onClose,
  totalFiltered,
  totalAll,
  onExport,
}: TarifExportModalProps) {
  return (
    <ExportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ekspor Data Golongan Tarif"
      subtitle="Pilih cakupan data dan kolom yang ingin disertakan dalam file CSV."
      columns={[
        {
          id: "kode_tarif",
          label: "Kode Tarif",
          defaultChecked: true,
        },
        {
          id: "nama_tarif",
          label: "Nama Golongan Tarif",
          defaultChecked: true,
        },
        {
          id: "jumlahPelanggan",
          label: "Jumlah Pelanggan",
          defaultChecked: true,
        },
        {
          id: "id_tarif",
          label: "ID Tarif (UUID)",
          defaultChecked: false,
        },
      ]}
      totalFiltered={totalFiltered}
      totalAll={totalAll}
      onExport={onExport}
    />
  );
}
