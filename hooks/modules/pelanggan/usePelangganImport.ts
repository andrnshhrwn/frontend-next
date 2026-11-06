import { useState, type DragEvent } from "react";

import { pelangganService } from "@/services/pelangganService";

import type {
  ImportPelangganPreview,
  ImportPelangganResult,
} from "@/services/pelangganService";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

interface UsePelangganImportOptions {
  onImported: (count: number) => Promise<void>;
}

export function usePelangganImport({ onImported }: UsePelangganImportOptions) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportPelangganPreview | null>(
    null,
  );
  const [importResult, setImportResult] =
    useState<ImportPelangganResult | null>(null);

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const busy = loadingPreview || loadingImport;

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls", "csv"].includes(extension ?? "")) {
      setError("Format file harus .xlsx, .xls, atau .csv.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Ukuran file maksimal 2 MB.");
      return;
    }

    setFile(selectedFile);
    setPreviewData(null);
    setImportResult(null);
    setError("");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    if (busy || importResult) return;

    handleFileChange(e.dataTransfer.files?.[0] ?? null);
  };

  const handlePreview = async () => {
    if (!file) {
      setError("Pilih file terlebih dahulu.");
      return;
    }

    setLoadingPreview(true);
    setError("");
    setPreviewData(null);

    try {
      const result = await pelangganService.previewImport(file);
      setPreviewData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memproses file pelanggan.",
      );
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData?.can_import || previewData.rows.length === 0) {
      return;
    }

    setLoadingImport(true);
    setError("");

    try {
      const result = await pelangganService.confirmImport(previewData.rows);

      setImportResult(result);

      await onImported(result.imported_count);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengimpor data pelanggan.",
      );
    } finally {
      setLoadingImport(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewData(null);
    setImportResult(null);
    setError("");
  };

  const resetPreview = () => {
    setPreviewData(null);
    setError("");
  };

  return {
    file,
    previewData,
    importResult,
    loadingPreview,
    loadingImport,
    error,
    dragging,
    setDragging,
    busy,
    handleFileChange,
    handleDrop,
    handlePreview,
    handleConfirm,
    clearFile,
    resetPreview,
  };
}
