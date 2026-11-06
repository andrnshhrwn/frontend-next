"use client";

import { Droplets, ShieldCheck } from "lucide-react";

export default function LoginBrandPanel() {
  return (
    <>
      {/* Panel informasi desktop */}
      <section className="hidden flex-col justify-between bg-primary p-10 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-md bg-white/15 p-3">
              <Droplets size={32} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">PAM Tirta Kamuning</h1>

              <p className="text-sm text-white/75">
                Sistem Informasi Pengelolaan Water Meter
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-4xl font-bold leading-tight">
              Pengelolaan water meter yang lebih terintegrasi.
            </h2>

            <p className="mt-5 max-w-md leading-7 text-white/80">
              Kelola data pelanggan, distribusi water meter, penugasan teknisi,
              dan proses validasi dalam satu sistem.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-md bg-white/10 p-4">
          <ShieldCheck size={28} />

          <div>
            <p className="font-semibold">Akses sistem terlindungi</p>

            <p className="text-sm text-white/75">
              Masuk menggunakan akun yang terdaftar.
            </p>
          </div>
        </div>
      </section>

      {/* Branding mobile */}
      <div className="mb-8 p-6 pb-0 sm:p-10 sm:pb-0 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary p-3 text-white">
            <Droplets size={28} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              PAM Tirta Kamuning
            </h1>

            <p className="text-sm text-gray-500">
              Sistem Informasi Water Meter
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
