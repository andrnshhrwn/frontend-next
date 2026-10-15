export async function fetchWaterMeters() {
  const res = await fetch('https://api.pdam-backend.com/v1/meters', {
    cache: 'no-store', // atau gunakan revalidate sesuai kebutuhan SSR/ISR Next.js
  });
  if (!res.ok) {
    throw new Error('Gagal mengambil data dari server');
  }
  return res.json();
}