import { prisma } from './src/lib/prisma';

async function testAntrean() {
  try {
    // Cari pasien pertama
    const user = await prisma.user.findFirst({ where: { role: 'PASIEN' } });
    if (!user) {
      console.log('Tidak ada user pasien. Tolong login & daftar dulu.');
      return;
    }

    const pasien = await prisma.pasien.findUnique({ where: { userId: user.id } });
    if (!pasien) {
      console.log('User ada tapi detail pasien tidak ada.');
      return;
    }

    console.log('Mencoba memasukkan antrean untuk Pasien ID:', pasien.id);

    const antreanCount = await prisma.antrean.count({
      where: {
        tanggal: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(24, 0, 0, 0))
        }
      }
    });

    const antreanBaru = await prisma.antrean.create({
      data: {
        pasienId: pasien.id,
        tanggal: new Date(),
        noAntrean: antreanCount + 1,
        status: 'MENUNGGU'
      }
    });

    console.log(' BERHASIL! Antrean dibuat:', antreanBaru);
  } catch (error) {
    console.error('GAGAL ERROR PRISMA:', error);
  }
}

testAntrean();
