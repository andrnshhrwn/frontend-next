export default function SessionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h2 className="text-lg font-semibold">
          Tidak dapat memverifikasi sesi
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Server tidak dapat dihubungi. Periksa koneksi internet atau coba
          kembali.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
